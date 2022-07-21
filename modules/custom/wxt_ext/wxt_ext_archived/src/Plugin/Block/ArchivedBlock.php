<?php

namespace Drupal\wxt_ext_archived\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides the archived block.
 *
 * @Block(
 *   id = "wxt_archived_block",
 *   admin_label = @Translation("Archived block"),
 *   category = @Translation("WxT")
 * )
 */
class ArchivedBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'archived_text' => 'Information identified as archived is provided for reference, research or recordkeeping purposes. It is not subject to the Government of Canada Web Standards and has not been altered or updated since it was archived. Please contact us to request a format other than those available.',
      'archived_title' => 'This page has been archived on the Web',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    $form['archived_title'] = [
      '#title' => $this->t('Archived title'),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#description' => $this->t('Enter a title to appear in the archived block.'),
      '#default_value' => $config['archived_title'] ?? '',
    ];

    $form['archived_text'] = [
      '#title' => $this->t('Archived text'),
      '#type' => 'textarea',
      '#required' => TRUE,
      '#description' => $this->t('Enter text to appear in the archived block.'),
      '#default_value' => $config['archived_text'] ?? '',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['archived_text'] = $values['archived_text'];
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $config = $this->getConfiguration();

    $output = '<section class="alert alert-warning wb-inview" data-inview="archived-bnr" id="archived">
                <h2>' . $config['archived_title'] . '</h2>
                <p>' . $config['archived_text'] . '</p>
              </section>
              <section class="wb-overlay modal-content overlay-def wb-bar-t" id="archived-bnr">
                <header>
                  <h2 class="wb-inv">' . $this->t('Archived') . '</h2>
                </header>
                <p><a href="#archived">' . $config['archived_title'] . '</a></p>
              </section>';

    return [
      '#markup' => $output,
    ];
  }

}
