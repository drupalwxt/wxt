import { Plugin } from 'ckeditor5/src/core';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import InsertPanelCommand from './insertpanelcommand';
import { PanelClasses } from './panelcssclasses';

export default class PanelEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.panelClasses = PanelClasses;

        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertPanel',
            new InsertPanelCommand(this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        // Loop through available panel classes and create schema entries for 
        // panel, panel heading, panel title, panel body.
        this.panelClasses.forEach(c => {
            schema.register('panel-' + c, {
                isObject: true,
                allowWhere: '$block',
            });
            schema.register('panelHeading-' + c, {
                isLimit: true,
                allowIn: 'panel-' + c,
                allowContentOf: '$block',
                allowChildren: 'panelTitle-' + c
            });
            schema.register('panelTitle-' + c, {
                isLimit: true,
                allowIn: 'panelHeading-' + c,
                allowContentOf: '$block',
            });
            schema.register('panelBody-' + c, {
                isLimit: true,
                allowIn: 'panel-' + c,
                allowContentOf: '$root',
            });
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        this.panelClasses.forEach(c => {
            // Handle special case for "default-well" class
            const castingClasses = (c === 'default-well') 
                ? ['panel', 'panel-default', 'well'] 
                : ['panel', 'panel-' + c];

            let convPriority = (c === 'default-well') ? 'high' : 'normal';

            // Upcast converters
            conversion.for('upcast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: castingClasses,
                },
                converterPriority: convPriority
            });

            conversion.for('upcast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: convPriority
            });

            conversion.for('upcast').elementToElement({
                model: 'panelTitle-' + c,
                view: {
                    name: 'h3',
                    classes: 'panel-title',
                },
                converterPriority: convPriority
            });

            conversion.for('upcast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: convPriority
            });

            // Data Downcast converters
            conversion.for('dataDowncast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: castingClasses,
                },
                converterPriority: convPriority
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: convPriority
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: {
                    name: 'h3',
                    classes: 'panel-title',
                },
                converterPriority: convPriority
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: convPriority
            });

            // Editing Downcast converters
            conversion.for('editingDowncast').elementToElement({
                model: 'panel-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const section = viewWriter.createContainerElement('section', {
                        class: castingClasses.join(' '),
                    });
                    return toWidget(section, viewWriter, { label: `${c} panel`, hasSelectionHandle: true });
                },
                converterPriority: convPriority
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const h3 = viewWriter.createEditableElement('h3', {
                        class: 'panel-title',
                    });
                    return toWidgetEditable(h3, viewWriter);
                },
                converterPriority: convPriority
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const header = viewWriter.createEditableElement('header', {
                        class: 'panel-heading',
                    });
                    return toWidgetEditable(header, viewWriter);
                },
                converterPriority: convPriority
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div', {
                        class: 'panel-body',
                    });
                    return toWidgetEditable(div, viewWriter);
                },
                converterPriority: convPriority
            });
        });
    }
}
