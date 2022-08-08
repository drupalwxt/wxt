<?php

namespace Drupal\wxt_core\Form;

use Drupal\field_ui\Form\EntityFormModeAddForm as BaseEntityFormModeAddForm;
use Drupal\wxt_core\EntityDescriptionFormTrait;

/**
 * Adds description support to the entity add form for entity form modes.
 */
class EntityFormModeAddForm extends BaseEntityFormModeAddForm {

  use EntityDescriptionFormTrait;

}
