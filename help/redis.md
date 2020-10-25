## Redis

To properly configure Redis with Drupal you should ensure the following configuration is added to your `settings.php` file.

> Note: Some customizations might be necessary depending on your individual requirements.

```php
if (extension_loaded('redis')) {
  // Set Redis as the default backend for any cache bin not otherwise specified.
  $settings['cache']['default'] = 'cache.backend.redis';
  $settings['redis.connection']['interface'] = 'PhpRedis';
  $settings['redis.connection']['scheme'] = 'http';
  $settings['redis.connection']['host'] = 'localhost';
  $settings['redis.connection']['port'] = '6379';
  //$settings['redis.connection']['password'] = '';

  // Allow the services to work before the Redis module itself is enabled.
  $settings['container_yamls'][] = 'modules/contrib/redis/example.services.yml';
  $settings['container_yamls'][] = 'modules/contrib/redis/redis.services.yml';

  // Manually add the classloader path, this is required for the container cache bin definition below
  // and allows to use it without the redis module being enabled.
  $class_loader->addPsr4('Drupal\\redis\\', 'modules/contrib/redis/src');

  $settings['bootstrap_container_definition'] = [
    'parameters' => [],
    'services' => [
      'redis.factory' => [
        'class' => 'Drupal\redis\ClientFactory',
      ],
      'cache.backend.redis' => [
        'class' => 'Drupal\redis\Cache\CacheBackendFactory',
        'arguments' => ['@redis.factory', '@cache_tags_provider.container', '@serialization.phpserialize'],
      ],
      'cache.container' => [
        'class' => '\Drupal\redis\Cache\PhpRedis',
        'factory' => ['@cache.backend.redis', 'get'],
        'arguments' => ['container'],
      ],
      'cache_tags_provider.container' => [
        'class' => 'Drupal\redis\Cache\RedisCacheTagsChecksum',
        'arguments' => ['@redis.factory'],
      ],
      'serialization.phpserialize' => [
        'class' => 'Drupal\Component\Serialization\PhpSerialize',
      ],
    ],
  ];

  /** Optional prefix for cache entries */
  $settings['cache_prefix'] = 'drupal_';

  // Always set the fast backend for bootstrap, discover and config, otherwise
  // this gets lost when redis is enabled.
  $settings['cache']['bins']['bootstrap'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['discovery'] = 'cache.backend.chainedfast';
  $settings['cache']['bins']['config'] = 'cache.backend.chainedfast';

  // Use for all bins otherwise specified.
  $settings['cache']['default'] = 'cache.backend.redis';

  // Use for all queues unless otherwise specified for a specific queue.
  $settings['queue_default'] = 'queue.redis';

  // Or if you want to use reliable queue implementation.
  // $settings['queue_default'] = 'queue.redis_reliable';

  // Use this to only use Redis for a specific queue.
  // $settings['queue_service_aggregator_feeds'] = 'queue.redis';

  // Use this to use reliable queue implementation.
  // $settings['queue_service_aggregator_feeds'] = 'queue.redis_reliable';
}
```
