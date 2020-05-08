<?php

namespace Drupal\wxt_core\UpdateWxT;

use Drupal\Core\Config\ConfigFactoryInterface;
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
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The module installer service.
   *
   * @var \Drupal\Core\Extension\ModuleInstallerInterface
   */
  private $moduleInstaller;

  /**
   * Update360 constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\Core\Extension\ModuleInstallerInterface $module_installer
   *   The module installer service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ModuleInstallerInterface $module_installer) {
    $this->configFactory = $config_factory;
    $this->moduleInstaller = $module_installer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('module_installer')
    );
  }

  /**
   * Enables additionals slideshow enhancements.
   *
   * @updatewxt
   *
   * @ask Do you want to enable additional slideshow enhancements?
   */
  public function enableAdditionalEnhancements() {
    $this->moduleInstaller->install(['wxt_ext_media_slideshow']);

    $config = Config::forModule('wxt_ext_media_slideshow')->install();
    $config->getEntity('field_storage_config', 'media.field_slideshow_style')->save();
    $config->getEntity('field_config', 'media.slideshow.field_slideshow_style')->save();

    // Media Slideshow: Add additional style field.
    $config = $this->configFactory->getEditable("core.entity_form_display.media.slideshow.default");
    $content = $config->get('content');
    $content['field_slideshow_style'] = [
      'type' => 'options_select',
      'weight' => 2,
      'region' => 'content',
      'settings' => [],
      'third_party_settings' => [],
    ];
    $config->set('content', $content);
    $config->save();

    $config = $this->configFactory->getEditable("core.entity_view_display.media.slideshow.default");
    $hidden_components = $config->get('hidden');
    $hidden_components['field_slideshow_styles'] = TRUE;
    $config->set('hidden', $hidden_components);
    $config->save();

    // Media Image: Link to show in Media Browser.
    $config = $this->configFactory->getEditable("core.entity_form_display.media.image.media_browser");
    $content = $config->get('content');
    $content['field_image_link'] = [
      'type' => 'link_default',
      'weight' => 1,
      'region' => 'content',
      'settings' => [
        'placeholder_url' => '',
        'placeholder_title' => '',
      ],
      'third_party_settings' => [],
    ];
    $config->set('content', $content);
    $config->save();
  }

}
