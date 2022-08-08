<?php

namespace Drupal\wxt_core\Form;

use Drupal\wxt_core\EntityDescriptionFormTrait;
use Drupal\user\RoleForm as BaseRoleForm;

/**
 * Adds description support to the user role entity form.
 */
class RoleForm extends BaseRoleForm {

  use EntityDescriptionFormTrait;

}
