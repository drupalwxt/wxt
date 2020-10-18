<?php

namespace Drupal\wxt_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityViewBuilderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Controller for default HTTP 4xx responses.
 */
class WxTHttp4xxController extends ControllerBase implements ContainerInjectionInterface {

  /**
   * The block content entity storage handler.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $blockContentStorage;

  /**
   * The block view builder.
   *
   * @var \Drupal\Core\Entity\EntityViewBuilderInterface
   */
  protected $blockViewBuilder;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a Drupal\Component\Plugin\PluginBase object.
   *
   * @param \Drupal\Core\Entity\EntityStorageInterface $storage
   *   The user storage.
   * @param \Drupal\Core\Entity\EntityViewBuilderInterface $block_view_builder
   *   The block view builder.
   */
  public function __construct(EntityStorageInterface $storage, EntityViewBuilderInterface $block_view_builder) {
    $this->blockContentStorage = $storage;
    $this->blockViewBuilder = $block_view_builder;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')->getStorage('block_content'),
      $container->get('entity_type.manager')->getViewBuilder('block_content')
    );
  }

  /**
   * The default 404 content.
   *
   * @return array
   *   A render array containing the message to display for 404 pages.
   */
  public function on404() {

    // 404 Fallback message.
    $response = '
    <div class="box">
      <div class="row">
        <div class="col-xs-3 col-sm-2 col-md-2 text-center mrgn-tp-md">
          <span class="glyphicon glyphicon-warning-sign glyphicon-error"></span>
        </div>
        <div class="col-xs-9 col-sm-10 col-md-10">
          <h2 class="mrgn-tp-md">' . $this->t("We couldn't find that Web page") . '</h2>
          <p class="pagetag"><strong>' . $this->t('Error 404') . '</strong></p>
        </div>
      </div>
      <p class="mrgn-tp-md">' . $this->t("We're sorry you ended up here. Sometimes a page gets moved or deleted.") . '</p>
    </div>';

    // Lookup our custom 404 content block.
    $block_id = $this->blockContentStorage->loadByProperties([
      'info' => '404',
      'type' => 'basic',
    ]);
    if (!empty($block_id)) {
      $response = $this->blockViewBuilder->view(reset($block_id));
    }

    return [
      '#type' => 'container',
      '#markup' => render($response),
      '#attributes' => [
        'class' => '404 error',
      ],
      '#weight' => 0,
    ];
  }

}
