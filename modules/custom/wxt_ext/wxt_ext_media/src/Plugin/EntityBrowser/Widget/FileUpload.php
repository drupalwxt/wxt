<?php

namespace Drupal\wxt_ext_media\Plugin\EntityBrowser\Widget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Plugin\Field\FieldType\FileItem;
use Drupal\image\Plugin\Field\FieldType\ImageItem;
use Drupal\wxt_ext_media\Element\AjaxUpload;
use Drupal\wxt_ext_media\MediaHelper;
use Drupal\media\MediaInterface;
use Drupal\media\MediaTypeInterface;

/**
 * An Entity Browser widget for creating media entities from uploaded files.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 *
 * @EntityBrowserWidget(
 *   id = "file_upload",
 *   label = @Translation("File Upload"),
 *   description = @Translation("Allows creation of media entities from file uploads."),
 * )
 */
class FileUpload extends EntityFormProxy {

  /**
   * {@inheritdoc}
   */
  protected function getCurrentValue(FormStateInterface $form_state) {
    $value = parent::getCurrentValue($form_state);
    return $value['fid'] ?? NULL;
  }

  /**
   * {@inheritdoc}
   */
  protected function prepareEntities(array $form, FormStateInterface $form_state) {
    $entities = parent::prepareEntities($form, $form_state);

    $get_file = function (MediaInterface $entity) {
      return MediaHelper::getSourceField($entity)->entity;
    };

    if ($this->configuration['return_file']) {
      return array_map($get_file, $entities);
    }
    else {
      return $entities;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getForm(array &$original_form, FormStateInterface $form_state, array $additional_widget_parameters) {
    $form = parent::getForm($original_form, $form_state, $additional_widget_parameters);

    $form['input'] = [
      '#type' => 'ajax_upload',
      '#title' => $this->t('File'),
      '#required' => TRUE,
      '#process' => [
        [$this, 'processUploadElement'],
      ],
      '#upload_validators' => $this->getUploadValidators(),
      '#weight' => 70,
    ];

    return $form;
  }

  /**
   * Returns all applicable upload validators.
   *
   * @return array[]
   *   A set of argument arrays for each upload validator, keyed by the upload
   *   validator's function name.
   */
  protected function getUploadValidators() {
    $validators = $this->configuration['upload_validators'];

    // If the widget context didn't specify any file extension validation, add
    // it as the first validator, allowing it to accept only file extensions
    // associated with existing media bundles.
    if (empty($validators['file_validate_extensions'])) {
      return array_merge([
        'file_validate_extensions' => [
          implode(' ', $this->getAllowedFileExtensions()),
        ],
      ], $validators);
    }
    return $validators;
  }

  /**
   * Returns all file extensions accepted by the allowed media types.
   *
   * @return string[]
   *   The allowed file extensions.
   */
  protected function getAllowedFileExtensions() {
    $extensions = '';

    foreach ($this->getAllowedTypes() as $media_type) {
      $extensions .= $media_type->getSource()
        ->getSourceFieldDefinition($media_type)
        ->getSetting('file_extensions') . ' ';
    }
    $extensions = preg_split('/,?\s+/', rtrim($extensions));

    return array_unique($extensions);
  }

  /**
   * {@inheritdoc}
   */
  public function validate(array &$form, FormStateInterface $form_state) {
    $fid = $this->getCurrentValue($form_state);
    if ($fid) {
      parent::validate($form, $form_state);

      $media = $this->getCurrentEntity($form_state);
      if ($media) {
        foreach ($this->validateFile($media) as $error) {
          $form_state->setError($form['widget']['input'], $error);
        }
      }
    }
  }

  /**
   * Validates the file entity associated with a media item.
   *
   * @param \Drupal\media\MediaInterface $media
   *   The media item.
   *
   * @return array[]
   *   Any errors returned by file_validate().
   */
  protected function validateFile(MediaInterface $media) {
    $field = $media->getSource()
      ->getSourceFieldDefinition($media->bundle->entity)
      ->getName();

    /** @var \Drupal\file\Plugin\Field\FieldType\FileItem $item */
    $item = $media->get($field)->first();

    $validators = [
      // It's maybe a bit overzealous to run this validator, but hey...better
      // safe than screwed over by script kiddies.
      'file_validate_name_length' => [],
    ];
    $validators = array_merge($validators, $item->getUploadValidators());
    // This function is only called by the custom FileUpload widget, which runs
    // file_validate_extensions before this function. So there's no need to
    // validate the extensions again.
    unset($validators['file_validate_extensions']);

    // If this is an image field, add image validation. Against all sanity,
    // this is normally done by ImageWidget, not ImageItem, which is why we
    // need to facilitate this a bit.
    if ($item instanceof ImageItem) {
      // Validate that this is, indeed, a supported image.
      $validators['file_validate_is_image'] = [];

      $settings = $item->getFieldDefinition()->getSettings();
      if ($settings['max_resolution'] || $settings['min_resolution']) {
        $validators['file_validate_image_resolution'] = [
          $settings['max_resolution'],
          $settings['min_resolution'],
        ];
      }
    }
    return file_validate($item->entity, $validators);
  }

  /**
   * {@inheritdoc}
   */
  public function submit(array &$element, array &$form, FormStateInterface $form_state) {
    /** @var \Drupal\media\MediaInterface $entity */
    $entity = $element['entity']['#entity'];

    $file = MediaHelper::useFile(
      $entity,
      MediaHelper::getSourceField($entity)->entity
    );
    $file->setPermanent();
    $file->save();
    $entity->save();

    $selection = [
      $this->configuration['return_file'] ? $file : $entity,
    ];
    $this->selectEntities($selection, $form_state);
  }

  /**
   * Processes the upload element.
   *
   * @param array $element
   *   The upload element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return array
   *   The processed upload element.
   */
  public function processUploadElement(array $element, FormStateInterface $form_state) {
    $element = AjaxUpload::process($element, $form_state);

    $element['upload_button']['#ajax']['callback'] =
    $element['remove']['#ajax']['callback'] = [static::class, 'ajax'];

    $element['remove']['#value'] = $this->t('Cancel');

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    $configuration = parent::defaultConfiguration();
    $configuration['return_file'] = FALSE;
    $configuration['upload_validators'] = [];
    return $configuration;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form = parent::buildConfigurationForm($form, $form_state);

    $form['return_file'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Return source file entity'),
      '#default_value' => $this->configuration['return_file'],
      '#description' => $this->t('If checked, the source file(s) of the media entity will be returned from this widget.'),
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  protected function isAllowedType(MediaTypeInterface $media_type) {
    $is_allowed = parent::isAllowedType($media_type);

    if ($is_allowed) {
      $item_class = $media_type->getSource()
        ->getSourceFieldDefinition($media_type)
        ->getItemDefinition()
        ->getClass();

      $is_allowed = is_a($item_class, FileItem::class, TRUE);
    }
    return $is_allowed;
  }

}
