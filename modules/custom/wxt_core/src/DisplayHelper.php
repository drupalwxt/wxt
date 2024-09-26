<?php

namespace Drupal\wxt_core;

use Drupal\Core\Entity\Display\EntityDisplayInterface;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Helps query and configure various display settings.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class DisplayHelper {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The entity field manager.
   *
   * @var \Drupal\Core\Entity\EntityFieldManagerInterface
   */
  protected $entityFieldManager;

  /**
   * DisplayHelper constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\Entity\EntityFieldManagerInterface $entity_field_manager
   *   The entity field manager.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityFieldManagerInterface $entity_field_manager) {
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFieldManager = $entity_field_manager;
  }

  /**
   * Returns the first available preferred view mode.
   *
   * @param string $entity_type
   *   The entity type ID.
   * @param string $bundle
   *   The bundle.
   * @param string[] $preferences
   *   The view mode IDs to check, in descending order of preference.
   *
   * @return string
   *   The first preferred view mode ID that has a view display associated with
   *   it. If there are none, falls back to the default view mode.
   */
  public function getPreferredMode($entity_type, $bundle, array $preferences) {
    $displays = $this->entityTypeManager
      ->getStorage('entity_view_display')
      ->getQuery()
      ->execute();

    foreach ($preferences as $view_mode) {
      if (in_array($entity_type . '.' . $bundle . '.' . $view_mode, $displays)) {
        return $view_mode;
      }
    }
    return 'default';
  }

  /**
   * Returns the components newly added to a display.
   *
   * @param \Drupal\Core\Entity\Display\EntityDisplayInterface $display
   *   The display config entity.
   *
   * @return array
   *   The newly added components.
   */
  public function getNewComponents(EntityDisplayInterface $display) {
    if (isset($display->original)) {
      return array_diff_key($display->getComponents(), $display->original->getComponents());
    }
    else {
      return [];
    }
  }

  /**
   * Returns newly added field components, optionally filtered by a function.
   *
   * @param \Drupal\Core\Entity\Display\EntityDisplayInterface $display
   *   The display config entity.
   * @param callable $filter
   *   (optional) The function on which to filter the fields, accepting the
   *   field storage definition as an argument.
   *
   * @return array
   *   The newly added components.
   */
  public function getNewFields(EntityDisplayInterface $display, ?callable $filter = NULL) {
    $fields = $this->entityFieldManager->getFieldStorageDefinitions(
      $display->getTargetEntityTypeId()
    );
    if ($filter) {
      $fields = array_filter($fields, $filter);
    }
    return array_intersect_key($this->getNewComponents($display), $fields);
  }

}
