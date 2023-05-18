import { Plugin } from 'ckeditor5/src/core';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import InsertAndOrCommand from './insertandorcommand';
import { Types } from './types';

export default class AndOrEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.widgetTypes = Types;
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertAndOr',
            new InsertAndOrCommand(this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        this.widgetTypes.forEach(type => {
            schema.register(type + '-wrapper', {
                inheritAllFrom: '$block'
            });
            schema.register(type + '-column', {
                inheritAllFrom: '$block',
                allowIn: type + '-wrapper',
                allowContentOf: '$root',
            });
            schema.register(type + '-heading1', {
                isLimit: true,
                allowIn: type + '-column',
                allowContentOf: '$block',
            });
            schema.register(type + '-heading2', {
                isLimit: true,
                allowIn: type + '-column',
                allowContentOf: '$block',
            });
            schema.register(type + '-cnj', {
                isLimit: true,
                allowIn: type + '-wrapper',
            });
            schema.addChildCheck((context, childDefinition) => {
                if (
                    context.endsWith(type + '-column') &&
                    childDefinition.name === type + '-wrapper'
                ) {
                    return false;
                }
            });
        })

    }

    _defineConverters() {
        const { conversion } = this.editor;

        this.widgetTypes.forEach(type => {
            conversion.for('upcast').elementToElement({
                model: type + '-wrapper',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-grd', 'flex-fw-xs', type + '-wdgt'],
                }
            });
            conversion.for('upcast').elementToElement({
                model: type + '-column',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-col', type + '-wdgt'],
                }
            });
            conversion.for('upcast').elementToElement({
                model: type + '-heading1',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading1', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: type + '-heading2',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading2', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: type + '-cnj',
                view: {
                    name: 'div',
                    classes: ['and-or', 'cnjnctn-' + type]
                }
            });

            conversion.for('dataDowncast').elementToElement({
                model: type + '-wrapper',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-grd', 'flex-fw-xs', type + '-wdgt'],
                }
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-column',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-col', type + '-wdgt'],
                }
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-heading1',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading1', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-heading2',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading2', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-cnj',
                view: {
                    name: 'div',
                    classes: ['and-or', 'cnjnctn-' + type]
                }
            });

            conversion.for('editingDowncast').elementToElement({
                model: type + '-wrapper',
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createContainerElement('div', { class: 'cnjnctn-grd flex-fw-xs ' + type + '-wdgt' });
                    return toWidget(div, viewWriter);
                }
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-column',
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div', { class: 'cnjnctn-col ' + type + '-wdgt' });
                    return toWidgetEditable(div, viewWriter);
                }
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-heading1',
                view: (modelElement, { writer: viewWriter }) => {
                    const h4 = viewWriter.createEditableElement('h4', { class: 'mrgn-tp-sm text-muted heading1 ' + type + '-wdgt' });
                    return toWidgetEditable(h4, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-heading2',
                view: (modelElement, { writer: viewWriter }) => {
                    const h4 = viewWriter.createEditableElement('h4', { class: 'mrgn-tp-sm text-muted heading2 ' + type + '-wdgt' });
                    return toWidgetEditable(h4, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-cnj',
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createContainerElement('div', { class: 'and-or cnjnctn-' + type });
                    return toWidget(div, viewWriter);
                }
            });
        });
    }
}