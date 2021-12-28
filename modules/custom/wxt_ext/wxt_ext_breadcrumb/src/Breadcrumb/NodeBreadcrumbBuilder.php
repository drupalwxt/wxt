<?php

namespace Drupal\wxt_ext_breadcrumb\Breadcrumb;

use Drupal\Core\Access\AccessManagerInterface;
use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Controller\TitleResolverInterface;
use Drupal\Core\Link;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\views\Views;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * {@inheritdoc}
 */
class NodeBreadcrumbBuilder implements BreadcrumbBuilderInterface {
  use StringTranslationTrait;

  /**
   * Request stack service.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  protected $requestStack;

  /**
   * Configuration object for this builder.
   *
   * @var \Drupal\Core\Config\Config
   */
  protected $config;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $account;

  /**
   * The title resolver.
   *
   * @var \Drupal\Core\Controller\TitleResolverInterface
   */
  protected $titleResolver;

  /**
   * The menu link access service.
   *
   * @var \Drupal\Core\Access\AccessManagerInterface
   */
  protected $accessManager;

  /**
   * Constructs a node breadcrumb builder object.
   *
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   The request stack service.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The configuration factory.
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The current user.
   * @param \Drupal\Core\Controller\TitleResolverInterface $title_resolver
   *   The title resolver.
   * @param \Drupal\Core\Access\AccessManagerInterface $access_manager
   *   The menu link access service.
   */
  public function __construct(RequestStack $request_stack, ConfigFactoryInterface $config_factory, AccountInterface $account, TitleResolverInterface $title_resolver, AccessManagerInterface $access_manager) {
    $this->config = $config_factory->get('node.settings');
    $this->account = $account;
    $this->titleResolver = $title_resolver;
    $this->requestStack = $request_stack;
    $this->accessManager = $access_manager;
  }

  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $route_match) {
    $route_name = $route_match->getRouteName();
    return in_array($route_name, ['node.add_page', 'node.add', 'entity.node.edit_form', 'entity.node.version_history', 'entity.node.content_translation_overview', 'layout_builder.overrides.node.view', 'view.moderation_history.page'], TRUE);
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match) {
    $breadcrumb = new Breadcrumb();

    $breadcrumb->addLink(Link::createFromRoute($this->t('Home'), '<front>'));
    $breadcrumb->addLink(Link::createFromRoute($this->t('Administration'), 'system.admin'));

    if ($this->config->get('use_admin_theme') === TRUE &&
      $this->accessManager->checkNamedRoute('system.admin_content', [], $this->account, FALSE)) {
      // Fetch the title from the content view.
      $view = Views::getView('content');
      $title = $view->getTitle() ?? $this->t('Content');
      $breadcrumb->addLink(Link::createFromRoute($title, 'system.admin_content'));
    }
    if ($route_match->getRouteName() === 'node.add') {
      $breadcrumb->addLink(Link::createFromRoute($this->t('Add Content'), 'node.add_page'));
    }
    $breadcrumb->addCacheContexts(['route', 'user.permissions']);
    return $breadcrumb;
  }

}
