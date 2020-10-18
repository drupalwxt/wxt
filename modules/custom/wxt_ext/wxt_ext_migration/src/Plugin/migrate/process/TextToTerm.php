<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Language\LanguageInterface;

/**
 * This plugin creates a new taxonomy term based on the source.
 *
 * @MigrateProcessPlugin(
 *   id = "text_to_term"
 * )
 */
class TextToTerm extends ProcessPluginBase {

  /**
   * The main function for the plugin, actually doing the data conversion.
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    $field = empty($this->configuration['field']) ? 'value' : $this->configuration['field'];
    $termName = FALSE;

    /*
     * Depending on the context (whether the plugin is called
     * as a part of an Iterator process, a pipe, or takes its
     * sources from multiple-input Get plugin), we have to check
     * for all value placement variants.
     */
    if (isset($value[$field])) {
      $termName = $value[$field];
    }
    elseif (!empty($row->getSourceProperty($field))) {
      $termName = $row->getSourceProperty($field);
    }
    elseif (is_string($value)) {
      $termName = $value;
    }
    if (!$termName) {
      return $termName;
    }
    // Getting a term by lookup (if it exists), or creating one.
    $term = $this->getTerm($termName, $row, $this->configuration['vocabulary']);
    // Save it.
    $term->save();
    // Yes, all we need is ID.
    return $term->id();
  }

  /**
   * Creates a new or returns an existing term for the target vocabulary.
   */
  protected function getTerm($name, Row $row, $vocabulary) {
    // Attempt to fetch an existing term.
    $properties = [];
    if (!empty($name)) {
      $properties['name'] = $name;
    }
    $vocabularies = taxonomy_vocabulary_get_names();
    if (isset($vocabularies[$vocabulary])) {
      $properties['vid'] = $vocabulary;
    }
    else {
      // Return NULL when filtering by a non-existing vocabulary.
      return NULL;
    }

    $terms = \Drupal::getContainer()->get('entity_type.manager')->getStorage('taxonomy_term')->loadByProperties($properties);
    $term = reset($terms);
    if (!empty($term)) {
      if ($row->getDestinationProperty('langcode') && $row->getDestinationProperty('langcode') != LanguageInterface::LANGCODE_NOT_SPECIFIED) {
        if (!$term->hasTranslation($row->getDestinationProperty('langcode'))) {
          $term->addTranslation($row->getDestinationProperty('langcode'));
        }
        $term = $term->getTranslation($row->getDestinationProperty('langcode'));
      }
      return $term;
    }
    // Fallback, create a new term.
    $term = Term::create($properties);
    if ($row->getDestinationProperty('langcode')) {
      $term->langcode = $row->getDestinationProperty('langcode');
    }
    return $term;
  }

}
