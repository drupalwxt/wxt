<?php

namespace Drupal\wxt_ext_media\Plugin\EntityBrowser\Widget;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\PrependCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\entity_browser\WidgetBase;
use Drupal\inline_entity_form\ElementSubmit;
use Drupal\wxt_ext_media\InputMatchInterface;
use Drupal\media\MediaTypeInterface;

/**
 * Base class for EB widgets which wrap around an (inline) entity form.
 */
abstract class EntityFormProxy extends WidgetBase {

  /**
   * {@inheritdoc}
   */
  public function getForm(array &$original_form, FormStateInterface $form_state, array $additional_widget_parameters) {
    $form = parent::getForm($original_form, $form_state, $additional_widget_parameters);

    if (isset($form['actions'])) {
      $form['actions']['#weight'] = 100;

      // Allow the form to be rebuilt without using AJAX interactions. This
      // means we can do a lot of testing without JavaScript, which is WAY
      // easier.
      $form['actions']['update'] = [
        '#type' => 'submit',
        '#value' => $this->t('Update'),
        '#attributes' => [
          'class' => ['js-hide'],
        ],
        '#submit' => [
          [static::class, 'update'],
        ],
      ];
    }

    $form['#type'] = 'container';
    $form['#attributes']['id'] = 'entity-form';

    $form['bundle'] = [
      '#type' => 'select',
      '#title' => $this->t('Bundle'),
      '#required' => TRUE,
      '#options' => [],
      '#ajax' => [
        'callback' => [static::class, 'ajax'],
      ],
      '#access' => (bool) $this->getCurrentValue($form_state),
      '#weight' => 80,
    ];
    foreach ($this->getCurrentTypes($form_state) as $id => $type) {
      $form['bundle']['#options'][$id] = $type->label();
    }

    $entity = $this->getCurrentEntity($form_state);
    if ($entity) {
      $form['entity'] = [
        '#type' => 'inline_entity_form',
        '#entity_type' => 'media',
        '#default_value' => $entity,
        '#form_mode' => $this->configuration['form_mode'],
        '#weight' => 90,
      ];
      $form['bundle']['#access'] = FALSE;
      $form['entity']['#bundle'] = $form['entity']['#default_value']->bundle();

      // Without this, IEF won't know where to hook into the widget. Don't pass
      // $original_form as the second argument to addCallback(), because it's
      // not just the entity browser part of the form, not the actual complete
      // form.
      ElementSubmit::addCallback($form['actions']['submit'], $form_state->getCompleteForm());
    }

    return $form;
  }

  /**
   * Returns a media entity created from the current input, if possible.
   *
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return \Drupal\media\MediaInterface
   *   A media entity created from the current input value, if there is one, or
   *   NULL if no media entity can be created.
   */
  protected function getCurrentEntity(FormStateInterface $form_state) {
    $value = $this->getCurrentValue($form_state);
    $types = $this->getCurrentTypes($form_state);

    $type = $form_state->getValue('bundle');

    if (empty($type) && count($types) === 1) {
      $type = reset($types)->id();
    }

    if ($value && $type) {
      return $this->createMedia($value, $types[$type]);
    }
    return NULL;
  }

  /**
   * Returns all media types that can apply to the current input.
   *
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return \Drupal\media\MediaTypeInterface[]
   *   The media types that can apply to the current input, if any.
   */
  protected function getCurrentTypes(FormStateInterface $form_state) {
    $value = $this->getCurrentValue($form_state);
    return $value ? $this->getTypesByValue($value) : $this->getAllowedTypes();
  }

