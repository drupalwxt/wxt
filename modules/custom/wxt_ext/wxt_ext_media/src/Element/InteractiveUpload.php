<?php

namespace Drupal\wxt_ext_media\Element;

use Drupal\Component\Utility\NestedArray;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element\FormElement;
use Drupal\file\Entity\File;

/**
 * A form element for uploading or deleting files interactively.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 *
 * @FormElement("interactive_upload")
 */
class InteractiveUpload extends FormElement {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    return [
      '#tree' => TRUE,
      '#input' => TRUE,
      '#title' => NULL,
      '#default_value' => NULL,
      '#process' => [
        [static::class, 'process'],
      ],
      '#required' => FALSE,
      '#upload_location' => 'public://',
      '#upload_validators' => [],
    ];
  }

  /**
   * Processes the element.
   *
   * @param array $element
   *   The unprocessed element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return array
   *   The processed element.
   */
  public static function process(array $element, FormStateInterface $form_state) {
    $element['fid'] = [
      '#type' => 'hidden',
    ];
    // This must be called upload_button in order to account for a leaky
    // abstraction in Drupal core as of 8.7.x.
    // @see https://www.drupal.org/project/wxt_ext_media/issues/3056908
    $element['upload_button'] = $element['remove'] = [
      '#type' => 'submit',
      '#is_button' => TRUE,
      '#limit_validation_errors' => [
        $element['#parents'],
      ],
      '#weight' => 100,
    ];

    $element['upload_button']['#value'] = t('Upload');
    $element['upload_button']['#submit'][] = [static::class, 'upload'];

    $element['remove']['#value'] = t('Remove');
    $element['remove']['#submit'][] = [static::class, 'remove'];

    $key = array_merge($element['#parents'], ['fid']);
    // Don't use $form_state->hasValue(), because it will return TRUE if the
    // value exists and is falsy. Valid file IDs will always be truthy.
    $fid = $form_state->getValue($key);

    if ($fid) {
      $element['fid']['#value'] = $fid;

      $element['file'] = [
        '#theme' => 'file_link',
        '#file' => File::load($fid),
      ];
      $element['upload_button']['#access'] = FALSE;
    }
    else {
      $element['file'] = [
        '#type' => 'upload',
        '#title' => $element['#title'],
        '#required' => $element['#required'],
        '#upload_location' => $element['#upload_location'],
        '#upload_validators' => $element['#upload_validators'],
      ];
      $element['remove']['#access'] = FALSE;
    }
    return $element;
  }

  /**
   * Returns the root element for a triggering element.
   *
   * @param array $form
   *   The complete form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return array
   *   The root element that contains the triggering element.
   */
  public static function el(array &$form, FormStateInterface $form_state) {
    $trigger = $form_state->getTriggeringElement();
    return NestedArray::getValue($form, array_slice($trigger['#array_parents'], 0, -1));
  }

  /**
   * Handles form submission when the Upload button is clicked.
   *
   * @param array $form
   *   The complete form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   */
  public static function upload(array &$form, FormStateInterface $form_state) {
    $el = static::el($form, $form_state);

    $form_state->setValueForElement($el['fid'], $el['file']['#value']);
    NestedArray::setValue($form_state->getUserInput(), $el['fid']['#parents'], $el['file']['#value']);

    $form_state->setRebuild();
  }

  /**
   * Handles form submission when the Remove button is clicked.
   *
   * @param array $form
   *   The complete form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   */
  public static function remove(array &$form, FormStateInterface $form_state) {
    $el = static::el($form, $form_state);

    Upload::delete($el['fid']);

    $form_state->setValueForElement($el['fid'], NULL);
    NestedArray::setValue($form_state->getUserInput(), $el['fid']['#parents'], NULL);

    $form_state->setRebuild();
  }

}
