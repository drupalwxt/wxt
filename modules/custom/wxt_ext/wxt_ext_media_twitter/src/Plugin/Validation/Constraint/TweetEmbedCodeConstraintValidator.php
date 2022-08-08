<?php

namespace Drupal\wxt_ext_media_twitter\Plugin\Validation\Constraint;

use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemList;
use Drupal\media_entity_twitter\Plugin\media\Source\Twitter;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the TweetEmbedCode constraint.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
final class TweetEmbedCodeConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($value, Constraint $constraint) {
    $data = '';
    if (is_string($value)) {
      $data = $value;
    }
    elseif ($value instanceof FieldItemList) {
      $fieldtype = $value->getFieldDefinition()->getType();
      $field_value = $value->getValue();
      if ($fieldtype == 'link') {
        $data = empty($field_value[0]['uri']) ? "" : $field_value[0]['uri'];
      }
      else {
        $data = empty($field_value[0]['value']) ? "" : $field_value[0]['value'];
      }
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
      foreach (Twitter::$validationRegexp as $pattern => $key) {
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
