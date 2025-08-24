<?php

namespace Drupal\wxt_ext_media_image\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\media\Entity\Media;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Plugin implementation of the 'lightbox_gallery' formatter.
 *
 * @FieldFormatter(
 *   id = "lightbox_gallery",
 *   label = @Translation("WxT Lightbox Gallery"),
 *   field_types = {
 *     "entity_reference"
 *   }
 * )
 */
class LightboxGalleryFormatter extends FormatterBase {

  protected FileUrlGeneratorInterface $fileUrlGenerator;

  /**
   * {@inheritdoc}
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    FieldDefinitionInterface $field_definition,
    array $settings,
    $label,
    $view_mode,
    array $third_party_settings,
    FileUrlGeneratorInterface $file_url_generator
  ) {
    parent::__construct($plugin_id, $plugin_definition, $field_definition, $settings, $label, $view_mode, $third_party_settings);
    $this->fileUrlGenerator = $file_url_generator;
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $configuration['field_definition'],
      $configuration['settings'],
      $configuration['label'],
      $configuration['view_mode'],
      $configuration['third_party_settings'],
      $container->get('file_url_generator')
    );
  }

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'large_image_style' => 'large',
      'thumbnail_image_style' => 'thumbnail',
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $image_styles = ['original' => $this->t('Original image')] + image_style_options(FALSE);

    return [
      'large_image_style' => [
        '#type' => 'select',
        '#title' => $this->t('Large image style'),
        '#default_value' => $this->getSetting('large_image_style'),
        '#options' => $image_styles,
        '#description' => $this->t('Used for the lightbox (full image).'),
      ],
      'thumbnail_image_style' => [
        '#type' => 'select',
        '#title' => $this->t('Thumbnail image style'),
        '#default_value' => $this->getSetting('thumbnail_image_style'),
        '#options' => $image_styles,
        '#description' => $this->t('Used for the gallery thumbnail.'),
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $image_styles = ['original' => $this->t('Original image')] + image_style_options(FALSE);

    return [
      $this->t('Large image style: @style', ['@style' => $image_styles[$this->getSetting('large_image_style')] ?? $this->getSetting('large_image_style')]),
      $this->t('Thumbnail image style: @style', ['@style' => $image_styles[$this->getSetting('thumbnail_image_style')] ?? $this->getSetting('thumbnail_image_style')]),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    // Get image styles.
    $large_style_id = $this->getSetting('large_image_style');
    $thumb_style_id = $this->getSetting('thumbnail_image_style');

    $large_style = $large_style_id !== 'original' ? ImageStyle::load($large_style_id) : NULL;
    $thumb_style = $thumb_style_id !== 'original' ? ImageStyle::load($thumb_style_id) : NULL;

    $render = [
      '#type' => 'inline_template',
      '#template' => '<div class="wb-lbx lbx-gal">
  <ul class="list-inline">
    {% for item in images %}
    <li>
      <a href="{{ item.large_url }}" title="{{ item.alt }}">
        <img src="{{ item.thumb_url }}" alt="{{ item.alt }}"
          {% if item.desc_id %} aria-describedby="{{ item.desc_id }}" longdesc="#{{ item.desc_id }}"{% endif %} />
      </a>
    </li>
    {% endfor %}
  </ul>
</div>',
      '#context' => ['images' => []],
    ];

    foreach ($items as $delta => $item) {
      $media = Media::load($item->target_id);
      if ($media && $media->hasField('field_media_image')) {
        $image_file = $media->get('field_media_image')->entity;
        if ($image_file instanceof File) {
          $alt = $media->get('field_media_image')->alt ?? 'Image';
          $uri = $image_file->getFileUri();

          $render['#context']['images'][] = [
            'large_url' => $large_style ? $large_style->buildUrl($uri) : $this->fileUrlGenerator->generateAbsoluteString($uri),
            'thumb_url' => $thumb_style ? $thumb_style->buildUrl($uri) : $this->fileUrlGenerator->generateAbsoluteString($uri),
            'alt' => $alt,
            'desc_id' => NULL,
          ];
        }
      }
    }

    $elements[] = $render;
    return $elements;
  }
}
