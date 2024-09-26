<?php

/**
 * @file
 * Contains \WxTSubContext.
 */

use Behat\Behat\Hook\Scope\AfterScenarioScope;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Drupal\Core\Database\Database;
use Drupal\DrupalExtension\Context\DrupalSubContextBase;

/**
 * Sub context for WxT step definitions.
 */
class WxTSubContext extends DrupalSubContextBase {

  /**
   * The Mink context.
   *
   * @var \Drupal\DrupalExtension\Context\MinkContext
   */
  protected $minkContext;

  /**
   * Start time for each scenario.
   *
   * @var int
   */
  protected $startTime;

  /**
   * Pre-scenario hook.
   *
   * @BeforeScenario
   */
  public function gatherContexts(BeforeScenarioScope $scope) {
    $environment = $scope->getEnvironment();

    $this->minkContext = $environment->getContext('Drupal\DrupalExtension\Context\MinkContext');
  }

  /**
   * Store current time.
   *
   * @BeforeScenario ~@errors
   */
  public function setStartTime() {
    $this->startTime = time();
  }

  /**
   * Check for errors since the scenario started.
   *
   * @AfterScenario ~@errors
   */
  public function checkWatchdog(AfterScenarioScope $scope) {
    $db = Database::getConnection();
    if ($db->schema()->tableExists('watchdog')) {
      $log = $db->select('watchdog', 'w')
        ->fields('w')
        ->condition('w.type', 'php', '=')
        ->condition('w.timestamp', $this->startTime, '>=')
        ->execute()
        ->fetchAll();
      if (!empty($log)) {
        foreach ($log as $error) {
          // Make the substitutions easier to read in the log.
          $error->variables = unserialize($error->variables);
        }
        throw new \Exception('PHP errors logged to watchdog in this scenario.');
      }
    }
  }

}
