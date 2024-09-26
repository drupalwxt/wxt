<?php

namespace Drupal\wxt_ext_media\Element;

use Drupal\Core\File\Event\FileUploadSanitizeNameEvent;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Element\File as FileElement;
use Drupal\file\Entity\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * A form element to handle file uploads.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 *
 * @FormElement("upload")
 */
class Upload extends FileElement {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    $info = parent::getInfo();

    $info['#required'] = FALSE;
    $info['#upload_location'] = 'public://';
    $info['#upload_validators'] = [];
    $info['#element_validate'] = [
      [static::class, 'validate'],
    ];

    return $info;
  }

  /**
   * Validates the uploaded file.
   *
   * @param array $element
   *   The element.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The current form state.
   */
  public static function validate(array &$element, FormStateInterface $form_state) {
    if ($element['#value']) {
      $file = File::load($element['#value']);

      $file_validator = \Drupal::service('file.validator');
      $errors = $file_validator->file_validate($file, $element['#upload_validators']);
      if ($errors) {
        foreach ($errors as $error) {
          $form_state->setError($element, $error);
        }
        static::delete($element);
      }
    }
    elseif ($element['#required']) {
      $form_state->setError($element, t('You must upload a file.'));
    }
  }

  /**
   * Deletes the file referenced by the element.
   *
   * @param array $element
   *   The element. If set, its value should be a file entity ID.
   */
  public static function delete(array $element) {
    if ($element['#value']) {
      $file = File::load($element['#value']);
      $file->delete();

      // Clean up the file system if needed.
      $uri = $file->getFileUri();
      if (file_exists($uri)) {
        \Drupal::service('file_system')->unlink($uri);
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function processFile(&$element, FormStateInterface $form_state, &$complete_form) {
    $element['#name'] = implode('_', $element['#parents']);
    $form_state->setHasFileElement();
    return parent::processFile($element, $form_state, $complete_form);
  }

  /**
   * {@inheritdoc}
   */
  public static function valueCallback(&$element, $input, FormStateInterface $form_state) {
    /** @var \Drupal\Core\File\FileSystemInterface $file_system */
    $file_system = \Drupal::service('file_system');

    $id = implode('_', $element['#parents']);

    $upload = \Drupal::request()->files->get($id);

    if ($upload instanceof UploadedFile) {
      $destination = $file_system->realPath($element['#upload_location']);

      $event = new FileUploadSanitizeNameEvent($upload->getClientOriginalName(), '');
      /** @var \Drupal\Component\EventDispatcher\ContainerAwareEventDispatcher $event_dispatcher */
      // phpcs:ignore
      $event_dispatcher = \Drupal::service('event_dispatcher');
      $event_dispatcher->dispatch($event);

      $name = $event->getFilename();
      // Support both Drupal 8.7's FileSystemInterface API, and its earlier
      // antecedents. We need to call file_create_filename() in an obscure way
      // to prevent deprecation testing failures.
      $name = version_compare(\Drupal::VERSION, '8.7.0', '>=')
        ? $file_system->createFilename($name, $destination)
        : call_user_func('file_create_filename', $name, $destination);
      $name = $upload->move($destination, $name)->getFilename();

      $uri = $element['#upload_location'];
      if (substr($uri, -1) != '/') {
        $uri .= '/';
      }
      $uri .= $name;

      $file = File::create([
        'uri' => $uri,
        'uid' => \Drupal::currentUser()->id(),
      ]);
      $file->setTemporary();
      $file->save();
      \Drupal::request()->files->remove($id);

      return $file->id();
    }
    else {
      return NULL;
    }
  }

}
