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
        // Would be nice to be able to have a generic panel shema entry and apply
        // styling class programmatically based on user input
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

        // Loop through available panel classes and create conversions for each panel type.
        // Would be nice to have a generic <section class="panel"> converter and add styling
        // classes programmatically.  
        this.panelClasses.forEach(c => {
            conversion.for('upcast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: ['panel', 'panel-' + c],
                },
                converterPriority: 'high'
            });

            conversion.for('upcast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'panelTitle-' + c,
                view: {
                    name: 'h3',
                    classes: 'panel-title',
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: 'high'
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: ['panel', 'panel-' + c],
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: {
                    name: 'h3',
                    classes: 'panel-title',
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panel-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const section = viewWriter.createContainerElement('section', {
                        class: 'panel panel-' + c,
                    });
                    return toWidget(section, viewWriter, { label: c + ' panel' });
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const h3 = viewWriter.createEditableElement('h3', {
                        class: 'panel-title',
                    });
                    return toWidgetEditable(h3, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const header = viewWriter.createEditableElement('header', {
                        class: 'panel-header',
                    });
                    return toWidgetEditable(header, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div', {
                        class: 'panel-body',
                    });
                    return toWidgetEditable(div, viewWriter);
                },
                converterPriority: 'high'
            });
        });
    }
}