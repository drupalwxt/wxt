<?php

namespace Drupal\wxt_core\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Link;
use Drupal\Core\Url;

/**
 * The settings form for controlling WxT Core Country lists.
 */
class CountriesWhitelistForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['wxt_core_countries.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wxt_core_countries_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $countryManager = \Drupal::service('wxt.country_whitelist');
    $config = $this->config('wxt_core_countries.settings');
    $savedCountries = $config->get('countries');
    $whitelisted = $countryManager->getCountryData();
    $options = $countryManager->listCounties();
    foreach ($options as $key => $country) {
      $options[$key] = (isset($whitelisted[$key]) ? $whitelisted[$key] . ' | ' : '') . $country;
    }
    // Reminder:  This makes them in order of their Code (Canada first!)
    \asort($options);
    $title = $this->t('Standard Classification of Countries and Areas of Interest');
    // https://www.statcan.gc.ca/node/9932
    $govOverviewUri = Url::fromUri('https://www.statcan.gc.ca/en/subjects/standard/sccai/sccaiinfo1', ['attributes' => ['target' => '_blank']]);
    $govOverview = Link::fromTextAndUrl($title . '  (SCCAI)', $govOverviewUri);
    $dataSourceUri = Url::fromUri('https://www150.statcan.gc.ca/n1/en/catalogue/12-608-X', ['attributes' => ['target' => '_blank']]);
    $dataSource = Link::fromTextAndUrl('SCCAI 2019 (PDF Source) | October 21, 2020', $dataSourceUri);
    $count = \count($whitelisted);

    $form['header-intro'] = [
      '#type' => 'markup',
      '#weight' => -100,
      '#markup' => '<h2>' . $title . '</h2><ul>
      <li>' . $this->t('The @intro has been developed to increase coherence of the list of countries used within Statistics Canada and includes countries and areas for which statistical data are compiled. @source is the version used for this Data Sheet.', [
        '@intro' => $govOverview->toString(),
        '@source' => $dataSource->toString(),
      ]) . '</strong></li>
      <li>' . $this->t('@count currently in Data Sheet', ['@count' => $count]) . '</li>
      </ul>',
    ];

    $form['countries_fieldset'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('WXT Country Whitelist'),
    ];

    $form['countries_fieldset']['whitelist-sort'] = [
      '#type' => 'select',
      '#title' => t('Sorting preference for final list'),
      '#options' => [
        'code' => t('SCCAI Code'),
        'alpha' => t('Alphabetical'),
      ],
      '#default_value' => $config->get('whitelist-sort'),
    ];

    $form['countries_fieldset']['abbr'] = [
      '#type' => 'details',
      '#open' => TRUE,
      '#title' => $this->t('WXT Country Whitelist'),
      '#description' => $this->t('Items are sorted by <q>SCCAI Code</q>.  Countries not found in Data Sheet will appear at the end of all items with a code, these sould remain un-checked.'),
    ];

    $form['countries_fieldset']['abbr']['countries'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Select Countries to Show'),
      '#options' => $options,
      '#default_value' => $savedCountries,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('wxt_core_countries.settings')
      ->set('countries', $form_state->getValue('countries'))
      ->set('whitelist-sort', $form_state->getValue('whitelist-sort'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
