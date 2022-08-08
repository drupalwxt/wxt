<?php

namespace Drupal\wxt_core\Entity;

use Drupal\Core\Entity\Entity\EntityFormMode as BaseEntityFormMode;
use Drupal\Core\Entity\EntityDescriptionInterface;
use Drupal\wxt_core\ConfigEntityDescriptionTrait;

/**
 * Adds description support to entity form modes.
 */
class EntityFormMode extends BaseEntityFormMode implements EntityDescriptionInterface {

  use ConfigEntityDescriptionTrait;

}
