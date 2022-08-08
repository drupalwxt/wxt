<?php

namespace Drupal\wxt_ext_media_document\Plugin\media\Source;

use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\media\Plugin\media\Source\File as BaseFile;

/**
 * Input-matching version of the File media source.
 */
class File extends BaseFile implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
