import { Plugin } from 'ckeditor5/src/core';
import { Widget, toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import InsertWXTTabsCommand from './insertwxttabcommand';

export default class WXTTabsEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('insertWXTTabs', new InsertWXTTabsCommand(this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('wxtTabs', {
      isObject: true,
      allowWhere: '$block',
    });

    schema.register('wxtTabPanels', {
      isLimit: true,
      allowIn: 'wxtTabs',
      allowContentOf: '$root',
    });
  }

  _defineConverters() {
    const { conversion } = this.editor;

    // Upcast (HTML -> Model)
    conversion.for('upcast').add((dispatcher) => {
      dispatcher.on('element:div', (evt, data, conversionApi) => {
        const { consumable, writer, safeInsert, convertChildren } = conversionApi;
        const viewItem = data.viewItem;

        // Ensure the div has the "wb-tabs" class.
        if (viewItem.hasClass('wb-tabs')) {
          const wxtTabs = writer.createElement('wxtTabs');
          if (safeInsert(wxtTabs, data.modelCursor)) {
            convertChildren(viewItem, writer.createPositionAt(wxtTabs, 0));
            data.modelRange = writer.createRange(
              writer.createPositionBefore(wxtTabs),
              writer.createPositionAfter(wxtTabs)
            );
            data.modelCursor = data.modelRange.end;
            consumable.consume(viewItem, { name: true, classes: 'wb-tabs' });
          }
        }

        // Ensure the div has the "tabpanels" class.
        if (viewItem.hasClass('tabpanels')) {
          const wxtTabPanels = writer.createElement('wxtTabPanels');
          if (safeInsert(wxtTabPanels, data.modelCursor)) {
            convertChildren(viewItem, writer.createPositionAt(wxtTabPanels, 0), {
              // Ignore non-relevant children like `<paragraph>` or `<detail>`.
              ignoreChildren: true,
            });

            data.modelRange = writer.createRange(
              writer.createPositionBefore(wxtTabPanels),
              writer.createPositionAfter(wxtTabPanels)
            );
            data.modelCursor = data.modelRange.end;
            consumable.consume(viewItem, { name: true, classes: 'tabpanels' });
          }
        }
      });
    });

    // Data Downcast (Model -> HTML)
    conversion.for('dataDowncast').elementToElement({
      model: 'wxtTabs',
      view: {
        name: 'div',
        classes: 'wb-tabs',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'wxtTabPanels',
      view: (modelElement, { writer }) => {
        const div = writer.createContainerElement('div', { class: 'tabpanels' });

        // Append all child elements to the "tabpanels" div.
        modelElement.getChildren().forEach((child) => {
          if (child.name === 'details') {
            writer.insert(writer.createPositionAt(div, 'end'), writer.createContainerElement(child.name, child.getAttributes()));
          }
        });

        return div;
      },
    });

    // Editing Downcast
    conversion.for('editingDowncast').elementToElement({
      model: 'wxtTabs',
      view: (modelElement, { writer }) => {
        // Create the main container div for the widget.
        const div = writer.createContainerElement('div', { class: 'wb-tabs' });

        // Create a label element to add to the widget.
        const label = writer.createContainerElement('div', {
            class: 'wb-conjunction-label',
            'data-cke-ignore-selection': 'true',
        });

        // Add text content to the label.
        writer.insert(writer.createPositionAt(label, 0), writer.createText('Tabbed interface'));

        // Append the label to the main container.
        writer.insert(writer.createPositionAt(div, 0), label);

        // Convert into a widget for selection and handles.
        return toWidget(div, writer, {
            label: 'Tabs widget',
            hasSelectionHandle: true,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'wxtTabPanels',
      view: (modelElement, { writer }) => {
        const div = writer.createEditableElement('div', { class: 'tabpanels' });

        // Append only necessary child elements.
        modelElement.getChildren().forEach((child) => {
          if (child.name === 'details') {
            writer.insert(writer.createPositionAt(div, 'end'), writer.createEditableElement(child.name, child.getAttributes()));
          }
        });

        return toWidgetEditable(div, writer);
      },
    });
  }
}
