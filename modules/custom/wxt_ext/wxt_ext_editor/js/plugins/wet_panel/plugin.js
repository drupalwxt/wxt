/**
 * WET Panel Component
 */

 (function ($, Drupal) {

'use strict';

  /**
   * Plugin
   */
  CKEDITOR.plugins.add('wet_panel', {
    requires: 'widget',
    icons: 'panel',
    hidpi: true,
    lang: 'en,fr',
    init: function (editor) {
      /**
       * Widget
       */
      editor.widgets.add('wet_panel', {
        button: editor.lang.wet_panel.title,
        template: '<section class="panel panel-primary"><header class="panel-heading"><h3 class="panel-title">' + editor.lang.wet_panel.title + '</h3></header><div class="panel-body">' + editor.lang.wet_panel.content + '</div></section>',
        editables: {
          heading: {
            selector: 'header',
          },
          content: {
            selector: 'div.panel-body'
          }
        },
        upcast: function (element) {
          return element.name == 'section' && element.hasClass('panel-primary');
        }
      });
      editor.ui.addButton('panel', {
        label: 'Add panel',
        command: 'wet_panel',
        toolbar: 'insert',
      });
    }
  });

}(jQuery, Drupal));
