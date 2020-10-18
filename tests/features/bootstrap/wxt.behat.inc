<?php

/**
 * @file
 * Contains \WxTSubContext.
 */

use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Behat\Behat\Hook\Scope\AfterScenarioScope;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Mink\Exception\ElementNotFoundException;
use Behat\Mink\Exception\ExpectationException;
use Behat\Mink\Exception\UnsupportedDriverActionException;
use Drupal\DrupalExtension\Context\DrupalSubContextBase;
use Drupal\Core\Database\Database;

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
          print_r($error);
        }
        throw new \Exception('PHP errors logged to watchdog in this scenario.');
      }
    }
  }

}
