<?php

namespace Drupal\Tests\wxt\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tests WxT installation profile expectations.
 *
 * @group wxt
 */
class WxTTest extends BrowserTestBase {

  /**
   * Installation profile.
   *
   * @var string
   */
  protected $profile = 'wxt';

  /**
   * Test for the login.
   */
  public function testWxtLogin() {
    // Create a user to check the login.
    $user = $this->createUser();

    // Log in our user.
    $this->drupalLogin($user);

    // Verify that logged in user can access the logout link.
    $this->drupalGet('user');

    $this->assertLinkByHref('/user/logout');
  }

}
