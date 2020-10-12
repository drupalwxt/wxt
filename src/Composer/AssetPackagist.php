<?php

namespace Drupal\wxt\Composer;

use Composer\Json\JsonFile;
use Composer\Script\Event;

/**
 * Adds Asset Packagist support to a composer.json.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
final class AssetPackagist {

  /**
   * Reads the root package's composer.json.
   *
   * This will be the composer.json closest to the current working directory
   * that contains a dependency on acquia/wxt.
   *
   * @return \Composer\Json\JsonFile
   *   File wrapper around the root package's composer.json.
   */
  protected static function getRootPackage() {
    $file = new JsonFile('composer.json');

    // Split the current working directory into an array, accounting for leading
    // and trailing directory separators.
    $dir = explode(DIRECTORY_SEPARATOR, trim(getcwd(), DIRECTORY_SEPARATOR));

    do {
      if ($file->exists()) {
        $info = $file->read();

        if (isset($info['require']['drupalwxt/wxt'])) {
          return $file;
        }
      }
      chdir('..');
      array_pop($dir);
    } while ($dir);

    throw new \RuntimeException('Could not locate the root package.');
  }

  /**
   * Executes the script.
   *
   * @param \Composer\Script\Event $event
   *   The script event.
   */
  public static function execute(Event $event) {
    $io = $event->getIO();

    // Search upwards for a composer.json which depends on drupalwxt/wxt.
    $io->write('Searching for root package...');

    $file = static::getRootPackage();

    $package = $file->read();

    // Add the Asset Packagist repository if it does not already exist.
    if (isset($package['repositories'])) {
      $repository_key = NULL;

      foreach ($package['repositories'] as $key => $repository) {
        if ($repository['type'] == 'composer' && strpos($repository['url'], 'https://asset-packagist.org') === 0) {
          $repository_key = $key;
          break;
        }
      }

      if (is_null($repository_key)) {
        $package['repositories']['asset-packagist'] = [
          'type' => 'composer',
          'url' => 'https://asset-packagist.org',
        ];
      }
    }

    // oomphinc/composer-installers-extender is required by WxT and
    // depends on composer/installers, so it does not need to be specifically
    // included.
    unset(
      $package['require']['composer/installers'],
      $package['require']['oomphinc/composer-installers-extender']
    );

    $package['extra']['installer-types'][] = 'bower-asset';
    $package['extra']['installer-types'][] = 'npm-asset';
    $package['extra']['installer-paths']['docroot/libraries/{$name}'][] = 'type:bower-asset';
    $package['extra']['installer-paths']['docroot/libraries/{$name}'][] = 'type:npm-asset';

    $file->write($package);
    $io->write('Successfully updated your root composer.json file. Switch back to your project root and run "composer update".');
  }

}
