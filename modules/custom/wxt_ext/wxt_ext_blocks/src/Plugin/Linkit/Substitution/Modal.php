<?php

namespace Drupal\wxt_ext_blocks\Plugin\Linkit\Substitution;

use Drupal\Component\Plugin\PluginBase;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Url;
use Drupal\block_content\Entity\BlockContent;
use Drupal\linkit\SubstitutionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A substitution plugin for modal blocks.
 *
 * @Substitution(
 *   id = "modal",
 *   label = @Translation("Modal block"),
 * )
 */
class Modal extends PluginBase implements SubstitutionInterface, ContainerFactoryPluginInterface {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getUrl(EntityInterface $entity) {
    if ($entity instanceof BlockContent) {
      if ($entity->hasField('field_modal_id')) {
        // Get the value of the 'field_modal_id' field.
        $modalId = $entity->get('field_modal_id')->value;

        if (!empty($modalId)) {
          // Return a Url object with a fragment (e.g., #modal-id).
          return Url::fromUri('internal:#' . $modalId);
        }
      }
    }

    // Return an empty Url object if the field or value is missing.
    return Url::fromUri('internal:#');
  }

  /**
   * {@inheritdoc}
   */
  public static function isApplicable(EntityTypeInterface $entity_type) {
    return $entity_type->hasLinkTemplate('canonical');
  }

}
