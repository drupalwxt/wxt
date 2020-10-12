<?php

namespace Drupal\Tests\wxt\Kernel;

use Drupal\Core\Extension\Extension;
use Drupal\KernelTests\KernelTestBase;
use Drupal\wxt\ComponentDiscovery;

/**
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 *
 * @group wxt
 *
 * @coversDefaultClass \Drupal\wxt\ComponentDiscovery
 */
class ComponentDiscoveryTest extends KernelTestBase {

  /**
   * The ComponentDiscovery under test.
   *
   * @var \Drupal\wxt\ComponentDiscovery
   */
  protected $discovery;

  /**
   * {@inheritdoc}
   */
  protected function setUp() {
    parent::setUp();

    $this->discovery = new ComponentDiscovery(
      $this->container->get('app.root')
    );
  }

  /**
   * @covers ::getAll
   */
  public function testGetAll() {
    $components = $this->discovery->getAll();

    $this->assertInstanceOf(Extension::class, $components['wxt_admin']);
    $this->assertInstanceOf(Extension::class, $components['wxt_core']);
    $this->assertInstanceOf(Extension::class, $components['wxt_ext']);
  }

  /**
   * @covers ::getMainComponents
   */
  public function testGetMainComponents() {
    $components = $this->discovery->getMainComponents();

    $this->assertInstanceOf(Extension::class, $components['wxt_core']);
  }

  /**
   * @covers ::getSubComponents
   */
  public function testGetSubComponents() {
    $components = $this->discovery->getSubComponents();

    $this->assertArrayNotHasKey('wxt_core', $components);
  }

}
