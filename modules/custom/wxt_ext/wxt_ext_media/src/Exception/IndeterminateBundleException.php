<?php

namespace Drupal\wxt_ext_media\Exception;

use Drupal\Core\Entity\EntityInterface;
use Drupal\media\MediaTypeInterface;

/**
 * Thrown if no single media type can be determined from an input value.
 */
class IndeterminateBundleException extends \LogicException implements \IteratorAggregate, \Countable {

  /**
   * The media types which matched the input value.
   *
   * @var \Drupal\media\MediaTypeInterface[]
   */
  private $types = [];

  /**
   * IndeterminateBundleException constructor.
   *
   * @param mixed $value
   *   The input value.
   * @param int $code
   *   (optional) The error code.
   * @param \Exception $previous
   *   (optional) The previous exception, if any.
   * @param \Drupal\media\MediaTypeInterface[] $types
   *   (optional) The media types which matched the input value.
   */
  public function __construct($value, $code = 0, \Exception $previous = NULL, array $types = []) {
    $message = sprintf(
      $types
        ? 'Input matched multiple media types: %s'
        : 'Input did not match any media types: %s',
      $value instanceof EntityInterface ? $value->label() : var_export($value, TRUE)
    );

    /** @var \Drupal\media\MediaTypeInterface $media_type */
    foreach ($types as $media_type) {
      $key = $media_type->id();
      $this->types[$key] = $media_type;
    }

    parent::__construct($message, $code, $previous);
  }

  /**
   * Checks if the input value matched a particular media type.
   *
   * @param string $type
   *   The media type ID to check.
   *
   * @return bool
   *   TRUE if the input value matched the media type, otherwise FALSE.
   */
  public function matched($type) {
    return array_key_exists($type, $this->types);
  }

  /**
   * {@inheritdoc}
   */
  public function __toString() {
    $count = count($this);

    if ($count > 0) {
      $types = array_map(function (MediaTypeInterface $media_type) {
        return $media_type->id();
      }, $this->types);

      return "Input matched $count media types: " . implode(', ', $types);
    }
    return 'Input did not match any media types.';
  }

  /**
   * {@inheritdoc}
   */
  public function count() {
    return count($this->types);
  }

  /**
   * {@inheritdoc}
   */
  public function getIterator() {
    return new \ArrayIterator($this->types);
  }

}
