<?php

namespace Drupal\wxt_core\Entity;

use Drupal\Core\Entity\Entity\EntityFormMode as BaseEntityFormMode;
use Drupal\Core\Entity\EntityDescriptionInterface;
use Drupal\wxt_core\ConfigEntityDescriptionTrait;

/**
 * Adds description support to entity form modes.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class EntityFormMode extends BaseEntityFormMode implements EntityDescriptionInterface {

  use ConfigEntityDescriptionTrait;

}
