<?php

namespace Drupal\wxt_ext_media_twitter\Plugin\media\Source;

use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\wxt_ext_media\ValidationConstraintMatchTrait;
use Drupal\media_entity_twitter\Plugin\media\Source\Twitter as BaseTwitter;

/**
 * Input-matching version of the Twitter media source.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Twitter extends BaseTwitter implements InputMatchInterface {

  use ValidationConstraintMatchTrait;

}
