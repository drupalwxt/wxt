<?php

namespace Drupal\wxt_core\Form;

use Drupal\field_ui\Form\EntityDisplayModeAddForm as BaseEntityDisplayModeAddForm;
use Drupal\wxt_core\EntityDescriptionFormTrait;

/**
 * Adds description support to the entity add form for entity display modes.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class EntityDisplayModeAddForm extends BaseEntityDisplayModeAddForm {

  use EntityDescriptionFormTrait;

}
