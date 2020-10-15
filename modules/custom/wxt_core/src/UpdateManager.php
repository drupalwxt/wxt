<?php

namespace Drupal\wxt_core;

use Drupal\Component\Plugin\Discovery\DiscoveryInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ClassResolverInterface;
use Drupal\Core\Extension\ModuleExtensionList;
use Drupal\Core\Plugin\Discovery\AnnotatedClassDiscovery;
use Drupal\wxt_core\Annotation\UpdateWxT;
use phpDocumentor\Reflection\DocBlockFactory;
use phpDocumentor\Reflection\DocBlockFactoryInterface;
use Symfony\Component\Console\Style\StyleInterface;

/**
 * Discovers and manages optional configuration updates.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
class UpdateManager {

  /**
   * Name of the config object which stores version numbers.
   *
   * @var string
   */
  const CONFIG_NAME = 'wxt.versions';

  /**
   * Fallback version number used when a module does not declare it.
   *
   * @var string
   */
  const VERSION_UNKNOWN = '0.0.0';

  /**
   * The update discovery object.
   *
   * @var \Drupal\Component\Plugin\Discovery\DiscoveryInterface
   */
  protected $discovery;

  /**
   * The class resolver service.
   *
   * @var \Drupal\Core\DependencyInjection\ClassResolverInterface
   */
  protected $classResolver;

  /**
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The module extension list.
   *
   * @var \Drupal\Core\Extension\ModuleExtensionList
   */
  protected $moduleExtensionList;

  /**
   * The doc block factory.
   *
   * @var \phpDocumentor\Reflection\DocBlockFactoryInterface
   */
  protected $docBlockFactory;

  /**
   * UpdateCommand constructor.
   *
   * @param \Traversable $namespaces
   *   The namespaces to scan for updates.
   * @param \Drupal\Core\DependencyInjection\ClassResolverInterface $class_resolver
   *   The class resolver service.
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\Core\Extension\ModuleExtensionList $module_extension_list
   *   The module extension list.
   * @param \Drupal\Component\Plugin\Discovery\DiscoveryInterface $discovery
   *   (optional) The update discovery handler.
   * @param \phpDocumentor\Reflection\DocBlockFactoryInterface $doc_block_factory
   *   (optional) The doc block factory.
   */
  public function __construct(\Traversable $namespaces, ClassResolverInterface $class_resolver, ConfigFactoryInterface $config_factory, ModuleExtensionList $module_extension_list, DiscoveryInterface $discovery = NULL, DocBlockFactoryInterface $doc_block_factory = NULL) {
    $this->classResolver = $class_resolver;
    $this->configFactory = $config_factory;
    $this->moduleExtensionList = $module_extension_list;
    $this->discovery = $discovery ?: new AnnotatedClassDiscovery('UpdateWxT', $namespaces, UpdateWxT::class);
    $this->docBlockFactory = $doc_block_factory ?: DocBlockFactory::createInstance();
  }

  /**
   * Tries to determine the semantic version of a module.
   *
   * @param string $module
   *   The machine name of the module.
   *
   * @return string
   *   The semantic version of the module, or static::VERSION_UNKNOWN if it
   *   could not be determined.
   */
  public function getVersion($module) {
    $info = $this->moduleExtensionList->getAllAvailableInfo();

    if (isset($info[$module]['version'])) {
      return static::toSemanticVersion($info[$module]['version']);
    }
    else {
      // Follow core's model and try to determine the target version of the
      // most recent update.
      $updates = $this->getDefinitions($module);

      return $updates ? end($updates)['id'] : static::VERSION_UNKNOWN;
    }
  }

  /**
   * Converts a drupal.org version number to a semantic version.
   *
   * @param string $version
   *   The drupal.org version number, e.g. 8.x-1.12.
   *
   * @return string
   *   The version number in semantic version format.
   */
  public static function toSemanticVersion($version) {
    // Strip the 8.x prefix from the version.
    $semantic_version = preg_replace('/^' . \Drupal::CORE_COMPATIBILITY . '-/', NULL, $version);

    if (preg_match('/-dev$/', $semantic_version)) {
      return preg_replace('/^(\d).+-dev$/', '$1.x-dev', $semantic_version);
    }
    else {
      return preg_replace('/^(\d+\.\d+)(-.+)?$/', '$1.0$2', $semantic_version);
    }
  }

  /**
   * Returns all update definitions, optionally filtered by provider module.
   *
   * @param string $module
   *   (optional) The machine name of the module by which to filter updates.
   *
   * @return array[]
   *   The discovered update definitions.
   */
  public function getDefinitions($module = NULL) {
    $definitions = $this->discovery->getDefinitions();
    ksort($definitions);

    if ($module) {
      $filter = function (array $definition) use ($module) {
        return $definition['provider'] === $module;
      };
      $definitions = array_filter($definitions, $filter);
    }
    return $definitions;
  }

  /**
   * Returns all available update definitions.
   *
   * @return array[]
   *   The available update definitions.
   */
  public function getAvailable() {
    $versions = $this->configFactory->getEditable(static::CONFIG_NAME);

    $filter = function (array $definition) use ($versions) {
      $provider_version = $versions->get($definition['provider']) ?: static::VERSION_UNKNOWN;

      return version_compare($definition['id'], $provider_version, '>');
    };

    return array_filter($this->getDefinitions(), $filter);
  }

  /**
   * Returns all available tasks for a specific update.
   *
   * @param object $handler
   *   The task handler.
   *
   * @return \Generator
   *   An iterable of UpdateTask objects.
   */
  protected function getTasks($handler) {
    $methods = (new \ReflectionObject($handler))->getMethods(\ReflectionMethod::IS_PUBLIC);

    foreach ($methods as $method) {
      $doc_comment = trim($method->getDocComment());

      if ($doc_comment) {
        $doc_block = $this->docBlockFactory->create($doc_comment);

        if ($doc_block->hasTag('updatewxt')) {
          yield new UpdateTask($handler, $method, $doc_block);
        }
      }
    }
  }

  /**
   * Executes all available updates in a console context.
   *
   * @param \Symfony\Component\Console\Style\StyleInterface $style
   *   The I/O style.
   */
  public function executeAllInConsole(StyleInterface $style) {
    $updates = $this->getAvailable();

    if (count($updates) === 0) {
      return $style->text('There are no updates available.');
    }
    $style->text("Executing all available updates...");

    $provider = NULL;
    $versions = $this->configFactory->getEditable(static::CONFIG_NAME);

    foreach ($updates as $update) {
      if ($update['provider'] != $provider) {
        $provider = $update['provider'];
        $style->text($provider . ' ' . $update['id']);
      }

      $handler = $this->classResolver
        ->getInstanceFromDefinition($update['class']);

      /** @var \Drupal\wxt_core\UpdateTask $task */
      foreach ($this->getTasks($handler) as $task) {
        $task->execute($style);
      }

      $versions->set($provider, $update['id'])->save();
    }
  }

}
