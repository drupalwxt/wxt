<?php

namespace Drupal\wxt_ext_archived\Plugin\Condition;

use Drupal\Core\Condition\ConditionPluginBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\NodeInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * Provides a condition to check value of node field field_archive.
 *
 * @Condition(
 *   id = "wxt_is_archived",
 *   label = @Translation("Archived is checked"),
 *   context_definitions = {
 *     "node" = @ContextDefinition(
 *       "entity:node",
 *       required = TRUE,
 *       label = @Translation("node")
 *     )
 *   }
 * )
 */
class ArchivedField extends ConditionPluginBase implements ContainerFactoryPluginInterface {

  /**
   * Creates a new ArchivedField instance.
   *
   * @param array $configuration
   *   The plugin configuration, i.e. an array with configuration values keyed
   *   by configuration option name. The special key 'context' may be used to
   *   initialize the defined contexts by setting it to an array of context
   *   values keyed by context names.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition
    );
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {

    $form['enable_archived'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Node has field_archived and it is checked (TRUE)'),
      '#default_value' => isset($this->configuration['enable_archived']) ? $this->configuration['enable_archived'] : 0,
    ];

    return parent::buildConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $this->configuration['enable_archived'] = $form_state->getValue('enable_archived');

    parent::submitConfigurationForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    $configuration = [
      'enable_archived' => 0,
    ];

    return $configuration + parent::defaultConfiguration();
  }

  /**
   * {@inheritdoc}
   */
  public function evaluate() {
    if (empty($this->configuration['enable_archived']) && !$this->isNegated()) {
      return TRUE;
    }

    $field = 'field_archived';

    /** @var \Drupal\node\Entity\Node $entity */
    $node = $this->getContextValue('node');

    if ($node instanceof NodeInterface && $node->hasField($field) && !$node->get($field)->isEmpty()) {
      $value = $node->get($field)->first()->getValue();
      if (!empty($value['value'])) {
        return TRUE;
      }
    }

    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function summary() {
    $field = 'field_archived';

    return t('Node field "@field" is checked (TRUE)', ['@field' => $field]);
  }

}
