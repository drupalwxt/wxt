<?php

namespace Drupal\wxt\Context;

use Behat\Gherkin\Node\TableNode;
use Behat\Mink\Exception\ExpectationException;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\StringTranslation\PluralTranslatableMarkup as Plural;
use Drupal\DrupalExtension\Context\DrupalSubContextBase;
use Drupal\DrupalExtension\Hook\Scope\BeforeNodeCreateScope;
use Drupal\user\EntityOwnerInterface;

/**
 * Contains miscellaneous step definitions for working with Drupal entities.
 *
 * @internal
 *   This is an internal part of WxT Core's testing system and may be
 *   changed or removed at any time without warning. It should not be extended,
 *   instantiated, or used in any way by external code! If you need to use this
 *   functionality, you should copy the relevant code into your own project.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
final class EntityContext extends DrupalSubContextBase {

  /**
   * IDs of entities created during the scenario.
   *
   * The IDs are divided into groups, keyed by entity type ID.
   *
   * @var array
   */
  private $trash = [];

  /**
   * Saves an entity, ensuring automatic clean-up.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to save.
   */
  public function save(EntityInterface $entity) {
    $uid = $this->getCurrentUserUid();

    if ($uid && $entity instanceof EntityOwnerInterface && $entity->getOwnerId() == 0) {
      $entity->setOwnerId($uid)->save();
    }
    else {
      $entity->save();
      $entity_type = $entity->getEntityTypeId();
      $this->trash[$entity_type][] = $entity->id();
    }
  }

  /**
   * Creates a set of entities from tabular data.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param \Behat\Gherkin\Node\TableNode $table
   *   The table of entity data.
   *
   * @Given :entity_type entities:
   */
  public function createMultiple($entity_type, TableNode $table) {
    $storage = \Drupal::entityTypeManager()->getStorage($entity_type);

    foreach ($table as $values) {
      $this->save($storage->create($values));
    }
  }

  /**
   * Deletes entities created during the scenario.
   *
   * @afterScenario
   */
  public function tearDown() {
    foreach ($this->trash as $entity_type => $ids) {
      /** @var \Drupal\Core\Entity\EntityInterface[] $entities */
      $entities = \Drupal::entityTypeManager()
        ->getStorage($entity_type)
        ->loadMultiple($ids);

      foreach ($entities as $entity) {
        $entity->delete();
      }
    }
  }

  /**
   * Visits a randomly chosen entity of a specific type and (optional) bundle.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param string $bundle
   *   (optional) The bundle.
   *
   * @throws \Exception
   *   If there are no entities to visit.
   *
   * @When I visit (?:a|an) :entity_type
   * @When I visit (?:a|an) :bundle :entity_type
   */
  public function visitEntity($entity_type, $bundle = NULL) {
    $storage = \Drupal::entityTypeManager()->getStorage($entity_type);

    $query = $storage->getQuery();

    if ($bundle) {
      $key = $storage->getEntityType()->getKey('bundle');
      if ($key) {
        $query->condition($key, $bundle);
        $query->accessCheck(FALSE);
      }
    }

    $items = $query->execute();
    if ($items) {
      $id = reset($items);
      $url = $storage->load($id)->toUrl()->getInternalPath();
      $this->visitPath($url);
    }
    else {
      $label = $storage->getEntityType()->getPluralLabel();
      throw new \Exception("There are no $bundle $label available.");
    }
  }

  /**
   * Marks recently created entities to be deleted after the test scenario.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param int $n
   *   (optional) How many entities to delete.
   *
   * @When I delete the latest :entity_type
   * @When I delete the latest :entity_type entity
   * @When I delete the latest :n :entity_type entities
   */
  public function trashNewest($entity_type, $n = 1) {
    $items = \Drupal::entityTypeManager()
      ->getStorage($entity_type)
      ->getQuery()
      ->sort('created', 'DESC')
      ->range(0, $n)
      ->accessCheck(FALSE)
      ->execute();

    foreach ($items as $id) {
      $this->trash[$entity_type][] = $id;
    }
  }

  /**
   * Counts the number of entities of a specific type and optional bundle.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param string $bundle
   *   (optional) The bundle.
   *
   * @return int
   *   How many entities exist of the given type and bundle.
   */
  private function count($entity_type, $bundle = NULL) {
    $storage = \Drupal::entityTypeManager()->getStorage($entity_type);

    $query = $storage->getQuery()->count();

    if ($bundle) {
      $query->condition($storage->getEntityType()->getKey('bundle'), $bundle);
      $query->accessCheck(FALSE);
    }

    return (int) $query->execute();
  }

  /**
   * Asserts that entities of a specific type and optional bundle exist.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param int $n
   *   (optional) How many entities are expected to exist.
   * @param string $bundle
   *   (optional) The bundle.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If the number of existing entities does not match the expected number.
   *
   * @Then 1 :entity_type entity should exist
   * @Then 1 :bundle :entity_type entity should exist
   * @Then :n :entity_type entities should exist
   * @Then :n :bundle :entity_type entities should exist
   */
  public function assertCount($entity_type, $n = 1, $bundle = NULL) {
    $count = $this->count($entity_type, $bundle);

    if ($count !== (int) $n) {
      $message = sprintf(
        'Expected %s to exist, but there are only %s.',
        $this->formatCount($entity_type, $n),
        $this->formatCount($entity_type, $count)
      );
      throw new ExpectationException($message, $this->getSession()->getDriver());
    }
  }

  /**
   * Generates a formatted entity count string.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param int $n
   *   The number of entities.
   *
   * @see ::assertCount()
   *
   * @return string
   *   A formatted entity count string, e.g. '33 content items'.
   */
  private function formatCount($entity_type, $n) {
    $entity_type = \Drupal::entityTypeManager()->getDefinition($entity_type);

    return (string) new Plural(
      (int) $n,
      '@count ' . $entity_type->getSingularLabel(),
      '@count' . $entity_type->getPluralLabel()
    );
  }

  /**
   * Visits the edit form for an entity.
   *
   * @see wxt_dev_local_tasks_alter()
   *
   * @When I visit the edit form
   */
  public function edit() {
    $this
      ->assertSession()
      ->elementExists('named', ['link', 'edit-form'])
      ->click();
  }

  /**
   * Reacts when a node is created by Drupal Extension's step definition.
   *
   * @BeforeNodeCreate
   */
  public function onNodeCreate(BeforeNodeCreateScope $scope) {
    $node = $scope->getEntity();

    if (!isset($node->uid)) {
      $node->uid = $this->getCurrentUserUid();
    }
  }

  /**
   * Gets the current user's UID.
   *
   * @return int
   *   Returns the current user's UID if there is one or 0 if not.
   */
  protected function getCurrentUserUid() {
    $user = $this->getUserManager()->getCurrentUser();
    return $user ? $user->uid : 0;
  }

  /**
   * Visits a specific revision of a node.
   *
   * @param int $n
   *   The one-based index of the revision.
   *
   * @When /^I visit the (\d+)(?:st|nd|rd|th) revision$/
   */
  public function visitRevision($n) {
    $this->assertSession()
      ->elementExists('named', ['link', 'Revisions'])
      ->click();

    $this->getContext(ElementContext::class)
      ->click("main table tr:nth-child($n) td:first-child a");
  }

  /**
   * Visits the current revision of a node.
   *
   * @When I visit the current revision
   */
  public function visitCurrentRevision() {
    $this->assertSession()
      ->elementExists('named', ['link', 'Revisions'])
      ->click();

    $session = $this->getSession();

    // The revision table's selector may vary depending on whether or not Diff
    // is installed, so we need to use a pretty general selector.
    $rows = $session->getPage()->findAll('css', 'main table > tbody tr');
    /** @var \Behat\Mink\Element\NodeElement $row */
    foreach ($rows as $row) {
      if ($row->find('css', 'td:last-child')->getText() == 'Current revision') {
        return $row->find('css', 'td:first-child a')->click();
      }
    }

    // None of the rows were the current revision.
    throw new ExpectationException('Current revision not found.', $session->getDriver());
  }

}
