<?php

namespace Drupal\Tests\wxt\Unit;

use Drupal\Core\Render\ElementInfoManagerInterface;
use Drupal\wxt\FormHelper;
use Drupal\Tests\UnitTestCase;

/**
 * @group wxt
 *
 * @coversDefaultClass \Drupal\wxt\FormHelper
 */
class FormHelperTest extends UnitTestCase {

  /**
   * Leveraged from code provided by Acquia for the Lightning distribution.
   *
   * @covers ::applyStandardProcessing
   */
  public function testApplyStandardProcessing() {
    $element_info = $this->prophesize(ElementInfoManagerInterface::class);
    $element_info->getInfo('location')->willReturn([
      '#process' => [
        'process_location',
      ],
    ]);
    $element = ['#type' => 'location'];

    $form_helper = new FormHelper($element_info->reveal());
    $form_helper->applyStandardProcessing($element);

    $this->assertEquals(['process_location'], $element['#process']);
  }

}
