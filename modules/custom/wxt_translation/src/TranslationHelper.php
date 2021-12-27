<?php

namespace Drupal\wxt_translation;

use Symfony\Component\Yaml\Parser;

/**
 * Translation Helper.
 */
class TranslationHelper {

  /**
   * Import translations for a given module.
   *
   * @param string $module
   *   The Module name.
   */
  public static function importTranslations($module) {
    // Import translations.
    $language_manager = \Drupal::languageManager();
    $yaml_parser = new Parser();
    // The language code of the default locale.
    $site_default_langcode = $language_manager->getDefaultLanguage()->getId();
    // The directory where the language config files reside.
    $module_handler = \Drupal::service('module_handler');
    $path = $module_handler->getModule($module)->getPath();
    $language_config_directory = DRUPAL_ROOT . '/' . $path . '/config/language';
    if (!is_dir($language_config_directory)) {
      $message = t('Directory not found: @language_config_directory', ['@$language_config_directory' => $language_config_directory]);
      \Drupal::logger($module)->error($message);
      return;
    }

    // Sub-directory names (language codes).
    // The language code of the default language is excluded. If the user
    // chooses to install in French etc, the language config is imported by core
    // and the user has the chance to override it during the installation.
    $langcodes = array_diff(scandir($language_config_directory),
        ['..', '.', $site_default_langcode]);

    foreach ($langcodes as $langcode) {
      // All .yml files in the language's config subdirectory.
      $config_files = glob("$language_config_directory/$langcode/*.yml");

      foreach ($config_files as $file_name) {
        // Information from the .yml file as an array.
        $yaml = $yaml_parser->parse(file_get_contents($file_name));
        if (!$yaml) {
          $message = t('Skipping @file_name', ['@file_name' => $file_name]);
          \Drupal::logger($module)->notice($message);
          continue;
        }
        $message = t('Importing @file_name', ['@file_name' => $file_name]);
        \Drupal::logger($module)->notice($message);
        // Uses the base name of the .yml file to get the config name.
        $config_name = basename($file_name, '.yml');

        /** @var \Drupal\language\ConfigurableLanguageManager $language_manager */
        $config = $language_manager->getLanguageConfigOverride($langcode, $config_name);

        foreach ($yaml as $config_key => $config_value) {
          // Updates the configuration object.
          $config->set($config_key, $config_value);
        }

        // Saves the configuration.
        $config->save();
      }
    }
  }

}
