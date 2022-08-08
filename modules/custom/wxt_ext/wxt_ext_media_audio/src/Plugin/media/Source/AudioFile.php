<?php

namespace Drupal\wxt_ext_media_audio\Plugin\media\Source;

use Drupal\wxt_ext_media\FileInputExtensionMatchTrait;
use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\media\Plugin\media\Source\AudioFile as CoreAudioFile;

/**
 * Input-matching version of the AudioFile media source.
 */
class AudioFile extends CoreAudioFile implements InputMatchInterface {

  use FileInputExtensionMatchTrait;

}
