/**
 * WET Panel - Widget
 */

 (function ($, Drupal) {

  'use strict';

  /**
   * Plugin
   */
  CKEDITOR.plugins.add('wet_panel', {
    requires: 'widget',
    icons: 'panel',
    lang: 'en,fr',
    init: function (editor) {

      // Add panel dialog (edit form) definition
      CKEDITOR.dialog.add('wet_panel', this.path + 'dialogs/wxt_panel.js');

      /**
       * Widget
       */
      editor.widgets.add('wet_panel', {
        button: editor.lang.wet_panel.title,
        template: '<section class="panel"><header class="panel-heading"><h3 class="panel-title">' + editor.lang.wet_panel.title + '</h3></header><div class="panel-body">' + editor.lang.wet_panel.content + '</div></section>',
        editables: {
          heading: {
            selector: 'header'
          },
          content: {
            selector: 'div.panel-body'
          }
        },
        dialog: 'wet_panel',
        upcast: function (element) {
          // Initialize existing panels
          return element.name == 'section' && element.hasClass('panel');
        }
      });

      // Add button for widget in toolbar
      editor.ui.addButton('panel', {
        label: 'Add panel',
        command: 'wet_panel',
        toolbar: 'insert',
      });

      // Add panel dialog (edit form) menu item to context menu
      if (editor.contextMenu) {
        editor.addMenuGroup('panelGroup');
        editor.addMenuItem('panelItem', {
          label: 'Edit Panel',
          icon: this.path + 'icons/panel.png',
          command: 'wet_panel',
          group: 'panelGroup'
        });

        // Add to context menu only when selecting (right-clicking) on a panel
        editor.contextMenu.addListener( function( element ) {
          var ascendant = element.getAscendant('section', true);

          if (ascendant && ascendant.hasClass('panel')) {
            return { panelItem: CKEDITOR.TRISTATE_OFF };
          }
        });
      }
    }
  });

}(jQuery, Drupal));
