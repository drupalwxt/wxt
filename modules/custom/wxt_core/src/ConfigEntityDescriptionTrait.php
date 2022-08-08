<?php

namespace Drupal\wxt_core;

/**
 * Provides a third-party settings implementation of EntityDescriptionInterface.
 */
trait ConfigEntityDescriptionTrait {

  /**
   * Implements EntityDescriptionInterface::getDescription().
   */
  public function getDescription() {
    return $this->getThirdPartySetting('wxt_core', 'description');
  }

  /**
   * Implements EntityDescriptionInterface::getDescription().
   */
  public function setDescription($description) {
    return $this->setThirdPartySetting('wxt_core', 'description', (string) $description);
  }

}
