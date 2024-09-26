<?php

namespace Drupal\wxt_ext_media_video\Plugin\media\Source;

use Drupal\media\Plugin\media\Source\VideoFile as CoreVideoFile;
use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;

/**
 * Input-matching version of the VideoFile media source.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class VideoFile extends CoreVideoFile implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
