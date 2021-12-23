/**
 * WET Alert - Dialog
 */

CKEDITOR.dialog.add('wet_alert', function(editor) {
  return {
    title: 'Alert configuration',
    minWidth: 300,
    minHeight: 120,
    contents: [
      {
        id: 'info',
        elements: [
          {
            id: 'type',
            type: 'select',
            label: 'Alert type',
            items: [
              ['info', 'info'],
              ['success', 'success'],
              ['warning', 'warning'],
              ['danger', 'danger']
            ],
            'default': 'info',
            setup: function(element) {
              // Setup the dialog field value on existing element
              if (element.hasClass('alert-success'))
                this.setValue('success');
              else if (element.hasClass('alert-info'))
                this.setValue('info');
              else if (element.hasClass('alert-warning'))
                this.setValue('warning');
              else if (element.hasClass('alert-danger'))
                this.setValue('danger');
            },
            commit: function(element) {
              // Remove class from existing widget
              element.removeClass('alert-success');
              element.removeClass('alert-info');
              element.removeClass('alert-warning');
              element.removeClass('alert-danger');

              // Add class
              element.addClass('alert-' + this.getValue());
            }
          }
        ]
      },
    ],
    onShow: function(event) {
      // Gets the DOM element in which the selection starts.
      var element = editor.getSelection().getStartElement();

      // Determine if we add a new element or modify existing element
      if (element) {
        element = element.getAscendant('section', true);
      }

      if (!element)
        this.insertMode = true;
      else
        this.insertMode = false;

      this.element = element;

      // If editing an existing widget setup the dialog form
      if (!this.insertMode) {
        this.setupContent(this.element);
      }
    },
    onOk: function(event) {
      // On save of the dialog form, if editing an existing widget
      if (!this.insertMode) {
        // Change classes as needed
        this.commitContent(this.element);
        // Stop event to prevent new widget from being added
        event.stop();
      }
    }
  };
});
