<?php

namespace Drupal\wxt_core\Commands;

use Consolidation\AnnotatedCommand\CommandData;
use Consolidation\OutputFormatters\Options\FormatterOptions;
use Drupal\Core\Extension\ProfileExtensionList;
use Drupal\Core\Plugin\CachedDiscoveryClearerInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drush\Commands\DrushCommands;
use Symfony\Component\Console\Event\ConsoleCommandEvent;

/**
 * Implements Drush command hooks.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class Hooks extends DrushCommands {
  use StringTranslationTrait;

  /**
   * The profile extension list service.
   *
   * @var \Drupal\Core\Extension\ProfileExtensionList
   */
  private $profileList;

  /**
   * The install_profile parameter.
   *
   * @var string
   */
  private $installProfile;

  /**
   * The plugin cache clearer service.
   *
   * @var \Drupal\Core\Plugin\CachedDiscoveryClearerInterface
   */
  private $pluginCacheClearer;

  /**
   * Hooks constructor.
   *
   * @param \Drupal\Core\Extension\ProfileExtensionList $profile_list
   *   The profile extension list service.
   * @param string $install_profile
   *   The install_profile parameter.
   * @param \Drupal\Core\Plugin\CachedDiscoveryClearerInterface $plugin_cache_clearer
   *   The plugin cache clearer service.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $string_translation
   *   The string translation service.
   */
  public function __construct(ProfileExtensionList $profile_list, $install_profile, CachedDiscoveryClearerInterface $plugin_cache_clearer, TranslationInterface $string_translation) {
    $this->profileList = $profile_list;
    $this->installProfile = $install_profile;
    $this->pluginCacheClearer = $plugin_cache_clearer;
    $this->setStringTranslation($string_translation);
  }

  /**
   * Clears all plugin caches before database updates begin.
   *
   * A common cause of errors during database updates is update hooks
   * inadvertently using stale data from the myriad caches in Drupal core and
   * contributed modules. To migitate this, we do a bit of cache pruning before
   * database updates begin.
   *
   * drupal_flush_all_caches() is extremely aggressive because it rebuilds the
   * router and other things, but it's a bit too much of a sledgehammer for our
   * purposes. A good compromise is to clear all plugin discovery caches (which
   * will include entity type definitions).
   *
   * @hook pre-command updatedb
   */
  public function preUpdate() {
    $this->pluginCacheClearer->clearCachedDefinitions();
  }

  /**
   * Defines the base-profile field to the core:status command.
   *
   * @param \Symfony\Component\Console\Event\ConsoleCommandEvent $event
   *   The command event.
   *
   * @see ::setBaseProfileFieldValue()
   *
   * @hook command-event core:status
   */
  public function defineExtraStatusFields(ConsoleCommandEvent $event) {
    $options = $event->getCommand()->getDefinition()->getOptions();

    $default_fields = $options['fields']->getDefault();
    $default_fields .= ',base-profile';
    $options['fields']->setDefault($default_fields);
  }

  /**
   * Sets the base-profile field value in core:status.
   *
   * @param mixed $result
   *   The result of the core:status command before alteration.
   * @param \Consolidation\AnnotatedCommand\CommandData $command_data
   *   The Drush command data.
   *
   * @see ::defineExtraStatusFields()
   *
   * @hook alter core:status
   */
  public function setBaseProfileFieldValue($result, CommandData $command_data) {
    $info = $this->profileList->get($this->installProfile);

    if (isset($info->info['base profile'])) {
      $base_profile = $info->info['base profile'];
    }
    else {
      $base_profile = $this->t('This profile does not extend a base profile.');
    }

    $formatter_options = $command_data->formatterOptions();
    // Add a field label for our new 'base-profile' field. This is required
    // in order for this field to be selectable; otherwise, our structured
    // data formatters will remove it.
    $field_labels = $formatter_options->get(FormatterOptions::FIELD_LABELS);
    $field_labels['base-profile'] = $this->t('Base Profile');
    $formatter_options->setFieldLabels($field_labels);
    // Add our data to the new field.
    $result['base-profile'] = $base_profile;
    return $result;
  }

}
