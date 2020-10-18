<?php

namespace Drupal\wxt_admin\EventSubscriber;

use Drupal\Core\Routing\RouteBuilderInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\Core\File\FileSystemInterface;

/**
 * Rebuilds the menu router to ensure image derivatives are created.
 */
class MenuRouterRebuildSubscriber implements EventSubscriberInterface {

  /**
   * The site path.
   *
   * @var string
   */
  protected $sitePath;

  /**
   * The router builder.
   *
   * @var \Drupal\Core\Routing\RouteBuilderInterface
   */
  protected $routerBuilder;

  /**
   * The file system service.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected $fileSystem;

  /**
   * Constructs a new MenuRouterRebuildSubscriber.
   *
   * @param string $site_path
   *   The site path.
   * @param \Drupal\Core\Routing\RouteBuilderInterface $route_builder
   *   The router builder service.
   * @param \Drupal\Core\File\FileSystemInterface $file_system
   *   The file system service.
   */
  public function __construct($site_path, RouteBuilderInterface $route_builder, FileSystemInterface $file_system) {
    $this->sitePath = $site_path;
    $this->routerBuilder = $route_builder;
    $this->fileSystem = $file_system;
  }

  /**
   * Rebuilds the menu router if the rebuild.dat file is found.
   *
   * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   *   The Event to process.
   */
  public function onKernelRequestMenuRouterRebuild(GetResponseEvent $event) {
    if (file_exists("public://rebuild.dat")) {
      $site_path = preg_replace('/^sites\//', '', $this->sitePath);
      if (!file_exists('public://.drushrc') && file_exists('public://') && is_writable('public://') && file_put_contents('public:///.drushrc', "<?php\n\$options['l'] = 'http://${site_path}';")) {
        $this->fileSystem->chmod('public:///.drushrc', 0444);
      }

      if ($this->routerBuilder->rebuild()) {
        $this->fileSystem->delete("public://rebuild.dat");
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['onKernelRequestMenuRouterRebuild', 255];

    return $events;
  }

}
