<?php

namespace Drupal\wxt\Installer;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\Extension;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Serialization\Yaml;
use Drupal\wxt\Installer\ExtensionException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Extension Manager.
 *
 * Used to find extensions in WxT that can be enabled during install.
 */
class ExtensionManager implements ContainerInjectionInterface {

  /**
   * The extension list.
   *
   * @var \Drupal\Core\Extension\ModuleExtensionList
   */
  protected $moduleExtensionList;

  /**
   * The name of the install profile.
   *
   * @var string
   */
  protected $installProfile;

  /**
   * Constructs a ExtensionManager instance.
   *
   * @param \Drupal\Core\Extension\ModuleExtensionList $extension_list
   *   The extension list.
   * @param string $install_profile
   *   The name of the install profile.
   */
  public function __construct(ModuleExtensionList $extension_list, string $install_profile) {
    $this->moduleExtensionList = $extension_list;
    $this->installProfile = $install_profile;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('extension.list.module'),
      $container->getParameter('install_profile')
    );
  }

  /**
   * Collects the extensions for WxT.
   *
   * @return array
   *   An array containing the extensions with module name as the key.
   */
  public function getExtensions() : array {
    $extensions = [];
    $available_modules = $this->moduleExtensionList->getList();
    $install_profile_extensions = $this->getInstallProfileExtensions();
    foreach ($available_modules as $name => $extension) {
      $module_info = $this->getExtensionInfo($extension);
      if ($module_info !== NULL) {
        $extensions[$name] = $module_info;
      }
      elseif (isset($install_profile_extensions[$name])) {
        $extensions[$name] = $install_profile_extensions[$name];
      }
    }
    return $extensions;
  }

  /**
   * Loads extensions from a `profile.wxt_extension_list.yml` file.
   *
   * @return array
   *   An array containing the extensions with module name as the key.
   */
  protected function getInstallProfileExtensions() : array {
    $extension_list_name = $this->installProfile . '.wxt_extension_list.yml';
    $extension_list_file = $this->moduleExtensionList->getPath($this->installProfile) . DIRECTORY_SEPARATOR . $extension_list_name;
    if (!file_exists($extension_list_file)) {
      return [];
    }
    $extensions = Yaml::decode(file_get_contents($extension_list_file));
    foreach ($extensions as $module_name => &$info) {
      $info += $this->getInfoDefaults();
      try {
        $this->validateExtensionData($module_name, $info);
      }
      catch (ExtensionException $e) {
        throw new ExtensionException("Invalid info provided for '{$module_name}' in the `{$extension_list_name}` file.", 0, $e);
      }
    }

    return $extensions;
  }

  /**
   * Load the extension info.
   *
   * @param \Drupal\Core\Extension\Extension $extension
   *   The extension where the info is gathered.
   *
   * @return array|null
   *   An array with the info or null.
   */
  protected function getExtensionInfo(Extension $extension) : ?array {
    $module_directory = $extension->getPath();
    $optional_info_file = $module_directory . DIRECTORY_SEPARATOR . $extension->getName() . '.wxt_extension.yml';
    if (!file_exists($optional_info_file)) {
      return NULL;
    }
    $extension_info = Yaml::decode(file_get_contents($optional_info_file));
    $extension_info += $this->getInfoDefaults();
    if (!$this->validateExtensionData($extension->getName(), $extension_info)) {
      return NULL;
    }

    return $extension_info;
  }

  /**
   * Validate the WxT extension.
   *
   * @param string $module_name
   *   The name of the module.
   * @param array $info
   *   The array of info to validate.
   *
   * @throws \Drupal\wxt\Installer\ExtensionException
   *   An exception that highlights what is wrong.
   *
   * @return true
   *   Returns TRUE when data is valid.
   */
  protected function validateExtensionData(string $module_name, array $info) : bool {
    if (!isset($info['name'])) {
      throw new ExtensionException("The `name` field is missing in the `{$module_name}.wxt_extension.yml` file.");
    }
    if (!isset($info['description'])) {
      throw new ExtensionException("The `description` field is missing in the `{$module_name}.wxt_extension.yml` file.");
    }
    if (!is_bool($info['default'])) {
      throw new ExtensionException("The field `default` must be of type `bool` in the `{$module_name}.wxt_extension.yml` file.");
    }
    if (!is_int($info['weight'])) {
      throw new ExtensionException("The field `weight` must be of type `int` in the `{$module_name}.wxt_extension.yml` file.");
    }

    return TRUE;
  }

  /**
   * Get the defaults for the extension info parameters.
   *
   * @return array
   *   The defaults for the extension info parameters.
   */
  private function getInfoDefaults() : array {
    return [
      'default' => FALSE,
      'weight' => 0,
    ];
  }

}
