<?php

namespace Drupal\wxt_ext_media_image\Plugin\media\Source;

use Drupal\media\Plugin\media\Source\Image as BaseImage;
use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;

/**
 * Input-matching version of the Image media source.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Image extends BaseImage implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
