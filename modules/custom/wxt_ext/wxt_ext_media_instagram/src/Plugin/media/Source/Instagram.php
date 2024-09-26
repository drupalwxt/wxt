<?php

namespace Drupal\wxt_ext_media_instagram\Plugin\media\Source;

use Drupal\media_entity_instagram\Plugin\media\Source\Instagram as BaseInstagram;
use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\wxt_ext_media\ValidationConstraintMatchTrait;

/**
 * Input-matching version of the Instagram media source.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Instagram extends BaseInstagram implements InputMatchInterface {

  use ValidationConstraintMatchTrait;

}
