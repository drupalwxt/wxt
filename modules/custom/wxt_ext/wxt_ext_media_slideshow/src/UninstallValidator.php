<?php

namespace Drupal\wxt_ext_media_slideshow;

use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Extension\ModuleUninstallValidatorInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\StringTranslation\TranslationInterface;

/**
 * Prevents this module from being uninstalled if any slideshow blocks exist.
 */
class UninstallValidator implements ModuleUninstallValidatorInterface {

  use StringTranslationTrait;

  /**
   * The block content entity storage handler.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $blockContentStorage;

  /**
   * Constructs a new validator.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $string_translation
   *   The string translation service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, TranslationInterface $string_translation) {
    $this->blockContentStorage = $entity_type_manager->getStorage('block_content');
    $this->setStringTranslation($string_translation);
  }

  /**
   * {@inheritdoc}
   */
  public function validate($module) {
    $problems = [];
    if ($module === 'wxt_ext_media_slideshow' && $this->hasSlideshowBlocks()) {
      $problems[] = $this->t('To uninstall Media Slideshow, you must delete all slideshow blocks first.');
    }
    return $problems;
  }

  /**
   * Determines if any slideshow blocks exist.
   *
   * @return bool
   *   TRUE if there are slideshow blocks, FALSE otherwise.
   */
  protected function hasSlideshowBlocks() {
    $count = $this->blockContentStorage
      ->getQuery()
      ->condition('type', 'media_slideshow')
      ->accessCheck(FALSE)
      ->count()
      ->execute();

    return !empty($count);
  }

}
