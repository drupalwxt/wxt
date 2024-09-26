<?php

namespace Drupal\wxt_ext_media_video\Plugin\media\Source;

use Drupal\media\MediaTypeInterface;
use Drupal\video_embed_media\Plugin\media\Source\VideoEmbedField;
use Drupal\wxt_ext_media\InputMatchInterface;

/**
 * Input-matching version of the VideoEmbedField media type.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Video extends VideoEmbedField implements InputMatchInterface {

  /**
   * {@inheritdoc}
   */
  public function appliesTo($value, MediaTypeInterface $media_type) {
    $value = $this->toString($value);

    return isset($value)
      ? (bool) $this->providerManager->loadProviderFromInput($value)
      : FALSE;
  }

  /**
   * Safely converts a value to a string.
   *
   * The value is converted if it is either scalar, or an object with a
   * __toString() method.
   *
   * @param mixed $value
   *   The value to convert.
   *
   * @return string|null
   *   The string representation of the value, or NULL if the value cannot be
   *   converted to a string.
   */
  protected function toString($value) {
    return is_scalar($value) || (is_object($value) && method_exists($value, '__toString'))
      ? (string) $value
      : NULL;
  }

}
