<?php

namespace Drupal\wxt_ext_media_audio\Plugin\media\Source;

use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\media\Plugin\media\Source\AudioFile as CoreAudioFile;

/**
 * Input-matching version of the AudioFile media source.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class AudioFile extends CoreAudioFile implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
