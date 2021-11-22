/**
 * WET Panel - Dialog
 */

CKEDITOR.dialog.add('wet_panel', function(editor) {
  return {
    title: 'Panel configuration',
    minWidth: 300,
    minHeight: 120,
    contents: [
      {
        id: 'info',
        elements: [
          {
            id: 'type',
            type: 'select',
            label: 'Panel type',
            items: [
              ['primary', 'primary'],
              ['default', 'default'],
              ['default well', 'default_well'],
              ['success', 'success'],
              ['info', 'info'],
              ['warning', 'warning'],
              ['danger', 'danger']
            ],
            'default': 'primary',
            setup: function(element) {
              // Setup the dialog field value on existing element
              if (element.hasClass('panel-primary'))
                this.setValue('primary');
              else if (element.hasClass('panel-default'))
                if (element.hasClass('well')) {
                  this.setValue('default_well');
                }
                else {
                  this.setValue('default');
                }
              else if (element.hasClass('panel-success'))
                this.setValue('success');
              else if (element.hasClass('panel-info'))
                this.setValue('info');
              else if (element.hasClass('panel-warning'))
                this.setValue('warning');
              else if (element.hasClass('panel-danger'))
                this.setValue('danger');
            },
            commit: function(element) {
              // Remove class from existing widget
              element.removeClass('panel-primary');
              element.removeClass('panel-default');
              element.removeClass('well');
              element.removeClass('panel-success');
              element.removeClass('panel-info');
              element.removeClass('panel-warning');
              element.removeClass('panel-danger');

              // Add class
              if (this.getValue() == 'default_well') {
                element.addClass('panel-default');
                element.addClass('well');
              }
              else {
                element.addClass('panel-' + this.getValue());
              }
            }
          }
        ]
      }
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
