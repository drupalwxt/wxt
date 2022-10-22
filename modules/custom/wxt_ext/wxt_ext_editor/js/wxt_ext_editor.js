/**
 * @file wxt_ext_editor.js
 *
 */

(function ($, CKEDITOR) {

  'use strict';

  CKEDITOR.plugins.add('wxt_ext_editor', {

    beforeInit: function (editor) {
      CKEDITOR.dtd.$removeEmpty.i = false;
      CKEDITOR.dtd.$removeEmpty.span = false;

      CKEDITOR.config.coreStyles_italic = {
        element: 'i'
      };
    },

  });

})(jQuery, CKEDITOR);
