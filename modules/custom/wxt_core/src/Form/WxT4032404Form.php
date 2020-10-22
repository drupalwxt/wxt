<?php

namespace Drupal\wxt_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * The WxT4032404Form provides a 403 to 404 redirect.
 *
 * @package Drupal\wxt_core\Form
 */
class WxT4032404Form extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wxt4032404_config_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $wxt4032404_admin_only = $this->config('wxt4032404.settings')->get('admin_only');

    $form['wxt4032404_admin_only'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enforce on Admin Paths'),
      '#description' => $this->t('Enforce the 404 behavior only on admin paths'),
      '#default_value' => $wxt4032404_admin_only,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save configuration'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('wxt4032404.settings')
      ->set('admin_only', $form_state->getValue('wxt4032404_admin_only'))
      ->save();
    parent::submitForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function getEditableConfigNames() {
    return ['wxt4032404.settings'];
  }

}
