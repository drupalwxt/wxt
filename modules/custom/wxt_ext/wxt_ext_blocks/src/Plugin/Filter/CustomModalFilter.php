<?php

namespace Drupal\wxt_ext_blocks\Plugin\Filter;

use Drupal\filter\Plugin\FilterBase;
use Drupal\filter\FilterProcessResult;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Provides a filter plugin to add modal block markup below a link.
 *
 * @Filter(
 *   id = "custom_modal_filter",
 *   title = @Translation("Modal filter (WxT)"),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_TRANSFORM_IRREVERSIBLE,
 * )
 */
class CustomModalFilter extends FilterBase {
  use StringTranslationTrait;

  private $modalHTML;

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode) {
    // Regular expression to match your link pattern.
    $pattern = '/<a[^>]*data-entity-substitution="modal"[^>]*>(.*?)<\/a>/i';

    // Process the text using the regular expression.
    $text = preg_replace_callback($pattern, [$this, 'processLink'], $text);

    if (!empty($this->modalHTML)) {
      $text .= $this->modalHTML;
    }

    return new FilterProcessResult($text);
  }

  /**
   * Callback function to process matched links.
   *
   * @param array $matches
   *   An array of matches from the regular expression.
   *
   * @return string
   *   The modified link with modal block markup.
   */
  protected function processLink($matches) {
    // Extract the entity UUID from the link.
    preg_match('/data-entity-uuid="([a-f0-9\-]+)"/i', $matches[0], $uuidMatches);

    if (count($uuidMatches) !== 2) {
      // If the entity UUID is not found, return the original link.
      return $matches[0];
    }
    $entityUuid = $uuidMatches[1];

    // Load the block content entity using the UUID.
    $blockContent = \Drupal::entityTypeManager()
      ->getStorage('block_content')
      ->loadByProperties([
        'uuid' => $entityUuid,
      ]);

    $block = reset($blockContent);

    // Check if the block content entity exists.
    if ($block) {
      // Get the current language.
      $language = \Drupal::languageManager()->getCurrentLanguage()->getId();

      // Get modal field values.
      $modal_id = $block->get('field_modal_id')->value;
      $modal_title = $block->getTranslation($language)->label();

      // Render the block content entity.
      $modalBlockMarkup = \Drupal::entityTypeManager()->getViewBuilder('block_content')->view($block);
      $modal_body = \Drupal::service('renderer')->renderRoot($modalBlockMarkup);

      $modal_output = $this->modalHTML . $this->t('<section id="@modal_id" class="mfp-hide modal-dialog modal-content overlay-def">
          <header class="modal-header">
            <h2 class="modal-title">@modal_title</h2>
          </header>
          <div class="modal-body">@modal_body</div>
          <button title="Close overlay (escape key)" type="button" class="mfp-close">×<span class="wb-inv">Close overlay (escape key)</span></button>
        </section>', ['@modal_id' => $modal_id, '@modal_title' => $modal_title, '@modal_body' => $modal_body]);

      // Set the modal HTML.
      $this->modalHTML = $modal_output;

      // Modify the link and return it.
      $modifiedLink = preg_replace('/<a\b(.*?)>/', '<a$1 aria-controls="' . $modal_id . '" class="wb-lbx lbx-modal">', $matches[0]);
      return $modifiedLink;
    }

    // Return the original link if the block content entity doesn't exist.
    return $matches[0];
  }

}
