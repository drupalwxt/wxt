import { Plugin } from 'ckeditor5/src/core';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import { AlertClasses } from './alertcssclasses';
import InsertAlertCommand from './insertalertcommand';

export default class AlertEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.alertClasses = AlertClasses;

        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertAlert',
            new InsertAlertCommand(this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        this.alertClasses.forEach(c => {
            schema.register('alert-' + c, {
                inheritAllFrom: '$block'
            });
            schema.register('alertTitle-' + c, {
                isLimit: true,
                allowContentOf: '$block',
                allowIn: 'alert-' + c,
                allowAttributes: ['headingLevel'], // Allow the heading level attribute
            });
            schema.register('alertBody-' + c, {
                isLimit: true,
                allowIn: 'alert-' + c,
                allowContentOf: '$root',
            });
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        this.alertClasses.forEach(c => {
            conversion.for('upcast').elementToElement({
                model: 'alert-' + c,
                view: {
                    name: 'section',
                    classes: ['alert', 'alert-' + c],
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: (viewElement, { writer: modelWriter }) => {
                    const headingLevel = viewElement.name.match(/^h[2-6]$/) ? viewElement.name : 'h3';
                    return modelWriter.createElement('alertTitle-' + c, { headingLevel });
                },
                view: {
                    name: /^(h2|h3|h4|h5|h6)$/,
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'alertBody-' + c,
                view: {
                    name: 'div',
                },
                converterPriority: 'high'
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'alert-' + c,
                view: {
                    name: 'section',
                    classes: ['alert', 'alert-' + c],
                },
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'alertTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const headingLevel = modelElement.getAttribute('headingLevel') || 'h3';
                    return viewWriter.createContainerElement(headingLevel);
                },
                converterPriority: 'high'
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'alertBody-' + c,
                view: {
                    name: 'div',
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'alert-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createContainerElement('section', { class: 'alert alert-' + c });
                    return toWidget(div, viewWriter, { hasSelectionHandle: true });
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'alertTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const headingLevel = modelElement.getAttribute('headingLevel') || 'h3';
                    const heading = viewWriter.createEditableElement(headingLevel);
                    return toWidgetEditable(heading, viewWriter);
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'alertBody-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div');
                    return toWidgetEditable(div, viewWriter);
                },
                converterPriority: 'high'
            });
        });
    }
}
