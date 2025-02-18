import { Plugin } from 'ckeditor5/src/core';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import { ConjunctionClasses } from './conjunctioncssclasses';
import InsertConjunctionCommand from './insertconjunctioncommand';

export default class ConjunctionEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        // Intercept and override the list plugin's upcast converters
        this.editor.conversion.for('upcast').add((dispatcher) => {
            dispatcher.on('element:ul', (evt, data, conversionApi) => {
                const viewElement = data.viewItem;

                // Check if this <ul> is conjunction-specific
                if (viewElement.hasClass('cnjnctn-type-and') || viewElement.hasClass('cnjnctn-type-or')) {
                    // Disable the list plugin for this element
                    dispatcher.off('element:ul');
                }
            }, { priority: 'highest' });
        });

        this.conjunctionClasses = ConjunctionClasses;
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertConjunction',
            new InsertConjunctionCommand(this.editor)
        );

        // Listen for attribute changes in the model, to update widget label.
        this.editor.model.document.on('change:data', (evt, batch) => {
            // Only handle user-initiated changes.
            if (batch.type === 'default') {
                const differ = this.editor.model.document.differ;

                for (const change of differ.getChanges()) {
                    if (change.type === 'attribute' && change.attributeKey === 'conjunctionType') {
                        const modelElement = change.range.start.nodeAfter;

                        if (modelElement && modelElement.is('element', 'conjunction')) {
                            // Handle the change and update the label.
                            this.updateConjunctionLabel(modelElement, change.attributeNewValue);
                        }
                    }
                }
            }
        });
    }

    // Utility function to update the label
    updateConjunctionLabel(modelElement, conjunctionType) {
        const label = conjunctionType.toLowerCase() === 'cnjnctn-type-and' ? 'AND' : 'OR';

        this.editor.model.change((writer) => {
            // Update the label in the model
            writer.setAttribute('label', label, modelElement);
        });

        // Update the view dynamically
        const view = this.editor.editing.mapper.toViewElement(modelElement);

        if (view) {
            this.editor.editing.view.change((writer) => {
                // Find the label element inside the view
                const labelElement = Array.from(view.getChildren()).find(
                    (child) => child.hasClass && child.hasClass('wb-conjunction-label')
                );

                if (labelElement) {
                    // Remove existing text and insert the updated label
                    Array.from(labelElement.getChildren()).forEach((child) => writer.remove(child));
                    writer.insert(writer.createPositionAt(labelElement, 0), writer.createText('Conjunction: ' + label));
                }
            });
        }
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('conjunction', {
            isObject: true,
            allowWhere: '$block',
            allowAttributes: ['conjunctionType', 'columnCount', 'responsiveClass'],
            allowContentOf: '$block',
            inheritAllFrom: '$block',
        });

        schema.register('conjunctionCol', {
            isLimit: true,
            allowIn: 'conjunction',
            allowContentOf: '$root',
            allowAttributes: ['useSection', 'originalTag']
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        // Upcast
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const originalTag = viewElement.name;
                const conjunctionType = viewElement.hasClass('cnjnctn-type-and') ? 'cnjnctn-type-and' : 'cnjnctn-type-or';
                const responsiveClass = viewElement.getAttribute('class').match(/cnjnctn-(xs|sm|md|lg)/)?.[0];
                
                // Count the number of child elements with the `cnjnctn-col` class.
                const columnCount = Array.from(viewElement.getChildren())
                    .filter(child => child.hasClass && child.hasClass('cnjnctn-col'))
                    .length;

                return modelWriter.createElement('conjunction', {
                    conjunctionType,
                    columnCount,
                    ...(responsiveClass ? { responsiveClass } : {}),
                    originalTag,
                });
            },
            view: {
                name: /^(div|ul)$/,
                classes: /cnjnctn-type-(and|or)/,
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const originalTag = viewElement.name;
                const useSection = originalTag === 'section';

                return modelWriter.createElement('conjunctionCol', {
                    useSection,
                    originalTag,
                });
            },
            view: {
                name: /^(div|section|li)$/,
                classes: 'cnjnctn-col'
            },
        });

        // Data Downcast
        conversion.for('dataDowncast').elementToElement({
            model: 'conjunction',
            view: (modelElement, { writer: viewWriter }) => {
                const conjunctionType = modelElement.getAttribute('conjunctionType') || 'or';
                const responsiveClass = modelElement.getAttribute('responsiveClass');
                const originalTag = modelElement.getAttribute('originalTag') || 'div';

                // Create the class string conditionally
                const classString = responsiveClass
                    ? `${conjunctionType} ${responsiveClass}`
                    : conjunctionType;

                const container = viewWriter.createContainerElement(originalTag, {
                    class: classString,
                });

                return container;
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'conjunctionCol',
            view: (modelElement, { writer: viewWriter }) => {
                const originalTag = modelElement.getAttribute('originalTag') || 'div';
                return viewWriter.createContainerElement(originalTag, {
                    class: 'cnjnctn-col'
                });
            }
        });

        // Editing Downcast
        conversion.for('editingDowncast').elementToElement({
            model: 'conjunction',
            view: (modelElement, { writer, mapper }) => {
                const conjunctionType = modelElement.getAttribute('conjunctionType') || 'or';
                const responsiveClass = modelElement.getAttribute('responsiveClass');
                const originalTag = modelElement.getAttribute('originalTag') || 'div';

                // Create the class string conditionally
                const classString = responsiveClass
                    ? `${conjunctionType} ${responsiveClass}`
                    : conjunctionType;

                const container = writer.createContainerElement(originalTag, {
                    class: classString,
                });

                // Create a label element to add to the widget.
                const label = writer.createContainerElement('div', {
                    class: 'wb-conjunction-label',
                    'data-cke-ignore-selection': 'true',
                });

                // Determine the text for the label based on the conjunctionType.
                const labelText = conjunctionType.toLowerCase() === 'cnjnctn-type-and' ? 'AND' : 'OR';
                writer.insert(writer.createPositionAt(label, 0), writer.createText('Conjunction: ' + labelText));
                writer.insert(writer.createPositionAt(container, 0), label);

                return toWidget(container, writer, { hasSelectionHandle: true });
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'conjunctionCol',
            view: (modelElement, { writer: viewWriter }) => {
                const originalTag = modelElement.getAttribute('originalTag') || 'div';
                const container = viewWriter.createEditableElement(originalTag, {
                    class: 'cnjnctn-col'
                });
                return toWidgetEditable(container, viewWriter);
            }
        });
    }
}
