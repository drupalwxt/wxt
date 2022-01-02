## Versioning

The **[Drupal WxT][wxt]** distribution is following semantic versioning.

WxT typically makes a sprint release every four to six weeks. We will also use sprint releases to package new minor releases of Drupal Core with WxT as they become available.

In addition, we will also increment the major version number of WxT about once every four to six months.

## Extensions

Support for semantic versioning for extensions (modules, themes, etc) is still ongoing.

- **[Support semantic versioning for extensions (modules, themes, etc)][semantic]**

The three parts of our versioning system are MAJOR.FEATURE.SPRINT.

Given the following tag: 9.x-2.15:

|       |                                                                   |
| ----- | ----------------------------------------------------------------- |
| **9** | Major version of Drupal Core                                      |
| **x** |                                                                   |
| **2** | Major version of WxT                                              |
| **1** | Feature release of WxT. Also increments with minor core releases. |
| **5** | Sprint release between feature releases                           |

> **Note**: Due to the constraints of drupal.org, there is no separator between the FEATURE and SPRINT digits.

<!-- Links Referenced -->

[semantic]: https://www.drupal.org/project/drupal/issues/3009338
[wxt]:      https://github.com/drupalwxt/wxt
