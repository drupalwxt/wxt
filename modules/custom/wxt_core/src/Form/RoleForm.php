<?php

namespace Drupal\wxt_core\Form;

use Drupal\wxt_core\EntityDescriptionFormTrait;
use Drupal\user\RoleForm as BaseRoleForm;

/**
 * Adds description support to the user role entity form.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class RoleForm extends BaseRoleForm {

  use EntityDescriptionFormTrait;

}
