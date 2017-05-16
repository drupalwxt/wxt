<?php

namespace Drupal\wxt_core\Plugin\Field\FieldFormatter;

use Drupal\Core\Form\FormStateInterface;
use Drupal\image\Plugin\Field\FieldFormatter\ImageFormatterBase;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Url;
use Drupal\Component\Utility\Html;

/**
 * Lightbox (WxT) field formatter.
 *
 * @FieldFormatter(
 *   id = "wxt_lightbox",
 *   label = @Translation("Lightbox (WxT)"),
 *   field_types = {
 *    "image"
 *   }
 * )
 */
class Lightbox extends ImageFormatterBase {

  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      'thumb_image_style' => '',
      'lbx_image_style' => '',
      'lbx_gal' => 'all_items',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $form = parent::settingsForm($form, $form_state);
    $image_styles = image_style_options(FALSE);

    $form['thumb_image_style'] = [
      '#title' => $this->t('Thumbnail Image Style'),
      '#type' => 'select',
      '#default_value' => $this->getSetting('thumb_image_style'),
      '#empty_option' => $this->t('None (original image)'),
      '#options' => $image_styles,
    ];

    $form['lbx_image_style'] = [
      '#title' => $this->t('Lightbox Image Style'),
      '#type' => 'select',
      '#default_value' => $this->getSetting('lbx_image_style'),
      '#empty_option' => $this->t('None (original image)'),
      '#options' => $image_styles,
    ];

    $form['lbx_gal'] = [
      '#title' => $this->t('Gallery Options'),
      '#type' => 'select',
      '#default_value' => $this->getSetting('lbx_gal'),
      '#options' => $this->getGalleryOptions(),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $image_styles = image_style_options(FALSE);
    $thumb_image_style = $this->getSetting('thumb_image_style');
    $lbx_image_style = $this->getSetting('lbx_image_style');

    $summary[] = $this->t('Thumbnail image style: @thumb_style. Lightbox image style: @lbx_style', [
      '@thumb_style' => isset($image_styles[$thumb_image_style]) ? $thumb_image_style : 'Original Image',
      '@lbx_style' => isset($image_styles[$lbx_image_style]) ? $lbx_image_style : 'Original Image',
    ]);

    return $summary;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];
    $thumb_image_style = $this->getSetting('thumb_image_style');
    $lbx_image_style = $this->getSetting('lbx_image_style');
    $lbx_gal = $this->getSetting('lbx_gal');
    $files = $this->getEntitiesToView($items, $langcode);

    foreach ($files as $delta => $file) {
      $image_uri = $file->getFileUri();
      $lbx_image_path = !empty($lbx_image_style) ? ImageStyle::load($lbx_image_style)->buildUrl($image_uri) : $image_uri;

      $url = Url::fromUri(file_create_url($lbx_image_path));
      $item = $file->_referringItem;
      $item_attributes = $file->_attributes;
      unset($file->_attributes);

      $item_attributes['class'][] = 'thumbnail';

      if ($lbx_gal === 'first_item' && $delta > 0) {
        $item_attributes['class'][] = 'visually-hidden';
      }

      $elements[$delta] = [
        '#theme' => 'image_formatter',
        '#item' => $item,
        '#item_attributes' => $item_attributes,
        '#image_style' => $thumb_image_style,
        '#url' => $url,
      ];
    }

    return $elements;
  }

  /**
   * {@inheritdoc}
   */
  public function view(FieldItemListInterface $items, $langcode = NULL) {
    $elements = parent::view($items, $langcode);
    $lbx_gal = $this->getSetting('lbx_gal');
    $elements['#attributes']['class'][] = 'wb-lbx';
    $elements['#attributes']['class'][] = 'lbx-gal';
    $elements['#attributes']['class'][] = 'wxt-' . Html::cleanCssIdentifier($lbx_gal);
    return $elements;
  }

  /**
   * Get an array of gallery options.
   *
   * @return array
   *   An array of gallery options for use in display settings.
   */
  protected function getGalleryOptions() {
    return [
      'all_items' => $this->t('Gallery: All Items Displayed'),
      'first_item' => $this->t('Gallery: First Item Displayed'),
    ];
  }

}
