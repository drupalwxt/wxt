<?php

namespace Drupal\wxt_ext_media;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Registers container services.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 *
 * @internal
 *   This class is an internal part of Lightning Media and may change or be
 *   removed at any time without warning. External code should not use this
 *   class in ANY way!
 */
final class WxTMediaServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function register(ContainerBuilder $container) {
    parent::register($container);

    $container->getDefinition('library.libraries_directory_file_finder')
      ->setClass(LibrariesDirectoryFileFinder::class);
  }

}

