<?php

namespace Drupal\wxt_ext_queue\Plugin\views\argument_default;

use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\taxonomy\TermInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\taxonomy\VocabularyStorageInterface;
use Drupal\taxonomy\Plugin\views\argument_default\Tid;

/**
 * Taxonomy tid default argument.
 *
 * @ViewsArgumentDefault(
 *   id = "subtaxonomyqueue",
 *   title = @Translation("Taxonomy term ID from Context of the page")
 * )
 */
class SubTaxonomyQueue extends Tid {

  /**
   * {@inheritdoc}
   */
  protected $routeMatch;

  /**
   * {@inheritdoc}
   */
  protected $vocabularyStorage;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, RouteMatchInterface $route_match, VocabularyStorageInterface $vocabulary_storage) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $route_match, $vocabulary_storage);

    $this->routeMatch = $route_match;
    $this->vocabularyStorage = $vocabulary_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_route_match'),
      $container->get('entity_type.manager')->getStorage('taxonomy_vocabulary')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getArgument() {
    // Load default argument from taxonomy page.
    if (!empty($this->options['term_page'])) {
      if (($taxonomy_term = $this->routeMatch->getParameter('taxonomy_term')) && $taxonomy_term instanceof TermInterface) {
        return $taxonomy_term->id();
      }
    }
  }

}
