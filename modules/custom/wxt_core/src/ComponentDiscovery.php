<?php

namespace Drupal\wxt_core;

use Drupal\Core\Extension\Extension;
use Drupal\Core\Extension\ExtensionDiscovery;

/**
 * Helper object to locate WxT components and sub-components.
 */
class ComponentDiscovery {

  /**
   * Prefix that WxT components are expected to start with.
   */
  const COMPONENT_PREFIX = 'wxt_';

  /**
   * The extension discovery iterator.
   *
   * @var \Drupal\Core\Extension\ExtensionDiscovery
   */
  protected $discovery;

  /**
   * The WxT profile extension object.
   *
   * @var \Drupal\Core\Extension\Extension
   */
  protected $profile;

  /**
   * Cache of all discovered components.
   *
   * @var \Drupal\Core\Extension\Extension[]
   */
  protected $components;

  /**
   * ComponentDiscovery constructor.
   *
   * @param string $app_root
   *   The application root directory.
   */
  public function __construct($app_root) {
    $this->discovery = new ExtensionDiscovery($app_root);
  }

  /**
   * Returns an extension object for the WxT profile.
   *
   * @return \Drupal\Core\Extension\Extension
   *   The WxT profile extension object.
   *
   * @throws \RuntimeException
   *   If the WxT profile is not found in the system.
   */
  protected function getProfile() {
    if (empty($this->profile)) {
      $profiles = $this->discovery->scan('profile');

      if (empty($profiles['wxt'])) {
        throw new \RuntimeException('WxT profile not found.');
      }
      $this->profile = $profiles['wxt'];
    }
    return $this->profile;
  }

  /**
   * Returns extension objects for all WxT components.
   *
   * @return \Drupal\Core\Extension\Extension[]
   *   Array of extension objects for all WxT components.
   */
  public function getAll() {
    if (is_null($this->components)) {
      $identifier = self::COMPONENT_PREFIX;

      $filter = function (Extension $module) use ($identifier) {
        return strpos($module->getName(), $identifier) === 0;
      };

      $this->components = array_filter($this->discovery->scan('module'), $filter);
    }
    return $this->components;
  }

  /**
   * Returns extension objects for all main WxT components.
   *
   * @return \Drupal\Core\Extension\Extension[]
   *   Array of extension objects for top-level WxT components.
   */
  public function getMainComponents() {
    $identifier = self::COMPONENT_PREFIX;

    $filter = function (Extension $module) use ($identifier) {
      // Assumes that:
      // 1. WxT sub-components are always in a sub-directory within the
      //    main component.
      // 2. The main component's directory starts with "wxt_".
      $path = explode(DIRECTORY_SEPARATOR, $module->getPath());
      $parent = $path[count($path) - 3];
      return strpos($parent, $identifier) !== 0;
    };

    return array_filter($this->getAll(), $filter);
  }

  /**
   * Returns extension object for all WxT sub-components.
   *
   * @return \Drupal\Core\Extension\Extension[]
   *   Array of extension objects for WxT sub-components.
   */
  public function getSubComponents() {
    return array_diff_key($this->getAll(), $this->getMainComponents());
  }

}
