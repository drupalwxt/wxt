<?php

namespace Drupal\wxt;

use Drupal\Core\Render\ElementInfoManagerInterface;

/**
 * Provides helper methods for working with forms and form elements.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class FormHelper {

  /**
   * The element info plugin manager.
   *
   * @var \Drupal\Core\Render\ElementInfoManagerInterface
   */
  protected $elementInfo;

  /**
   * FormHelper constructor.
   *
   * @param string $root
   *   The app root.
   * @param \Drupal\Core\Render\ElementInfoManagerInterface $element_info
   *   The element info plugin manager.
   */
  public function __construct(string $root, ElementInfoManagerInterface $element_info) {
    $this->root = $root;
    $this->elementInfo = $element_info;
  }

  /**
   * Applies standard process functions to a form element.
   *
   * @param array $element
   *   The form element.
   */
  public function applyStandardProcessing(array &$element) {
    if (empty($element['#process'])) {
      $info = $this->elementInfo->getInfo($element['#type']);

      if (isset($info['#process'])) {
        $element['#process'] = $info['#process'];
      }
    }
  }

}