  /**
   * {@inheritdoc}
   */
  protected function prepareEntities(array $form, FormStateInterface $form_state) {
    $entity_form = &$form['widget']['entity_form']['entity'];
    if (isset($entity_form['#entity'])) {
      return [
        $entity_form['#entity'],
      ];
    }
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function validate(array &$form, FormStateInterface $form_state) {
    parent::validate($form, $form_state);

    $value = $this->getCurrentValue($form_state);

    $types = $this->getTypesByValue($value);
    if (empty($types)) {
      $error = sprintf(
        'Input did not match any media types: %s',
        $value instanceof EntityInterface ? $value->label() : var_export($value, TRUE)
      );
      $form_state->setError($form['widget']['input'], $error);
    }
  }

  /**
   * Submit callback for the Update button.
   *
   * @param array $form
   *   The complete form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   */
  public static function update(array &$form, FormStateInterface $form_state) {
    $form_state->setRebuild();
  }

  /**
   * {@inheritdoc}
   */
  public function submit(array &$element, array &$form, FormStateInterface $form_state) {
    // IEF will take care of creating the entity upon submission. All we need to
    // do is send it upstream to Entity Browser.
    $entity = $form['widget']['entity']['#entity'];
    $this->selectEntities([$entity], $form_state);
  }

  /**
   * AJAX callback. Returns the rebuilt inline entity form.
   *
   * @param array $form
   *   The complete form.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return \Drupal\Core\Ajax\AjaxResponse
   *   The AJAX response.
   */
  public static function ajax(array &$form, FormStateInterface $form_state) {
    if ($form_state::hasAnyErrors()) {
      $form['widget']['bundle']['#access'] = FALSE;
    }

    return (new AjaxResponse())
      ->addCommand(
        new ReplaceCommand('#entity-form', $form['widget'])
      )
      ->addCommand(
        new PrependCommand('#entity-form', ['#type' => 'status_messages'])
      );
  }

  /**
   * Returns the current input value, if any.
   *
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   *
   * @return mixed
   *   The input value, ready for further processing. Nothing will be done with
   *   the value if it's empty.
   */
  protected function getCurrentValue(FormStateInterface $form_state) {
    return $form_state->getValue('input');
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    $configuration = parent::defaultConfiguration();

    // Allow all media types by default.
    $configuration['target_bundles'] = [];

    // Use a custom form mode so site builders have flexibility.
    $configuration['form_mode'] = 'media_browser';

    return $configuration;
  }

  /**
   * Returns the media types which can be used by this widget.
   *
   * @return \Drupal\media\MediaTypeInterface[]
   *   The media types which can be used by this widget.
   */
  protected function getAllowedTypes() {
    $types = $this->entityTypeManager
      ->getStorage('media_type')
      ->loadMultiple($this->configuration['target_bundles'] ?: NULL);

    return array_filter($types, [$this, 'isAllowedType']);
  }

  /**
   * Tests if a media type can be used by this widget.
   *
   * @param \Drupal\media\MediaTypeInterface $media_type
   *   The media type.
   *
   * @return bool
   *   TRUE if the media type can be used, FALSE otherwise.
   */
  protected function isAllowedType(MediaTypeInterface $media_type) {
    return $this->entityTypeManager
      ->getAccessControlHandler('media')
      ->createAccess($media_type->id());
  }

  /**
   * Creates a new, unsaved media entity from a source field value.
   *
   * @param mixed $value
   *   The source field value.
   * @param \Drupal\media\MediaTypeInterface $type
   *   The media type.
   *
   * @return \Drupal\media\MediaInterface
   *   The unsaved media entity.
   */
  protected function createMedia($value, MediaTypeInterface $type) {
    $values = [
      'bundle' => $type->id(),
    ];

    $field = $type->getSource()->getSourceFieldDefinition($type)->getName();
    $values[$field] = $value;

    return $this->entityTypeManager->getStorage('media')->create($values);
  }

  /**
   * Returns media types which can accept a given value in their source field.
   *
   * @param mixed $value
   *   The input value.
   *
   * @return \Drupal\media\MediaTypeInterface[]
   *   The media types which can use the given value in their source field.
   */
  protected function getTypesByValue($value) {
    $filter = function (MediaTypeInterface $media_type) use ($value) {
      $source = $media_type->getSource();
      return $source instanceof InputMatchInterface && $source->appliesTo($value, $media_type);
    };

    return array_filter($this->getAllowedTypes(), $filter);
  }

  /**
   * {@inheritdoc}
   */
  public function access() {
    $allowed_types = $this->getAllowedTypes();
    return $allowed_types ? AccessResult::allowed() : AccessResult::forbidden();
  }

}
