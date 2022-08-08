<?php

namespace Drupal\wxt_ext_media\Plugin\EntityBrowser\Widget;

use Drupal\Core\Form\FormStateInterface;

/**
 * An Entity Browser widget for creating media entities from embed codes.
 *
 * @EntityBrowserWidget(
 *   id = "embed_code",
 *   label = @Translation("Embed Code"),
 *   description = @Translation("Allows creation of media entities from embed codes."),
 * )
 */
class EmbedCode extends EntityFormProxy {

  /**
   * {@inheritdoc}
   */
  public function getForm(array &$original_form, FormStateInterface $form_state, array $additional_widget_parameters) {
    $form = parent::getForm($original_form, $form_state, $additional_widget_parameters);

    $form['input'] = [
      '#type' => 'textarea',
      '#placeholder' => $this->t('Enter a URL...'),
      '#attributes' => [
        'class' => ['keyup-change'],
      ],
      '#ajax' => [
        'event' => 'change',
        'wrapper' => 'entity-form',
        'method' => 'html',
        'callback' => [static::class, 'ajax'],
      ],
      // I don't know why, but this is needed to display error messages.
      '#limit_validation_errors' => [
        ['input'],
      ],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  protected function getCurrentValue(FormStateInterface $form_state) {
    $value = parent::getCurrentValue($form_state);
    return trim($value);
  }

  /**
   * {@inheritdoc}
   */
  public function validate(array &$form, FormStateInterface $form_state) {
    $value = $this->getCurrentValue($form_state);

    if ($value) {
      parent::validate($form, $form_state);
    }
    elseif ($form_state->isSubmitted()) {
      $form_state->setError($form['widget']['input'], $this->t('You must enter a URL or embed code.'));
    }
  }

}
