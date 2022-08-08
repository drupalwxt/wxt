<?php

namespace Drupal\wxt_core\Entity;

use Drupal\Core\Entity\EntityDescriptionInterface;
use Drupal\wxt_core\ConfigEntityDescriptionTrait;
use Drupal\user\Entity\Role as BaseRole;

/**
 * Adds description support to user roles.
 */
class Role extends BaseRole implements EntityDescriptionInterface {

  use ConfigEntityDescriptionTrait;

}
