<?php

namespace Drupal\wxt_ext_media_document\Plugin\media\Source;

use Drupal\media\Plugin\media\Source\File as BaseFile;
use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;

/**
 * Input-matching version of the File media source.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class File extends BaseFile implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
