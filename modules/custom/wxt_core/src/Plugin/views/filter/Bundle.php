<?php

namespace Drupal\wxt_core\Plugin\views\filter;

use Drupal\views\Plugin\views\filter\Bundle as BaseBundle;
use Drupal\wxt_core\YieldToArgumentTrait;

/**
 * A Bundle filter plugin which supports yielding to an argument.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Bundle extends BaseBundle {

  use YieldToArgumentTrait;

}
