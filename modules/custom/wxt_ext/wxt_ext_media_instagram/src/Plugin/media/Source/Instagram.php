<?php

namespace Drupal\wxt_ext_media_instagram\Plugin\media\Source;

use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\wxt_ext_media\ValidationConstraintMatchTrait;
use Drupal\media_entity_instagram\Plugin\media\Source\Instagram as BaseInstagram;

/**
 * Input-matching version of the Instagram media source.
 */
class Instagram extends BaseInstagram implements InputMatchInterface {

  use ValidationConstraintMatchTrait;

}
