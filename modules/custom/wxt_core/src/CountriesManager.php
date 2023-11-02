<?php

namespace Drupal\wxt_core;

use Drupal\Component\Serialization\Yaml;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Locale\CountryManagerInterface;

/**
 * Countries Manager.
 */
class CountriesManager {
  /**
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The module extension list.
   *
   * @var \Drupal\Core\Extension\ModuleExtensionList
   */
  protected $moduleExtensionList;

  /**
   * The country manager.
   *
   * @var \Drupal\Core\Locale\CountryManagerInterface
   */
  protected $countryManager;

  /**
   * The module handler.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * CountriesManager constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\Core\Extension\ModuleExtensionList $module_extension_list
   *   The module extension list.
   * @param \Drupal\Core\Locale\CountryManagerInterface $country_manager
   *   The module handler
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler
   */
  public function __construct(ConfigFactoryInterface $config_factory, ModuleExtensionList $module_extension_list, CountryManagerInterface $country_manager, ModuleHandlerInterface $module_handler) {
    $this->configFactory = $config_factory;
    $this->moduleExtensionList = $module_extension_list;
    $this->countryManager = $country_manager;
    $this->moduleHandler = $module_handler;
  }

  /**
   * Get all data (from yml) expect for this issue[#3111375] from original online PDF.
   */
  public function getCountryData($column = 'Alpha-2', $row = 'Code') {
    $module_path = $this->moduleHandler->getModule('wxt_core')->getPath();
    $country_data = Yaml::decode(\file_get_contents(DRUPAL_ROOT . '/' . $module_path . '/config/data/sccai_county_names.yml'));
    if ($column === NULL || $column === FALSE) {
      return $country_data;
    }
    $country_names = [];

    foreach ($country_data as $data) {
      $country_names[$data[$column]] = $data[$row];
    }
    return $country_names;
  }

  /**
   * Get full, normal list of Countries.
   */
  public function listCounties() {
    $list = $this->countryManager->getList();
    $countries = [];
    foreach ($list as $key => $value) {
      $val = $value->__toString();
      $countries[$key] = $val;
    }
    return $countries;
  }

  /**
   * Returns the whitelisted approved items.
   */
  public function whitelistedOptions() {
    $standartCountries = $this->listCounties();
    $config = $this->configFactory->get('wxt_core_countries.settings');
    $countries = $config->get('countries');
    foreach ($countries as $abbr => $checkbox) {
      if ($checkbox != 0) {
        $options[$standartCountries[$abbr]] = $standartCountries[$abbr];
      }
    }
    return $options;
  }

  /**
   * Returns the sorted whitelisted.
   */
  public function whitelistedOptionsSorted() {
    $config = $this->configFactory->get('wxt_core_countries.settings');
    $whitelist = $this->whitelistedOptions();
    switch ($config->get('whitelist-sort')) {
      case 'alpha':
        \ksort($whitelist);
        break;
    }
    return $whitelist;
  }

}
