<?php

namespace Drupal\wxt\Installer\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\wxt\Installer\ExtensionManager;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Extension Configure Form.
 *
 * Provides the extension configuration form.
 */
class ExtensionConfigureForm extends ConfigFormBase {

  /**
   * The module extension list.
   *
   * @var \Drupal\wxt\Installer\ExtensionManager
   */
  protected $extensionManager;

  /**
   * Constructs a ExtensionConfigureForm object.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The factory for configuration objects.
   * @param \Drupal\wxt\Installer\ExtensionManager $extension_manager
   *   The module extension list.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ExtensionManager $extension_manager) {
    parent::__construct($config_factory);
    $this->extensionManager = $extension_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      ExtensionManager::create($container)
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wxt_extension_configure_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#title'] = $this->t('Install extensions');

    $form['install_all'] = [
      '#type' => 'container',
    ];

    $form['install_all']['title'] = [
      '#type' => 'item',
      '#markup' => '<h3>' . $this->t('Install WxT extensions') . '</h3>',
    ];

    $form['install_all']['description'] = [
      '#type' => 'item',
      '#markup' => $this->t('Select this option to enable all WxT extensions.'),
    ];

    $form['install_all']['select_all'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable all WxT extensions'),
      '#default_value' => FALSE,
    ];

    $form['install_extensions'] = [
      '#type' => 'container',
      '#states' => array(
        'invisible' => array(
          'input[name="select_all"]' => array(
            'checked' => TRUE,
          ),
        ),
      ),
    ];

    $optional_features = $this->extensionManager->getExtensions();
    $feature_options = array_map(
      static function ($info) {
        return $info['name'];
      },
      $optional_features
    );
    $default_features = array_keys(
      array_filter(
        $optional_features,
        static function ($info) {
          return $info['default'];
        }
      )
    );

    $form['install_extensions']['extensions'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Enable individual extensions'),
      '#options' => $feature_options,
      '#default_value' => $default_features,
    ];

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['save'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save and continue'),
      '#button_type' => 'primary',
      '#submit' => ['::submitForm'],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    if ($form_state->getValue('select_all')) {
      $extensions = array_keys($this->extensionManager->getExtensions());
    }
    else {
      $selected_extensions = array_filter($form_state->getValue('extensions'));
      $extensions = array_values($selected_extensions);
    }
    $install_extensions = array_merge(
      \Drupal::state()->get('wxt_install_extensions', []),
      $extensions
    );
    \Drupal::state()->set('wxt_install_extensions', $install_extensions);
  }

}
