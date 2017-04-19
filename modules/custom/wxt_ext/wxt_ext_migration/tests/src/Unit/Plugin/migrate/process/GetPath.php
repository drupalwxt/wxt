<?php

namespace Drupal\Tests\wxt_ext_migration\Unit\Plugin\migrate\process;

use Drupal\wxt_ext_migration\Plugin\migrate\process\GetPath;
use Drupal\Tests\migrate\Unit\process\MigrateProcessTestCase;

/**
 * @coversDefaultClass \Drupal\wxt_ext_migration\Plugin\migrate\process\GetPath
 * @group wxt
 */
class GetPathTest extends MigrateProcessTestCase {

  /**
   * Tests WxT path.
   *
   * @dataProvider providerTestGetPath
   */
  public function testGetPath($value, $expected) {
    $configuration['method'] = 'process';
    $actual = (new TestGetPath($configuration, 'wxt_get_path', []))->transform($value, $this->migrateExecutable, $this->row, 'testproperty');
    $this->assertSame($expected, $actual);
  }

  /**
   * Data provider for testGetPath().
   */
  public function providerTestGetPath() {
    return [
      ['218x291.png', 'profiles/wxt/modules/custom/wxt_ext/wxt_ext_migration/data/images/218x291.png'],
    ];
  }

}

class TestGetPath extends GetPath {

  /**
   * Constructor.
   */
  public function __construct($configuration) {
    $this->configuration = $configuration;
  }

  /**
   * Overrides custom function invoking drupal_get_path().
   */
  protected function getModulePath($value) {
    return 'profiles/wxt/modules/custom/wxt_ext/wxt_ext_migration/data/images/' . $value;
  }

}
