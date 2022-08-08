<?php

namespace Drupal\wxt_ext_media_instagram\Plugin\Validation\Constraint;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\media_entity_instagram\Plugin\media\Source\Instagram;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the InstagramEmbedCode constraint.
 *
 * @internal
 *   This is a totally internal part of WxT Extend Media Instagram and may be
 *   changed or removed in any way, at any time, without warning. External code
 *   should not use this class. If you need to use it or modify it, please copy
 *   it into your own project.
 */
final class InstagramEmbedCodeConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($value, Constraint $constraint) {
    $data = '';
    if (is_string($value)) {
      $data = $value;
    }
    elseif ($value instanceof FieldItemInterface) {
      $class = get_class($value);
      $property = $class::mainPropertyName();
      if ($property) {
        $data = $value->{$property};
      }
    }

    if ($data) {
      $matches = [];
      foreach (Instagram::$validationRegexp as $pattern => $key) {
        if (preg_match($pattern, $data, $item_matches)) {
          $matches[] = $item_matches;
        }
      }
      if (empty($matches)) {
        $this->context->addViolation($constraint->message);
      }
    }

  }

}
