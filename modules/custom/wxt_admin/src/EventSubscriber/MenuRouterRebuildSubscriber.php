<?php

namespace Drupal\wxt_admin\EventSubscriber;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Rebuilds the menu router to ensure image derivatives are created.
 */
class MenuRouterRebuildSubscriber implements EventSubscriberInterface {

  /**
   * Rebuilds the menu router if the rebuild.dat file is found.
   *
   * @param \Symfony\Component\HttpKernel\Event\GetResponseEvent $event
   *   The Event to process.
   */
  public function onKernelRequestMenuRouterRebuild(GetResponseEvent $event) {
    if (file_exists("public://rebuild.dat")) {
      $site_path = preg_replace('/^sites\//', '', \Drupal::service('site.path'));
      if (!file_exists('public://.drushrc') && file_exists('public://') && is_writable('public://') && file_put_contents('public:///.drushrc', "<?php\n\$options['l'] = 'http://${site_path}';")) {
        drupal_chmod('public:///.drushrc', 0444);
      }

      if (\Drupal::service('router.builder')->rebuild()) {
        file_unmanaged_delete("public://rebuild.dat");
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
