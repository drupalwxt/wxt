<?php

namespace Drupal\wxt_ext_media;

use Drupal\Core\Asset\LibrariesDirectoryFileFinder as CoreLibrariesDirectoryFileFinder;
use Drupal\Core\Update\UpdateKernel;

/**
 * Looks for front-end JavaScript libraries in common directories.
 *
 * @internal
 *   This class is an internal part of Lightning Media and may change or be
 *   removed at any time without warning. External code should not use this
 *   class in ANY way!
 */
final class LibrariesDirectoryFileFinder extends CoreLibrariesDirectoryFileFinder {

  /**
   * {@inheritdoc}
   */
  public function find($path) {
    $return = parent::find($path);

    // If we're updating, pretend Dropzone exists even if it doesn't, so that
    // the update can proceed.
    if ($return === FALSE && strpos($path, 'dropzone/') === 0 && \Drupal::service('kernel') instanceof UpdateKernel) {
      $return = 'libraries/' . $path;
    }
    return $return;
  }

}

