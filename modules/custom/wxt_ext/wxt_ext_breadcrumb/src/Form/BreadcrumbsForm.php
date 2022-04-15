<?php

namespace Drupal\wxt_ext_breadcrumb\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Breadcrumbs form class, handles dynamic add/remove items.
 */
class BreadcrumbsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wxt_ext_breadcrumb_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['wxt_ext_breadcrumb.settings'];
  }

  // @todo form layout side-by-side columns for FR and EN

  /**
   * Provide n Number of breadcrumbs which will be prefixed after Canada.ca.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $langcode = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $config = $this->config('wxt_ext_breadcrumb.settings');

    $form = [];

    $i = 0;
    $crumbtitle_field = $form_state->get('num_crumbs');
    $num_vals = 0;

    if (empty($crumbtitle_field) && $config->get('en')) {
      foreach ($config->get('en') as $key => $val) {
        if (is_numeric($key) && isset($val['en_crumb']) && !empty($val['en_crumb'])) {
          $num_vals++;
        }
      }
      $crumbtitle_field = $num_vals;
    }

    if ($num_vals > 0) {
      $form_state->set('num_crumbs', $num_vals);
    }

    $form['#tree'] = TRUE;

    /*
     * Home breadcrumb
     */
    $form['wxt_ext_breadcrumb_home'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Home breadcrumb link'),
    ];

    $form['wxt_ext_breadcrumb_home']['enable_app_breadcrumb'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Label the home breadcrumb link with application name'),
      '#default_value' => $config->get('enable_app_breadcrumb'),
    ];

    /*
     * Leading breadcrumbs
     */
    $form['wxt_ext_breadcrumb'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Leading breadcrumbs'),
      '#prefix' => '<div id="crumbs-fieldset-wrapper">',
      '#suffix' => '</div>',
    ];

    $form['wxt_ext_breadcrumb']['description'] = [
      '#markup' => '<div>' . $this->t('Add leading breadcrumbs, which appear before application specific breadcrumbs.') . '</div>',
    ];

    if (empty($crumbtitle_field)) {
      $form_state->set('num_crumbs', 1);
    }

    $form['wxt_ext_breadcrumb']['enable_wxt_breadcrumbs'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable leading breadcrumbs'),
      '#default_value' => $config->get('enable_wxt_breadcrumbs'),
    ];

    $form['wxt_ext_breadcrumb'][0]['set-0'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Breadcrumb %count', ['%count' => '1']),
    ];

    $form['wxt_ext_breadcrumb'][0]['set-0']['en_crumb'] = [
      '#type' => 'textfield',
      '#default_value' => $config->get('en')[0]['en_crumb'] ?? 'Canada.ca',
      '#title' => $this->t('English breadcrumb text'),
    ];

    $form['wxt_ext_breadcrumb'][0]['set-0']['en_url'] = [
      '#type' => 'textfield',
      '#default_value' => $config->get('en')[0]['en_url'] ?? 'https://www.canada.ca/en',
      '#title' => $this->t('English breadcrumb URL'),
    ];

    $form['wxt_ext_breadcrumb'][0]['set-0']['fr_crumb'] = [
      '#type' => 'textfield',
      '#default_value' => $config->get('fr')[0]['en_url'] ?? 'Canada.ca',
      '#title' => $this->t('French breadcrumb text'),
    ];

    $form['wxt_ext_breadcrumb'][0]['set-0']['fr_url'] = [
      '#type' => 'textfield',
      '#default_value' => $config->get('fr')[0]['en_url'] ?? 'https://www.canada.ca/fr',
      '#title' => $this->t('French breadcrumb URL'),
    ];

    for ($i = 1; $i < $crumbtitle_field; $i++) {
      $form['wxt_ext_breadcrumb'][$i]['set-' . $i] = [
        '#type' => 'fieldset',
        '#title' => $this->t('Breadcrumb') . ' ' . ($i + 1),
      ];
      $form['wxt_ext_breadcrumb'][$i]['set-' . $i]['en_crumb'] = [
        '#type' => 'textfield',
        '#default_value' => $config->get('en')[$i]['en_crumb'] ?? '',
        '#title' => $this->t('English breadcrumb text'),
      ];
      $form['wxt_ext_breadcrumb'][$i]['set-' . $i]['en_url'] = [
        '#type' => 'textfield',
        '#default_value' => $config->get('en')[$i]['en_url'] ?? '',
        '#title' => $this->t('English breadcrumb URL'),
      ];
      $form['wxt_ext_breadcrumb'][$i]['set-' . $i]['fr_crumb'] = [
        '#type' => 'textfield',
        '#default_value' => $config->get('fr')[$i]['fr_crumb'] ?? '',
        '#title' => $this->t('French breadcrumb text'),
      ];
      $form['wxt_ext_breadcrumb'][$i]['set-' . $i]['fr_url'] = [
        '#type' => 'textfield',
        '#default_value' => $config->get('fr')[$i]['fr_url'] ?? '',
        '#title' => $this->t('French breadcrumb URL'),
      ];
    }

    $form['actions'] = [
      '#type' => 'actions',
    ];

    $form['wxt_ext_breadcrumb']['actions']['add_crumb'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add one more'),
      '#submit' => ['::addOne'],
      '#ajax' => [
        'callback' => '::addmoreCallback',
        'wrapper' => 'crumbs-fieldset-wrapper',
      ],
    ];

    if ($crumbtitle_field > 1) {
      $form['wxt_ext_breadcrumb']['actions']['remove_crumb'] = [
        '#type' => 'submit',
        '#value' => $this->t('Remove one'),
        '#submit' => ['::removeCallback'],
        '#ajax' => [
          'callback' => '::addmoreCallback',
          'wrapper' => 'crumbs-fieldset-wrapper',
        ],
      ];
    }

    $form_state->setCached(FALSE);

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * Submit callback for the add one button.
   */
  public function addOne(array &$form, FormStateInterface &$form_state) {
    $crumbtitle_field = $form_state->get('num_crumbs');
    $add_button = $crumbtitle_field + 1;
    $form_state->set('num_crumbs', $add_button);
    $form_state->setRebuild();
  }

  /**
   * Callback function to add another breadcrumb group.
   */
  public function addmoreCallback(array &$form, FormStateInterface &$form_state) {
    $crumbtitle_field = $form_state->get('num_crumbs');
    return $form['wxt_ext_breadcrumb'];
  }

  /**
   * Callback function to add remove a breadcrumb group.
   */
  public function removeCallback(array &$form, FormStateInterface &$form_state) {
    $crumbtitle_field = $form_state->get('num_crumbs');

    if ($crumbtitle_field > 1) {
      $remove_button = $crumbtitle_field - 1;
      $form_state->set('num_crumbs', $remove_button);
    }

    $form_state->setRebuild();
  }

  /**
   * Validate form, ensure https for crumb url enforce external to this site.
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValue('wxt_ext_breadcrumb');
    $settings = $this->configFactory->getEditable('wxt_ext_breadcrumb.settings');
    $values_en = [];
    $values_fr = [];
    $debug = [];
    $cnt = 0;

    foreach ($values as $fieldset_key => $fieldset_values) {
      if (isset($fieldset_values['en_crumb'])) {
        $values_en[$cnt]['en_crumb'] = $fieldset_values['en_crumb'];
      }
      if (isset($fieldset_values['en_url'])) {
        $values_en[$cnt]['en_url'] = $fieldset_values['en_url'];
      }
      if (isset($fieldset_values['fr_crumb'])) {
        $values_fr[$cnt]['fr_crumb'] = $fieldset_values['fr_crumb'];
      }
      if (isset($fieldset_values['fr_url'])) {
        $values_fr[$cnt]['fr_url'] = $fieldset_values['fr_url'];
      }
      if (isset($fieldset_values['en_url'])) {
        $urlVal = $this->getUrlByKey($values_en, $cnt);
        if (strlen($urlVal) < 11 || stripos($urlVal, 'http') < 0) {
          $form_state->setErrorByName('en_url', $this->t('Please provide a valid external url.'));
          // @todo improve this with the api validate urls
          // https://api.drupal.org/api/drupal/vendor%21symfony%21validator%21Constraints%21UrlValidator.php/class/UrlValidator/9.0.x
        }
      }
      if (isset($fieldset_values['fr_url'])) {
        $urlVal = $this->getUrlByKey($values_en, $cnt);
        if (strlen($urlVal) < 11 || stripos($urlVal, 'http') < 0) {
          $form_state->setErrorByName('fr_url', $this->t('Please provide a valid external url.'));
          // @todo improve this with the api validate urls
          // https://api.drupal.org/api/drupal/vendor%21symfony%21validator%21Constraints%21UrlValidator.php/class/UrlValidator/9.0.x
        }
      }
      if (isset($fieldset_values['en_crumb'])) {
        $urlVal = $this->getUrlByKey($values_en, $cnt);
        if (strlen($urlVal) < 2) {
          $form_state->setErrorByName('en_crumb', $this->t('Please provide a valid breadcrumb name.'));
          // @todo improve this with the api validate urls
          // https://api.drupal.org/api/drupal/vendor%21symfony%21validator%21Constraints%21UrlValidator.php/class/UrlValidator/9.0.x
        }
      }
      if (isset($fieldset_values['fr_crumb'])) {
        $urlVal = $this->getUrlByKey($values_fr, $cnt);
        if (strlen($urlVal) < 2) {
          $form_state->setErrorByName('fr_crumb', $this->t('Please provide a valid breadcrumb name.'));
          // @todo improve this with the api validate urls
          // https://api.drupal.org/api/drupal/vendor%21symfony%21validator%21Constraints%21UrlValidator.php/class/UrlValidator/9.0.x
        }
      }

      $cnt++;
    }

  }

  /**
   * Submit handler store configuration for use in wxt_ext_breadcrumb.module.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValue('wxt_ext_breadcrumb');

    $settings = $this->configFactory->getEditable('wxt_ext_breadcrumb.settings');
    $values_en = [];
    $values_fr = [];
    $debug = [];
    $cnt = '0';

    foreach ($values as $fieldset_key => $fieldset_values) {
      if (is_numeric($fieldset_key)) {
        if (isset($fieldset_values['set-' . $cnt]['en_crumb'])) {
          $values_en[$cnt]['en_crumb'] = $fieldset_values['set-' . $cnt]['en_crumb'];
        }
        if (isset($fieldset_values['set-' . $cnt]['en_url'])) {
          $values_en[$cnt]['en_url'] = $fieldset_values['set-' . $cnt]['en_url'];
        }
        if (isset($fieldset_values['set-' . $cnt]['fr_crumb'])) {
          $values_fr[$cnt]['fr_crumb'] = $fieldset_values['set-' . $cnt]['fr_crumb'];
        }
        if (isset($fieldset_values['set-' . $cnt]['fr_url'])) {
          $values_fr[$cnt]['fr_url'] = $fieldset_values['set-' . $cnt]['fr_url'];
        }

        $cnt++;
      }
    }

    $settings->set('en', $values_en);
    $settings->set('fr', $values_fr);
    $settings->set('enable_wxt_breadcrumbs', $values['enable_wxt_breadcrumbs']);
    $settings->set('enable_app_breadcrumb', $form_state->getValue('wxt_ext_breadcrumb_home')['enable_app_breadcrumb']);
    $settings->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * Helper function for form validation of urls.
   */
  private function getUrlByKey($values, $level = 0) {
    $cnt = count($values);
    $innerCnt = 0;

    foreach ($values as $key => $v) {
      $innerCnt++;

      if ($values[$key] == $values[$level]) {
        foreach ($v as $cle => $innerV) {
          if ($cle == 'en_url') {
            return $innerV;
          }
          if ($cle == 'fr_url') {
            return $innerV;
          }
        }
      }
    }
  }

}
