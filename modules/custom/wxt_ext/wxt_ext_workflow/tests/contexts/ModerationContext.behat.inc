<?php

namespace Drupal\wxt\Context;

use Behat\Mink\Element\DocumentElement;
use Behat\Mink\Element\NodeElement;
use Behat\Mink\Exception\ElementNotFoundException;
use Behat\Mink\Exception\ExpectationException;
use Behat\MinkExtension\Context\RawMinkContext;
use Drupal\DrupalDriverManager;
use Drupal\DrupalExtension\Context\DrupalSubContextInterface;

/**
 * Contains miscellaneous step definitions for testing moderation UIs.
 *
 * @internal
 *   This is an internal part of WxT Extend Workflow's testing system and may be
 *   changed or removed at any time without warning. External code should not
 *   extend, instantiate, or use this class in any way! If you want to use the
 *   functionality of this class, you should copy the relevant code into your
 *   own project.
 */
final class ModerationContext extends RawMinkContext implements DrupalSubContextInterface {

  /**
   * {@inheritdoc}
   */
  public function __construct(DrupalDriverManager $drupal) {
  }

  /**
   * Opens the moderation sidebar.
   *
   * @When I open the moderation sidebar
   *
   * @throws \Behat\Mink\Exception\ElementNotFoundException
   *   If the moderation sidebar does not appear on the page.
   */
  public function openModerationSidebar() {
    $this->assertSession()
      ->elementExists('css', '#toolbar-bar')
      ->clickLink('Tasks');

    $session = $this->getSession();

    $sidebar = $session->getPage()
      ->waitFor(10, function (DocumentElement $page) {
        return $page->find('css', '.moderation-sidebar-container');
      });

    if (empty($sidebar)) {
      throw new ElementNotFoundException($session->getDriver(), 'element', 'css', '.moderation-sidebar-container');
    }
  }

  /**
   * Asserts that the "Tasks" toolbar link indicates a moderation state.
   *
   * @param string $state
   *   The label of the expected moderation state.
   *
   * @Then the current moderation state should be :state
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If the current moderation state is not the expected one.
   */
  public function assertCurrentModerationState($state) {
    $assert_session = $this->assertSession();
    $toolbar = $assert_session->elementExists('css', '#toolbar-bar');
    $current_state = $assert_session->elementExists('named', ['link', 'Tasks'], $toolbar)
      ->getAttribute('data-label');

    if ($current_state !== $state) {
      throw new ExpectationException("Expected the current moderation state to be $state, but it is $current_state.", $this->getSession()->getDriver());
    }
  }

  /**
   * Asserts the presence of the moderation dashboard.
   *
   * @Then I should see a dashboard for moderating content
   */
  public function assertModerationDashboard() {
    $this->assertBlock('views_block:content_moderation_dashboard_in_review-block_1');
    $this->assertBlock('views_block:content_moderation_dashboard_in_review-block_2');
    $this->assertBlock('moderation_dashboard_activity');
    $this->assertBlock('views_block:moderation_dashboard_recently_created-block_1');
    $this->assertBlock('views_block:content_moderation_dashboard_in_review-block_3');
    $this->assertBlock('views_block:moderation_dashboard_recent_changes-block_1');
    $this->assertBlock('views_block:moderation_dashboard_recent_changes-block_2');
    $this->assertBlock('views_block:moderation_dashboard_recently_created-block_2');
  }

  /**
   * Autosaves the current form.
   *
   * @When I wait for my work to be autosaved
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If the autosave notification does not appear or disappear as expected.
   */
  public function awaitAutosave() {
    $driver = $this->getSession()->getDriver();

    $element = $this->assertSession()
      ->elementExists('css', '#autosave-notification');

    $is_visible = $element->waitFor(20, function (NodeElement $element) {
      return $element->isVisible();
    });
    if ($is_visible == FALSE) {
      throw new ExpectationException('Expected autosave notification to appear, but it did not.', $driver);
    }

    $is_hidden = $element->waitFor(10, function (NodeElement $element) {
      return $element->isVisible() === FALSE;
    });
    if ($is_hidden == FALSE) {
      throw new ExpectationException('Expected autosave notification to disappear after saving, but it did not.', $driver);
    }
  }

