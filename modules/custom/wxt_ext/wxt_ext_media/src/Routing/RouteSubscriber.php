<?php

namespace Drupal\wxt_ext_media\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Drupal\wxt_ext_media\Form\EntityEmbedDialog;
use Symfony\Component\Routing\RouteCollection;

/**
 * Alters route definitions.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $route = $collection->get('entity_embed.dialog');
    if ($route) {
      $route->setDefault('_form', EntityEmbedDialog::class);
    }
  }

}
