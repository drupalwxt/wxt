<?php

namespace Drupal\wxt_ext_metatag\Plugin\metatag\Tag;

/**
 * Adobe Analytics attribute 'data-gc-analytics-owner'.
 *
 * @MetatagTag(
 *   id = "adobe_analytics_attribute_owner",
 *   label = @Translation("Adobe Analytics attribute <code>data-gc-analytics-owner</code>"),
 *   description = @Translation("The token for the field to use, for example: <code>[node:field_fieldname]</code>"),
 *   name = "data-gc-analytics-owner",
 *   group = "adobe_analytics",
 *   weight = 0,
 *   type = "string",
 *   secure = FALSE,
 *   multiple = FALSE
 * )
 */
class AdobeAnalyticsAttributeOwner extends AdobeAnalyticsAttributeBase {
  // Nothing here yet. Just a placeholder class for a plugin.
}
