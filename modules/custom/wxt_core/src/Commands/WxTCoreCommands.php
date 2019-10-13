<?php

namespace Drupal\wxt_core\Commands;

use Drupal\wxt_core\UpdateManager;
use Drush\Commands\DrushCommands;
use Drush\Style\DrushStyle;

/**
 * Exposes Drush commands provided by WxT Core.
 */
class WxTCoreCommands extends DrushCommands {

  /**
   * The update manager service.
   *
   * @var \Drupal\wxt_core\UpdateManager
   */
  protected $updateManager;

  /**
   * WxTCoreCommands constructor.
   *
   * @param \Drupal\wxt_core\UpdateManager $update_manager
   *   The update manager service.
   */
  public function __construct(UpdateManager $update_manager) {
    $this->updateManager = $update_manager;
  }

  /**
   * Executes WxT configuration updates from a specific version.
   *
   * @command update:wxt
   *
   * @usage update:wxt
   *   Runs all available configuration updates.
   */
  public function update() {
    $io = new DrushStyle($this->input(), $this->output());
    $this->updateManager->executeAllInConsole($io);
  }

}