  /**
   * Restores autosaved work.
   *
   * @Then I should be able to restore my work
   *
   * @throws \Behat\Mink\Exception\ElementNotFoundException
   *   If the "Resume editing" button does not appear.
   */
  public function assertRestoreFromAutosave() {
    $session = $this->getSession();

    /** @var \Behat\Mink\Element\NodeElement $button */
    $button = $session->getPage()
      ->waitFor(10, function (DocumentElement $page) {
        return $page->findButton('Resume editing');
      });

    if ($button) {
      $button->press();
    }
    else {
      throw new ElementNotFoundException($session->getDriver(), 'button', 'named', 'Resume editing');
    }
  }

  /**
   * Compares two revisions of a node.
   *
   * @param string $a
   *   The one-based index of a revision to compare. 1st is oldest.
   * @param string $b
   *   The one-based index of a revision to compare. 1st is oldest.
   *
   * @When I compare the :a and :b revisions
   */
  public function compareRevisions($a, $b) {
    $page = $this->getSession()->getPage();

    $re = '/^[0-9]+(st|nd|rd|th)$/i';

    if (preg_match($re, $a)) {
      $a = substr($a, 0, -2);
    }
    if (preg_match($re, $b)) {
      $b = substr($b, 0, -2);
    }
    $a = ((int) $a) - 1;
    $b = ((int) $b) - 1;

    $page->clickLink('Revisions');

    /** @var \Behat\Mink\Element\NodeElement[] $rows */
    $rows = $page->findAll('css', '.diff-revisions tbody tr');
    $rows = array_reverse($rows);
    $a = $rows[$a]->findField('radios_left')->getValue();
    $b = $rows[$b]->findField('radios_right')->getValue();

    $page->selectFieldOption('radios_left', $a);
    $page->selectFieldOption('radios_right', $b);
    $page->pressButton('Compare');
  }

  /**
   * Asserts that Quick Edit is enabled for at least one entity on the page.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If Quick Edit is disabled on the current page.
   *
   * @Then Quick Edit should be enabled
   */
  public function assertQuickEditEnabled() {
    $session = $this->getSession();

    $is_enabled = $session->wait(10000, 'Drupal.quickedit.collections.entities.length > 0');

    if (empty($is_enabled)) {
      throw new ExpectationException('Expected Quick Edit to be enabled, but it is not.', $session->getDriver());
    }
  }

  /**
   * Asserts that Quick Edit is not enabled for any entities on the page.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   *   If Quick Edit is enabled on the current page.
   *
   * @Then Quick Edit should be disabled
   */
  public function assertQuickEditDisabled() {
    $session = $this->getSession();

    $is_disabled = $session->wait(10000, 'Drupal.quickedit.collections.entities.length === 0');

    if (empty($is_disabled)) {
      throw new ExpectationException('Expected Quick Edit to be disabled, but it is not.', $session->getDriver());
    }
  }

  /**
   * Asserts that a block exists with a Quick Edit contextual link.
   *
   * @param string $plugin
   *   The block plugin ID.
   *
   * @Then I should see a :plugin block with Quick Edit
   */
  public function assertQuickEditableBlock($plugin) {
    $block = $this->assertBlock($plugin);

    $assert = $this->assertSession();
    $links = $assert->elementExists('css', 'ul.contextual-links', $block);
    $assert->elementExists('named', ['link', 'Quick edit'], $links);
  }

  /**
   * Asserts the presence of a particular block by its plugin ID.
   *
   * @param string $plugin_id
   *   The block plugin ID.
   *
   * @return \Behat\Mink\Element\ElementInterface
   *   The block element.
   */
  private function assertBlock($plugin_id) {
    return $this->assertSession()
      ->elementExists('css', '[data-block-plugin-id="' . $plugin_id . '"]');
  }

}
