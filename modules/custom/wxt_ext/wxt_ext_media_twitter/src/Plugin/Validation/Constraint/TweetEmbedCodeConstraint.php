<?php

namespace Drupal\wxt_ext_media_twitter\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Checks if a value is a valid Tweet embed code/URL.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 *
 * @Constraint(
 *   id = "TweetEmbedCode",
 *   label = @Translation("Tweet embed code", context = "Validation"),
 *   type = { "link", "string", "string_long" }
 * )
 */
final class TweetEmbedCodeConstraint extends Constraint {

  /**
   * The default violation message.
   *
   * @var string
   */
  public $message = 'Not valid Tweet URL/embed code.';

}
