<?php

namespace Drupal\wxt_ext_metatag\Plugin\metatag\Tag;

/**
 * Adobe Analytics attribute 'data-gc-analytics-topic'.
 *
 * @MetatagTag(
 *   id = "adobe_analytics_attribute_topic",
 *   label = @Translation("Adobe Analytics attribute <code>data-gc-analytics-topic</code>"),
 *   description = @Translation("The token for the field to use, for example: <code>[node:field_fieldname]</code>"),
 *   name = "data-gc-analytics-topic",
 *   group = "adobe_analytics",
 *   weight = 0,
 *   type = "string",
 *   secure = FALSE,
 *   multiple = FALSE
 * )
 */
class AdobeAnalyticsAttributeTopic extends AdobeAnalyticsAttributeBase {
  // Nothing here yet. Just a placeholder class for a plugin.
}
