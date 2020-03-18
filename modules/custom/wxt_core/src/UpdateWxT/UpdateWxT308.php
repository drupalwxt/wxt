<?php

namespace Drupal\wxt_core\UpdateWxT;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ModuleInstallerInterface;
use Drupal\wxt_core\ConfigHelper as Config;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Contains optional configuration updates targeting WxT 3.0.8.
 *
 * @UpdateWxT("3.0.8")
 */
final class UpdateWxT308 implements ContainerInjectionInterface {

  /**
   * The module installer service.
   *
   * @var \Drupal\Core\Extension\ModuleInstallerInterface
   */
  private $moduleInstaller;

  /**
   * Update360 constructor.
   *
   * @param \Drupal\Core\Extension\ModuleInstallerInterface $module_installer
   *   The module installer service.
   */
  public function __construct(ModuleInstallerInterface $module_installer) {
    $this->moduleInstaller = $module_installer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('module_installer'));
  }

  /**
   * Enables additionals slideshow styles.
   *
   * @updatewxt
   *
   * @ask Do you want to enable additional slideshow styles?
   */
  public function enableAdditionalStyles() {
    $config = Config::forModule('wxt_ext_media_slideshow')->optional();
    $config->getEntity('field_storage_config', 'media.field_slideshow_style')->save();
    $config->getEntity('field_config', 'media.field_slideshow_style')->save();
  }

}
