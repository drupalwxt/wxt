<?php

namespace Drupal\wxt_ext_workflow;

use Drupal\Core\Entity\EntityFormInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\autosave_form\Form\AutosaveEntityFormHandler as BaseAutosaveEntityFormHandler;

/**
 * Disables autosave in the Layout Builder interface.
 *
 * @internal
 *   This class is a temporary workaround to a limitation of autosave_form and
 *   is subject to change or removal at any time without warning. It should NOT
 *   be used in any way by external code!
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
final class AutosaveEntityFormHandler extends BaseAutosaveEntityFormHandler {

  /**
   * {@inheritdoc}
   */
  public function formAlter(array &$form, FormStateInterface $form_state) {
    $form_object = $form_state->getFormObject();

    if ($form_object instanceof EntityFormInterface && $form_object->getOperation() === 'layout_builder') {
      return;
    }
    else {
      parent::formAlter($form, $form_state);
    }
  }

}
