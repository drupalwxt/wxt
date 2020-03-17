<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\process;

use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\migrate\MigrateException;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\MigrateSkipProcessException;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Drupal\Component\Serialization\Json;
use Drupal\media\Entity\Media;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Convert a Drupal 7 media tag to a rendered image field.
 *
 * @MigrateProcessPlugin(
 *   id = "wxt_media_tags",
 * )
 *
 * @link https://blog.kalamuna.com/news/converting-drupal-7-media-tags-during-a-drupal-8-migration
 */
class MediaTags extends ProcessPluginBase implements ContainerFactoryPluginInterface {

  /**
   * The migration process plugin, configured for lookups in wxt_ext_file.
   *
   * @var \Drupal\migrate\Plugin\MigrateProcessInterface
   */
  protected $migrationPlugin;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, array $plugin_definition, MigrateProcessInterface $migration_plugin) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->migrationPlugin = $migration_plugin;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration = NULL) {
    // Default required migration configuration.
    $migration_configuration = [
      'migration' => [
        'wxt_ext_db_file',
      ],
    ];

    // Handle any custom migrations leveraging this plugin.
    $migration_dependencies = $migration->getMigrationDependencies();
    if (isset($migration_dependencies['required'])) {
      foreach ($migration_dependencies['required'] as $dependency) {
        if (strpos($dependency, 'file') !== FALSE) {
          $migration_configuration['migration'][] = $dependency;
        }
      }
    }

    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('plugin.manager.migrate.process')->createInstance('migration', $migration_configuration, $migration)
    );
  }

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    if (!$value) {
      throw new MigrateSkipProcessException();
    }
    $value = ' ' . $value . ' ';
    $value = preg_replace_callback(
      '/\[\[.*?\]\]/s',
      function ($match) use ($migrate_executable, $row, $destination_property) {
        return $this->replaceToken($match, $migrate_executable, $row, $destination_property);
      },
      $value
    );

    return $value;
  }

  /**
   * Replace callback to convert a media file tag into HTML markup.
   *
   * Partially copied from 7.x media module media.filter.inc (media_filter).
   *
   * @param string $match
   *   Takes a match of tag code
   * @param \Drupal\migrate\MigrateExecutableInterface $migrate_executable
   *   The migrate executable helper class.
   * @param \Drupal\migrate\Row $row
   *   The current row after processing.
   * @param string $destination_property
   *   The destination propery.
   */
  private function replaceToken($match, $migrate_executable, $row, $destination_property) {
    $settings = [];
    $match = str_replace("[[", "", $match);
    $match = str_replace("]]", "", $match);
    $tag = $match[0];
    $classes = '';

    try {
      if (!is_string($tag)) {
        throw new MigrateException('Unable to find matching tag');
      }

      // Make it into a fancy array.
      $tag_info = Json::decode($tag);
      if (!isset($tag_info['fid'])) {
        throw new MigrateException('No file Id');
      }

      // Lookup the correct fid.
      $fid = $this->migrationPlugin
        ->transform($tag_info['fid'], $migrate_executable, $row, $destination_property);

      // Load the file.
      $media = Media::load($fid);
      if (!$media) {
        throw new MigrateException('Could not load media object');
      }

      // The class attributes is a string, but drupal requires it to be an
      // array, so we fix it here.
      if (!empty($tag_info['attributes']['class'])) {
        $classes = $tag_info['attributes']['class'];
        $tag_info['attributes']['class'] = explode(" ", $tag_info['attributes']['class']);
      }

      $settings['attributes'] = is_array($tag_info['attributes']) ? $tag_info['attributes'] : [];

      // Many media formatters will want to apply width and height independently
      // of the style attribute or the corresponding HTML attributes, so pull
      // these two out into top-level settings. Different WYSIWYG editors have
      // different behavior with respect to whether they store user-specified
      // dimensions in the HTML attributes or the style attribute so check both.
      // Per http://www.w3.org/TR/html5/the-map-element.html#attr-dim-width, the
      // HTML attributes are merely hints: CSS takes precedence.
      if (isset($settings['attributes']['style'])) {
        $css_properties = $this->mediaParseCssDeclarations($settings['attributes']['style']);
        foreach (['width', 'height'] as $dimension) {
          if (isset($css_properties[$dimension]) && substr($css_properties[$dimension], -2) == 'px') {
            $settings[$dimension] = substr($css_properties[$dimension], 0, -2);
          }
          elseif (isset($settings['attributes'][$dimension])) {
            $settings[$dimension] = $settings['attributes'][$dimension];
          }
        }
      }
    }
    catch (Exception $e) {
      $msg = t('Unable to render media from %tag. Error: %error', ['%tag' => $tag, '%error' => $e->getMessage()]);
      \Drupal::logger('Migration')->error($msg);
      return '';
    }

    $alt = isset($settings['alt']) ? $settings['alt'] : '';
    $uuid = $media->uuid();
    $title = $media->get('name')->value;
    $class = isset($classes) ? 'class="' . $classes . '"' : '';

    // New media entity format.
    $output = '
      <drupal-entity
        alt="' . $alt . '"
        data-embed-button="media_browser"
        data-entity-embed-display="media_image"
        data-entity-embed-display-settings="{&quot;image_style&quot;:&quot;&quot;,&quot;image_link&quot;:&quot;&quot;}"
        data-entity-type="media"
        data-entity-uuid="' . $uuid . '"
        title="' . $title . '" ' . $class . '>
      </drupal-entity>
    ';

    return $output;
  }

  /**
   * Copied from 7.x media @ media.filter.inc (media_parse_css_declarations).
   *
   * Parses the contents of a CSS declaration block and returns a keyed array
   * of property names and values.
   *
   * @param $declarations
   *   One or more CSS declarations delimited by a semicolon. The same as a CSS
   *   declaration block (http://www.w3.org/TR/CSS21/syndata.html#rule-sets),
   *   but without the opening and closing curly braces. Also the same as the
   *   value of an inline HTML style attribute.
   *
   * @return
   *   A keyed array. The keys are CSS property names, and the values are CSS
   *   property values.
   */
  private function mediaParseCssDeclarations($declarations) {
    $properties = [];
    foreach (array_map('trim', explode(";", $declarations)) as $declaration) {
      if ($declaration != '') {
        list($name, $value) = array_map('trim', explode(':', $declaration, 2));
        $properties[strtolower($name)] = $value;
      }
    }
    return $properties;
  }

}
