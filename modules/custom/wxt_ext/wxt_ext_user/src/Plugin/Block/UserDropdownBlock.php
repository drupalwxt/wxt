<?php

namespace Drupal\wxt_ext_user\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Form\FormBuilder;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides the "User Dropdown" block.
 *
 * @Block(
 *   id = "user_dropdown",
 *   admin_label = @Translation("User Dropdown"),
 *   category = @Translation("Menus")
 * )
 */
class UserDropdownBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * The form builder.
   *
   * @var \Drupal\Core\Form\FormBuilder
   */
  protected $formBuilder;

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $user;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, FormBuilder $form_builder, AccountProxyInterface $user) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->formBuilder = $form_builder;
    $this->user = $user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('form_builder'),
      $container->get('current_user')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $block = [];
    $links_cache_contexts = [];

    // Display different links to depending on whether the user is logged in.
    if ($this->user->isAnonymous()) {
      // Create a 'person' icon that toggles a login form.
      $markup = '';
      $markup .= '<a class="login-dropdown-button standard-icon meta-icon-size left" data-toggle="user-login-wrapper" aria-controls="user-login-wrapper" aria-expanded="false">';
      $markup .= '<i class="icon ion-person"></i>';
      $markup .= '</a>';

      $block['login'] = [
        '#markup' => $markup,
      ];

      // Wrap the login form with some required foundation classes/attributes.
      $login_wrapper = [
        '#type' => 'container',
        '#attributes' => [
          'class' => ['dropdown-pane', 'display-none'],
          'id' => 'user-login-wrapper',
          'data-dropdown' => '',
          'aria-hidden' => 'true',
          'aria-autoclose' => 'true',
          'data-auto-focus' => 'true',
          'tabindex' => '-1',
        ],
      ];

      // Get the user login form.
      $form = $this->formBuilder->getForm('\Drupal\user\Form\UserLoginForm');

      // Remove default form descriptions.
      unset($form['name']['#description']);
      unset($form['name']['#attributes']['aria-describedby']);
      unset($form['pass']['#description']);
      unset($form['pass']['#attributes']['aria-describedby']);

      $login_wrapper['form'] = $form;

      $block['wrapper'] = $login_wrapper;
    }
    else {
      $username = $this->user->getDisplayName();
      $user_page_url = Url::fromRoute('user.page')->toString();
      $user_logout_url = Url::fromRoute('user.logout')->toString();

      // Create a 'person' icon that toggles user profile and log out links.
      $markup = '';
      $markup .= '<a class="login-dropdown-button standard-icon meta-icon-size left" data-toggle="user-logout-wrapper" aria-controls="user-logout-wrapper" aria-expanded="false">';
      $markup .= '<i class="icon ion-person"></i>';
      $markup .= '<span> ' . $username . '</span>';
      $markup .= '</a>';

      $markup .= '<div id="user-logout-wrapper" class="dropdown-pane f-dropdown" data-dropdown aria-hidden="true" aria-autoclose="false" data-auto-focus="false">';
      $markup .= '<div class="user-links">';
      $markup .= '<a class="" href="' . $user_page_url . '"><i class="icon ion-person"></i> ' . $username . '</a>';
      $markup .= '<a class="logout-button" href="' . $user_logout_url . '"><i class="icon ion-log-out"></i> ' . $this->t('Log Out') . '</a>';
      $markup .= '</div>';
      $markup .= '</div>';

      $block['login'] = [
        '#markup' => $markup,
      ];

      // The "Edit user account" link is per-user.
      $links_cache_contexts[] = 'user';
    }

    // Cacheable per "authenticated or not", because the links to
    // display depend on that.
    $block['#cache']['contexts'] = Cache::mergeContexts(['user.roles:authenticated'], $links_cache_contexts);

    return $block;
  }

}
