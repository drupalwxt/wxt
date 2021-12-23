/**
 * WET Alert - Widget
 */

 (function ($, Drupal) {

  'use strict';

  /**
   * Plugin
   */
  CKEDITOR.plugins.add('wet_alert', {
    requires: 'widget',
    icons: 'alert',
    lang: 'en,fr',
    init: function (editor) {

      // Add panel dialog (edit form) definition
      CKEDITOR.dialog.add('wet_alert', this.path + 'dialogs/wxt_alert.js');

      /**
       * Widget
       */
      editor.widgets.add('wet_alert', {
        button: editor.lang.wet_alert.title,
        template: '<section class="alert"><h3>' + editor.lang.wet_alert.title + '</h3><p>' + editor.lang.wet_alert.content + '</p></section>',
        editables: {
          content: {
            selector: 'section.alert'
          }
        },
        dialog: 'wet_alert',
        upcast: function (element) {
          // Initialize existing alert
          return element.name == 'section' && element.hasClass('alert');
        }
      });

      // Add button for widget in toolbar
      editor.ui.addButton('alert', {
        label: 'Add alert',
        command: 'wet_alert',
        toolbar: 'insert',
      });

      // Add alert dialog (edit form) menu item to context menu
      if (editor.contextMenu) {
        editor.addMenuGroup('alertGroup');
        editor.addMenuItem('alertItem', {
          label: 'Edit Alert',
          icon: this.path + 'icons/alert.png',
          command: 'wet_alert',
          group: 'alertGroup'
        });

        // Add to context menu only when selecting (right-clicking) on an alert
        editor.contextMenu.addListener( function( element ) {
          var ascendant = element.getAscendant('section', true);

          if (ascendant && ascendant.hasClass('alert')) {
            return { alertItem: CKEDITOR.TRISTATE_OFF };
          }
        });
      }
    }
  });

}(jQuery, Drupal));
