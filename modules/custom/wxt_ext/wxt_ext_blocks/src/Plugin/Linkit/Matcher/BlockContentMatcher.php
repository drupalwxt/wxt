<?php

namespace Drupal\wxt_ext_blocks\Plugin\Linkit\Matcher;

use Drupal\linkit\Plugin\Linkit\Matcher\EntityMatcher;

/**
 * A LinkIt matcher for block_content.
 *
 * @Matcher(
 *   id = "entity:block_content",
 *   label = @Translation("Block content"),
 *   target_entity = "block_content",
 *   provider = "wxt_ext_blocks"
 * )
 */
class BlockContentMatcher extends EntityMatcher {

  /**
   * {@inheritdoc}
   */
  protected function buildEntityQuery($search_string) {
    $langcode = \Drupal::languageManager()->getCurrentLanguage()->getId();

    $query = parent::buildEntityQuery($search_string);
    $query->condition('status', 1);
    $query->condition('langcode', $langcode);

    return $query;
  }

}
