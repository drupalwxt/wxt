<?php

namespace Drupal\wxt_core\Entity;

use Drupal\Core\Entity\EntityDescriptionInterface;
use Drupal\user\Entity\Role as BaseRole;
use Drupal\wxt_core\ConfigEntityDescriptionTrait;

/**
 * Adds description support to user roles.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Role extends BaseRole implements EntityDescriptionInterface {

  use ConfigEntityDescriptionTrait;

}
