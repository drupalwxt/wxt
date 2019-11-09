<?php

namespace Drupal\wxt_core\Commands;

use Consolidation\AnnotatedCommand\CommandData;
use Consolidation\OutputFormatters\Options\FormatterOptions;
use Drupal\Core\Extension\ProfileExtensionList;
use Drush\Commands\DrushCommands;
use Symfony\Component\Console\Event\ConsoleCommandEvent;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;

/**
 * Implements Drush command hooks.
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
   * Hooks constructor.
   *
   * @param \Drupal\Core\Extension\ProfileExtensionList $profile_list
   *   The profile extension list service.
   * @param string $install_profile
   *   The install_profile parameter.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $string_translation
   *   The string translation service.
   */
  public function __construct(ProfileExtensionList $profile_list, $install_profile, TranslationInterface $string_translation) {
    $this->profileList = $profile_list;
    $this->installProfile = $install_profile;
    $this->setStringTranslation($string_translation);
  }

  /**
   * Clears all caches before database updates begin.
   *
   * A common cause of errors during database updates is update hooks
   * inadvertently using stale data from the myriad caches in Drupal core and
   * contributed modules. Clearing all caches before updates begin ensures that
   * the system always has the freshest and most accurate data to work with,
   * which is especially helpful during major surgery like a database update.
   *
   * @hook pre-command updatedb
   */
  public function preUpdate() {
    drupal_flush_all_caches();
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
