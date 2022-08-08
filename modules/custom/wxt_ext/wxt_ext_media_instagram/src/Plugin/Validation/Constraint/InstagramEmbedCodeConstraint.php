<?php

namespace Drupal\wxt_ext_media_instagram\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;

/**
 * Check if a value is a valid Instagram embed code/URL.
 *
 * @internal
 *   This is a totally internal part of WxT Extend Media Instagram and may be
 *   changed or removed in any way, at any time, without warning. External code
 *   should not use this class. If you need to use it or modify it, please copy
 *   it into your own project.
 *
 * @Constraint(
 *   id = "InstagramEmbedCode",
 *   label = @Translation("Instagram embed code", context = "Validation"),
 *   type = { "link", "string", "string_long" }
 * )
 */
final class InstagramEmbedCodeConstraint extends Constraint {

  /**
   * The default violation message.
   *
   * @var string
   */
  public $message = 'Not valid Instagram URL/Embed code.';

}
