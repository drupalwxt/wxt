<?php

namespace Drupal\wxt_ext_metatag\Plugin\metatag\Tag;

use Drupal\Core\Field\EntityReferenceFieldItemListInterface;
use Drupal\metatag\Plugin\metatag\Tag\MetaNameBase;
use Drupal\node\NodeInterface;

/**
 * Base class for Adobe Analytics attributes.
 */
abstract class AdobeAnalyticsAttributeBase extends MetaNameBase {

  /**
   * {@inheritdoc}
   */
  public function output(): array {
    // Do nothing if no value is configured.
    if (!$this->value) {
      return [];
    }

    // Add the meta element. Example:
    // @code
    // <meta data-gc-analytics-owner="HC|CPSD|Consumer product safety" />
    // @endcode
    return [
      '#tag' => $this->htmlTag,
      '#attributes' => [
        $this->name => $this->value,
      ],
    ];
  }

  /**
   * Alter the metatags to replace the field ID with the desired output string.
   *
   * It would be better to do this in ::output(), but that does not have access
   * to the node context. This is triggered by wxt_ext_metatag_metatags_alter()
   * before ::output() is run.
   *
   * @param array $metatags
   *   The special meta tags to be added to the page.
   * @param array $context
   *   The context for the current meta tags being generated. Will contain the
   *   following:
   *   'entity' - The entity being processed; passed by reference.
   */
  public static function alterMetatags(array &$metatags, array &$context): void {
    if (!(($context['entity'] ?? NULL) instanceof NodeInterface)) {
      return;
    }

    foreach ($metatags as $key => $value) {
      if ($value && str_starts_with($key, 'adobe_analytics_attribute_')) {
        // If $value is like "[node:field_fieldname]", that field is not empty,
        // and it is a entity reference, then use that field for this tag.
        if (preg_match('/\[node:([a-z0-9_]+)\]/', $value, $matches)
          && ($field = $context['entity']->{$matches[1]})
          && $field instanceof EntityReferenceFieldItemListInterface
        ) {
          $metatags[$key] = static::combineFieldValues($field);
        }
        // Otherwise, do not display the tag.
        else {
          $metatags[$key] = NULL;
        }
      }
    }
  }

  /**
   * Combime the names of this taxonomy term field and its ancestors.
   *
   * @param \Drupal\Core\Field\EntityReferenceFieldItemListInterface $field
   *   The field.
   *
   * @return string
   *   The names with levels separated with pipe and values with colon. Example:
   *   "Food|Beverages:Food chemicals|Non-alcoholic:Flavour additive"
   */
  protected static function combineFieldValues(EntityReferenceFieldItemListInterface $field): string {
    $taxonomy_term_storage = \Drupal::entityTypeManager()->getStorage('taxonomy_term');

    $names = [];
    // Act on all values referred-to by this field.
    foreach ($field->getValue() as $reference) {
      // Load all ancestors.
      $terms = $taxonomy_term_storage->loadAllParents($reference['target_id']);
      // Add each ancestor name to the array at the appropriate level.
      $counter = 0;
      while ($term = array_pop($terms)) {
        $names[$counter][] = $term->getName();
        $counter++;
        // Allow only 4 levels; exit the 'while' loop.
        if ($counter > 3) {
          break;
        }
      }
    }

    // Combine the names at each level, separted by colon.
    foreach ($names as &$level) {
      $level = implode(':', array_unique($level));
    }
    unset($level);
    // Combine the levels, separated by pipe.
    return implode('|', $names);
  }

}
