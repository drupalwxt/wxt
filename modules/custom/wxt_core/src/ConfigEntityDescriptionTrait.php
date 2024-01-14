<?php

namespace Drupal\wxt_core;

/**
 * Provides a third-party settings implementation of EntityDescriptionInterface.
 *
 * Leveraged from code provided by Acquia for the Lightning distribution.
 */
trait ConfigEntityDescriptionTrait {

  /**
   * Implements EntityDescriptionInterface::getDescription().
   */
  public function getDescription(): string {
    return $this->getThirdPartySetting('wxt_core', 'description');
  }

  /**
   * Implements EntityDescriptionInterface::getDescription().
   */
  public function setDescription($description) {
    return $this->setThirdPartySetting('wxt_core', 'description', (string) $description);
  }

}
