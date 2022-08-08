<?php

namespace Drupal\wxt_ext_media;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Symfony\Component\DependencyInjection\Parameter;
use Symfony\Component\DependencyInjection\Reference;

/**
 * Registers container services.
 *
 * @internal
 *   This class is an internal part of WxT Extend Media and will be deleted when
 *   Drupal 8.9 is the minimum supported version of core. It may change or be
 *   removed at any time without warning! External code should not use this
 *   class in ANY way!
 */
final class WxTExTMediaServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function register(ContainerBuilder $container) {
    parent::register($container);

    if (!$container->hasDefinition('library.libraries_directory_file_finder')) {
      $container->register('library.libraries_directory_file_finder', LibrariesDirectoryFileFinder::class)
        ->addArgument(new Reference('app.root'))
        ->addArgument(new Reference('site.path'))
        ->addArgument(new Reference('extension.list.profile'))
        ->addArgument(new Parameter('install_profile'));
    }
  }

}
