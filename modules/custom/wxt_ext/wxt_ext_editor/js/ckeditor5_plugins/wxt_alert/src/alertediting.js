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
                model: 'alertTitle-' + c,
                view: {
                    name: 'h3'
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
                view: {
                    name: 'h3'
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
                    const h3 = viewWriter.createEditableElement('h3');
                    return toWidgetEditable(h3, viewWriter);
                },
                converterPriority: 'high'
            }, );
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