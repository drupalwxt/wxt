<?php

namespace Drupal\wxt;

use Drupal\Component\Serialization\Yaml;
use Drupal\Core\Url;

/**
 * Helper class to get information from a site's wxt.extend.yml file.
 */
class Extender {

  /**
   * The path to the site's configuration (e.g. sites/default).
   *
   * @var string
   */
  protected $sitePath;

  /**
   * Extender constructor.
   *
   * @param string $drupal_root
   *   The path to the Drupal root.
   * @param string $site_path
   *   The path to the site's configuration (e.g. sites/default).
   */
  public function __construct($drupal_root, $site_path) {
    $this->root = $drupal_root;
    $this->sitePath = (string) $site_path;
  }

  /**
   * Returns the contents of the extender configuration file.
   *
   * @return array
   *   The parsed extender configuration.
   */
  public function getInfo() {
    // Discover wxt.extend.yml first in the `sitePath`, and then defer to
    // `sites/all`.
    $paths[] = $this->sitePath . '/wxt.extend.yml';
    $paths[] = $this->root . '/sites/all/wxt.extend.yml';
    foreach ($paths as $path) {
      if (file_exists($path)) {
        $info = file_get_contents($path);
        return Yaml::decode($info);
      }
    }
    return [];
  }

  /**
   * Returns the list of WxT Extensions to enable.
   *
   * @return string[]
   *   The modules to enable.
   */
  public function getWxtExtensions() {
    $info = $this->getInfo();
    // Return FALSE instead of empty array because empty array means "don't
    // enable _any_ extensions" in this case.
    return isset($info['wxt_extensions']) ? $info['wxt_extensions'] : FALSE;
  }

  /**
   * Returns the list of Lightning sub-components that should NOT be installed.
   *
   * @return string[]
   *   The sub-components to exclude.
   */
  public function getExcludedComponents() {
    $info = $this->getInfo();
    return isset($info['exclude_components']) ? $info['exclude_components'] : [];
  }

  /**
   * Returns the list of additional modules to enable.
   *
   * @return string[]
   *   The modules to enable.
   */
  public function getModules() {
    $info = $this->getInfo();
    return isset($info['modules']) ? $info['modules'] : [];
  }

  /**
   * Returns the URL to redirect to after installation.
   *
   * @return string
   *   The redirect URL, in the form /redirect/path?query=string.
   */
  public function getRedirect() {
    $info = $this->getInfo();
    if (!empty($info['redirect']['path'])) {
      $path = ltrim($info['redirect']['path'], '/');
    }
    else {
      // Redirect to the front page by default.
      $path = '<front>';
    }
    $redirect = Url::fromUri('internal:/' . $path);
    if (isset($info['redirect']['options'])) {
      $redirect->setOptions($info['redirect']['options']);
    }
    // Explicitly set the base URL, if not previously set, to prevent weird
    // redirection snafus.
    $base_url = $redirect->getOption('base_url');
    if (empty($base_url)) {
      $redirect->setOption('base_url', $GLOBALS['base_url']);
    }
    return $redirect->setOption('absolute', TRUE)->toString();
  }
}
