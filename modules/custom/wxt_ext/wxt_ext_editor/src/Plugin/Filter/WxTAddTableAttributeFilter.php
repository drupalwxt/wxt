<?php

namespace Drupal\wxt_ext_editor\Plugin\Filter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Form\FormStateInterface;
use Drupal\filter\FilterProcessResult;
use Drupal\filter\Plugin\FilterBase;

/**
 * Provides a filter to turn tables into Datatables.
 *
 * @see: \Drupal\wxt_ext_editor\Plugin\Filter\WxTAddTableAttributeFilter::settingsForm
 *
 * @Filter(
 *   id = "wxt_add_table_attribute_filter",
 *   module = "wxt_ext_editor",
 *   title = @Translation("Modify table attributes (WxT)"),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_MARKUP_LANGUAGE,
 *   settings = {
 *     "responsive" = TRUE,
 *     "replace_classes" = TRUE,
 *     "replace_all_classes" = TRUE,
 *     "classes" = "wb-tables table",
 *     "whitelist_classes" = "",
 *     "add_datatable_attribute" = FALSE,
 *     "datatable_options" = "",
 *   },
 * )
 */
class WxTAddTableAttributeFilter extends FilterBase {

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    $form['responsive'] = [
      '#title' => $this->t('Make table responsive'),
      '#description' => $this->t('Wraps the table element in a div with the "table-responsive" class.'),
      '#type' => 'checkbox',
      '#default_value' => $this->settings['responsive'],
    ];

    $form['replace_classes'] = [
      '#title' => $this->t('Replace table classes'),
      '#description' => $this->t('Enable the table class replacement filter.'),
      '#type' => 'checkbox',
      '#default_value' => $this->settings['replace_classes'],
    ];

    $form['replace_all_classes'] = [
      '#title' => $this->t('Replace all table classes'),
      '#description' => $this->t('Replaces all existing table classes with classes specified. Uncheck to whitelist classes.'),
      '#type' => 'checkbox',
      '#default_value' => $this->settings['replace_all_classes'],
      '#states' => [
        'invisible' => [
          ':input[name="filters[wxt_add_table_attribute_filter][settings][replace_classes]"]' => ['checked' => FALSE],
        ],
      ],
    ];

    $form['classes'] = [
      '#title' => $this->t('New table classes'),
      '#description' => $this->t('Classes to add to the table.'),
      '#type' => 'textfield',
      '#default_value' => $this->settings['classes'],
      '#states' => [
        'invisible' => [
          ':input[name="filters[wxt_add_table_attribute_filter][settings][replace_classes]"]' => ['checked' => FALSE],
        ],
      ],
    ];

    $form['whitelist_classes'] = [
      '#title' => $this->t('Whitelist classes'),
      '#description' => $this->t('Keep the whitelisted classes and add new classes if they do not already exist.'),
      '#type' => 'textfield',
      '#default_value' => $this->settings['whitelist_classes'],
      '#states' => [
        'invisible' => [
          [
            ':input[name="filters[wxt_add_table_attribute_filter][settings][replace_classes]"]' => ['checked' => FALSE],
          ],
          'or',
          [
            ':input[name="filters[wxt_add_table_attribute_filter][settings][replace_all_classes]"]' => ['checked' => TRUE],
          ],
        ],
      ],
    ];

    $form['add_datatable_attribute'] = [
      '#title' => $this->t('Add datatable options'),
      '#description' => $this->t('Enable to add custom datatable options.'),
      '#type' => 'checkbox',
      '#default_value' => $this->settings['add_datatable_attribute'],
    ];

    $form['datatable_options'] = [
      '#title' => $this->t('Datatable options'),
      '#description' => $this->t('Specify which datatable options to use. Example: { "ordering" : false }'),
      '#type' => 'textfield',
      '#default_value' => $this->settings['datatable_options'],
      '#states' => [
        'invisible' => [
          ':input[name="filters[wxt_add_table_attribute_filter][settings][add_datatable_attribute]"]' => ['checked' => FALSE],
        ],
      ],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode) {
    $result = new FilterProcessResult($text);

    $responsive = $this->settings['responsive'];
    $replace_classes = $this->settings['replace_classes'];
    $replace_all_classes = $this->settings['replace_all_classes'];
    $add_classes = explode(" ", $this->settings['classes']);
    $whitelisted_classes = explode(" ", $this->settings['whitelist_classes']);
    $add_datatable_attribute = $this->settings['add_datatable_attribute'];
    $datatable_options = $this->settings['datatable_options'];

    $dom = Html::load($text);
    $xpath = new \DOMXPath($dom);

    foreach ($xpath->query('//table') as $node) {
      if ($replace_classes) {
        if ($replace_all_classes) {
          // Replace all existing classes
          $node->setAttribute('class', $this->settings['classes']);
        }
        else {
          // Add new classes and keep whitelisted classes
          $existing_classes = explode(" ", $node->getAttribute('class'));

          foreach ($existing_classes as $key => $value) {
            if (!in_array($value, $whitelisted_classes)) {
              // Remove class if not in whitelist
              unset($existing_classes[$key]);
            }
          }

          foreach ($add_classes as $class) {
            if (!in_array($class, $existing_classes)) {
              $existing_classes[] = $class;
            }
          }

          // Replace classes with new classes
          $node->setAttribute('class', implode(" ", $existing_classes));
        }
      }

      if ($responsive) {
        $div = $dom->createElement("div");
        $div->setAttribute('class', 'table-responsive');
        $node->parentNode->replaceChild($div, $node);
        $div->appendChild($node);
      }

      if ($add_datatable_attribute) {
        // Add datatable options to "data-wb-tables" attribute
        $node->setAttribute('data-wb-tables', $datatable_options);
      }
    }

    $result->setProcessedText(Html::serialize($dom));

    return $result;
  }

  /**
   * {@inheritdoc}
   */
  public function tips($long = FALSE) {
    return $this->t("Adds attributes to a table.");
  }

}
