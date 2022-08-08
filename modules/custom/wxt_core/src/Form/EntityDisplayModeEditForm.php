<?php

namespace Drupal\wxt_core\Form;

use Drupal\field_ui\Form\EntityDisplayModeEditForm as BaseEntityDisplayModeEditForm;
use Drupal\wxt_core\EntityDescriptionFormTrait;

/**
 * Adds description support to the entity edit form for entity display modes.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class EntityDisplayModeEditForm extends BaseEntityDisplayModeEditForm {

  use EntityDescriptionFormTrait;

}
