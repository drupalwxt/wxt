<?php

namespace Drupal\wxt_core\Entity;

use Drupal\Core\Entity\Entity\EntityViewMode as BaseEntityViewMode;
use Drupal\Core\Entity\EntityDescriptionInterface;
use Drupal\wxt_core\ConfigEntityDescriptionTrait;

/**
 * Adds description support to entity view modes.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class EntityViewMode extends BaseEntityViewMode implements EntityDescriptionInterface {

  use ConfigEntityDescriptionTrait;

  /**
   * {@inheritdoc}
   *
   * This should be removed https://www.drupal.org/node/2907654
   */
  protected function urlRouteParameters($rel) {
    $parameters = parent::urlRouteParameters($rel);

    if (empty($parameters['entity_type_id'])) {
      $parameters['entity_type_id'] = $this->getTargetType();
    }

    return $parameters;
  }

}
