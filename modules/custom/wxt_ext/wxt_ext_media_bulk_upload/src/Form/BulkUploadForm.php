<?php

namespace Drupal\wxt_ext_media_bulk_upload\Form;

use Drupal\Component\Utility\Environment;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\lightning_core\Element;
use Drupal\wxt_ext_media\Exception\IndeterminateBundleException;
use Drupal\wxt_ext_media\MediaHelper;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A form for uploading multiple media assets at once.
 */
class BulkUploadForm extends FormBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The media helper service.
   *
   * @var \Drupal\wxt_ext_media\MediaHelper
   */
  protected $helper;

  /**
   * The media bundle info service.
   *
   * @var \Drupal\Core\Entity\EntityTypeBundleInfoInterface
   */
  protected $bundle_info;

  /**
   * BulkUploadForm constructor.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Drupal\wxt_ext_media\MediaHelper $helper
   *   The media helper service.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $translator
   *   The string translation service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, MediaHelper $helper, TranslationInterface $translator, EntityTypeBundleInfoInterface $bundle_info) {
    $this->entityTypeManager = $entity_type_manager;
    $this->helper = $helper;
    $this->setStringTranslation($translator);
    $this->bundle_info = $bundle_info;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('wxt.media_helper'),
      $container->get('string_translation'),
      $container->get('entity_type.bundle.info')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'bulk_upload_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $extensions = $this->helper->getFileExtensions(TRUE);
    $bundles = $this->bundle_info->getBundleInfo('media');
    $options = [];

    foreach (array_keys($bundles) as $key) {
      $options[$key] = $bundles[$key]['label'];
    }

    $form['dropzone'] = [
      '#type' => 'dropzonejs',
      '#dropzone_description' => $this->t('Drag files here to upload them'),
      '#extensions' => implode(' ', $extensions),
    ];
    $form['select_extension'] = [
      '#type' => 'select',
      '#title' => $this
        ->t('Select A File type'),
      '#options' => $options,
    ];
    $form['continue'] = [
      '#type' => 'submit',
      '#value' => $this->t('Continue'),
    ];

    // Support both Drupal 8.7's API and its antecedents. We need to call
    // file_upload_max_size() as a string in order to prevent deprecation
    // testing failures.
    $max_size = version_compare(\Drupal::VERSION, '8.7.0', '>=')
      ? Environment::getUploadMaxSize()
      : call_user_func('file_upload_max_size');

    $variables = [
      '@max_size' => static::bytesToString($max_size),
      '@extensions' => Element::oxford($extensions, $this->t('and')),
    ];
    $form['dropzone']['#description'] = $this->t('You can upload as many files as you like. Each file can be up to @max_size in size. The following file extensions are accepted: @extensions', $variables);

    return $form;
  }

  /**
   * Converts a number of bytes into a human-readable string.
   *
   * @param int $bytes
   *   A number of bytes.
   *
   * @return string
   *   The human-readable measurement, like '2 MB' or '10 GB'.
   */
  public static function bytesToString($bytes) {
    $units = array_map('t', ['bytes', 'KB', 'MB', 'GB', 'TB']);

    while ($bytes > 1024) {
      $bytes /= 1024;
      array_shift($units);
    }
    return $bytes . ' ' . reset($units);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $bulk_create = [];

    $uploads = $form_state->getValue(['dropzone', 'uploaded_files']);
    $bundle =  $form_state->getValue('select_extension');
    foreach ($uploads as $upload) {
      // Create a file entity for the temporary file.
      /** @var \Drupal\file\FileInterface $file */
      $file = $this->entityTypeManager->getStorage('file')->create([
        'uri' => $upload['path'],
        'uid' => $this->currentUser()->id(),
      ]);
      $file->setTemporary();
      $file->save();

      try {
        $entity = $this->helper->createFromInput($file, [$bundle]);
      }
      catch (IndeterminateBundleException $e) {
        $this->messenger()->addError((string) $e);
        continue;
      }

      $file = MediaHelper::useFile($entity, $file);
      $file->setPermanent();
      $file->save();
      $entity->save();
      array_push($bulk_create, $bulk_create ? $entity->id() : $entity);
    }

    if ($bulk_create) {
      /** @var \Drupal\media\MediaInterface $entity */
      $redirect = array_shift($bulk_create)->toUrl('edit-form', [
        'query' => [
          'bulk_create' => $bulk_create,
        ],
      ]);
      $form_state->setRedirectUrl($redirect);
    }
  }

}
