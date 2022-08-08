<?php

namespace Drupal\wxt_ext_media_image\Plugin\media\Source;

use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\media\Plugin\media\Source\Image as BaseImage;

/**
 * Input-matching version of the Image media source.
 */
class Image extends BaseImage implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
