import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import citeIcon from '../../../../icons/cite.svg';

export default class CitePlugin extends Plugin {
  init() {
    const editor = this.editor;

    this._defineSchema();
    this._defineConverters();

    editor.ui.componentFactory.add('cite', locale => {
      const button = new ButtonView(locale);
      button.set({
        label: 'Cite',
        icon: citeIcon,
        tooltip: true,
        isToggleable: true
      });

      const updateButtonState = () => {
        const selection = editor.model.document.selection;
        button.isOn = selection.hasAttribute('citeMark');
        button.isEnabled = true;
      };

      editor.model.document.selection.on('change', updateButtonState);
      editor.model.document.on('change:data', updateButtonState);

      button.on('execute', () => {
        const model = editor.model;
        const selection = model.document.selection;
        const isApplied = selection.hasAttribute('citeMark');

        model.change(writer => {
          if (selection.isCollapsed) {
            if (isApplied) {
              writer.removeSelectionAttribute('citeMark');
            } else {
              writer.setSelectionAttribute('citeMark', true);
            }
          } else {
            if (isApplied) {
              writer.removeAttribute('citeMark', selection.getFirstRange());
            } else {
              writer.setAttribute('citeMark', true, selection.getFirstRange());
            }
          }
        });
      });

      updateButtonState();

      return button;
    });
  }

  _defineSchema() {
    const schema = this.editor.model.schema;
    schema.extend('$text', { allowAttributes: [ 'citeMark' ] });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    conversion.for('upcast').elementToAttribute({
      view: 'cite',
      model: {
        key: 'citeMark',
        value: true
      }
    });

    conversion.for('downcast').attributeToElement({
      model: 'citeMark',
      view: 'cite'
    });
  }
}
