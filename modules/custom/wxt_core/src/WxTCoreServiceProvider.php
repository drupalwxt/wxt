<?php

namespace Drupal\wxt_core;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Registers and modifies container services.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
final class WxTCoreServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function register(ContainerBuilder $container) {
    $service_id = 'wxt.form_helper';

    if ($container->hasDefinition($service_id) === FALSE) {
      $container->register($service_id, FormHelper::class)
        ->setArguments([
          new Reference('plugin.manager.element_info'),
        ])
        ->setDeprecated(TRUE, 'The "%service_id%" service is deprecated in wxt_core:8.x-5.6 and is removed from wxt_core:6.0.0. Use \Drupal\Core\Render\ElementInfoManagerInterface::getInfo() instead. See https://www.drupal.org/node/3156221');
    }
  }

}
