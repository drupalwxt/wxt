<?php

namespace Drupal\wxt\Robo\Common;

/**
 * Class EnvironmentDetector.
 *
 * @package Drupal\wxt\Robo\Common
 *
 * Attempts to detect various properties about the current hosting environment.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class EnvironmentDetector {

  /**
   * Get CI env name.
   *
   * In the case of multiple environment detectors declaring a CI env name, the
   * first one wins.
   */
  public static function getCiEnv() {
    $results = self::getSubclassResults(__FUNCTION__);
    if ($results) {
      return current($results);
    }

    $mapping = [
      'GITLAB' => 'gitlab',
      'GITHUB' => 'github',
    ];
    foreach ($mapping as $env_var => $ci_name) {
      if (getenv($env_var)) {
        return $ci_name;
      }
    }
    return FALSE;
  }

  /**
   * Is CI.
   */
  public static function isCiEnv() {
    return self::getCiEnv() || getenv('CI');
  }

  /**
   * Is local.
   */
  public static function isLocalEnv() {
    return !self::isCiEnv();
  }

  /**
   * Is dev.
   */
  public static function isDevEnv() {
    $results = self::getSubclassResults(__FUNCTION__);
    if ($results) {
      return TRUE;
    }
  }

  /**
   * Is test.
   */
  public static function isTestEnv() {
    $results = self::getSubclassResults(__FUNCTION__);
    if ($results) {
      return TRUE;
    }
  }

  /**
   * Is QA.
   */
  public static function isQaEnv() {
    $results = self::getSubclassResults(__FUNCTION__);
    if ($results) {
      return TRUE;
    }
  }

  /**
   * Is prod.
   */
  public static function isProdEnv() {
    $results = self::getSubclassResults(__FUNCTION__);
    if ($results) {
      return TRUE;
    }
  }

  /**
   * Find the repo root.
   *
   * This isn't as trivial as it sounds, since a simple relative path
   * (__DIR__ . '/../../../../../../') won't work if this package is symlinked
   * using a Composer path repository, and this file can be invoked from both
   * web requests and WxT CLI calls.
   *
   * @return string
   *   The repo root as an absolute path.
   */
  public static function getRepoRoot() {
    if (defined('DRUPAL_ROOT')) {
      // This is a web or Drush request.
      return dirname(DRUPAL_ROOT);
    }
  }

  /**
   * List detectable environments and whether they are currently active.
   */
  public static function getEnvironments() {
    return [
      'local' => self::isLocalEnv(),
      'dev' => self::isDevEnv(),
      'test' => self::isTestEnv(),
      'qa' => self::isQaEnv(),
      'prod' => self::isProdEnv(),
      'ci' => self::isCiEnv(),
    ];
  }

  /**
   * Call a given function in all EnvironmentDetector subclasses.
   *
   * Composer packages can provide their own version of an EnvironmentDetector
   * that inherits from this one. This allows for detection of new types of
   * environments not hardcoded in this class.
   *
   * @param string $functionName
   *   The function name to call in a subclass.
   *
   * @return array
   *   Results from each subclass function call (omits any null / false results)
   *
   * @throws \ReflectionException
   */
  private static function getSubclassResults($functionName) {
    static $detectors;
    if (!isset($detectors)) {
      $autoload_file = self::getRepoRoot() . '/vendor/autoload.php';
      if (!file_exists($autoload_file)) {
        $detectors = [];
        return [];
      }
      // phpcs:ignore
      $autoloader = require $autoload_file;
      $classMap = $autoloader->getClassMap();
      $detectors = array_filter($classMap, function ($classPath) {
        return strpos($classPath, 'WxT/Plugin/EnvironmentDetector') !== FALSE;
      });
    }
    $results = [];
    foreach ($detectors as $detector => $classPath) {
      // Only call this method if it's been overridden by the child class.
      $detectorReflector = new \ReflectionMethod($detector, $functionName);
      if ($detectorReflector->getDeclaringClass()->getName() === $detector) {
        $results[] = call_user_func([$detector, $functionName]);
      }
    }
    return array_filter($results);
  }

}
