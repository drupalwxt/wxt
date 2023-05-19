import { Command } from 'ckeditor5/src/core';
import { PanelClasses } from './panelcssclasses';

export default class InsertPanelCommand extends Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new panel
     * @param {String} panelClass the panel type to create
     */
    execute(panelClass, existingPanel) {
        const { model } = this.editor;
        if (existingPanel !== null && existingPanel !== 'undefined') {
            // Existing panel found so we update
            model.change((writer) => {
                updatePanel(writer, panelClass, existingPanel);
            });
        } else {
            // Creating new panel
            model.change((writer) => {
                let panel = getPanelTemplate(writer, panelClass);
                model.insertContent(createPanel(writer, panel));
            });
        }
    }

    /**
     * Triggered when selection changes. determines if the panel toolbar button should be 
     * enabled if the users selection is not inside an element that allows panels, disable
     * the button; otherwise it's active
     */
    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        const panelClasses = PanelClasses;
        this.isEnabled = true;

        panelClasses.forEach(c => {
            if (model.schema.findAllowedParent(
                    selection.getFirstPosition(),
                    'panel-' + c,
                ) === null) {
                this.isEnabled = false;
            }
        });
    }
}

/**
 * createPanel
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {String} panelClass - the chosen panel type to create
 * 
 * @returns {Element} panel - the new panel with title and body
 */
function createPanel(writer, panel) {
    for (let child of panel.getChildren()) {
        if (child.name.startsWith('panelHeading-')) {
            for (let c of child.getChildren()) {
                if (c.name.startsWith('panelTitle-')) {
                    writer.insertText('Panel title', c)
                }
            }
        } else if (child.name.startsWith('panelBody-')) {
            const placeholderText = writer.createElement('paragraph');
            writer.append(placeholderText, child);
            writer.insertText('Panel body', placeholderText);
        }
    }
    return panel;
}

/**
 * updatePanel
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {Element} panel - the template of a panel
 * @param {Element} existingPanel - the existing panel that we are replacing
 * @returns {Element} panel - the new panel with title and body
 */
function updatePanel(writer, panel, existingPanel) {
    // Get existing content from existing panel
    for (let child of existingPanel.getChildren()) {
        if (child.name.startsWith('panelHeading-')) {
            writer.rename(child, 'panelHeading-' + panel);
            for (let c of child.getChildren()) {
                if (c.name.startsWith('panelTitle-')) {
                    writer.rename(c, 'panelTitle-' + panel);
                }
            }
        } else if (child.name.startsWith('panelBody-')) {
            writer.rename(child, 'panelBody-' + panel);
        }
    }
    writer.rename(existingPanel, 'panel-' + panel)

    return existingPanel;
}

/**
 * getPanelTemplate
 * 
 * @param {Writer} writer - the document writer
 * @param {String} panelClass - the panel type we're creating
 * @returns {Element} panel - the template of a panel of the given type
 */
function getPanelTemplate(writer, panelClass) {
    const panel = writer.createElement('panel-' + panelClass);
    const panelHeader = writer.createElement('panelHeading-' + panelClass);
    const panelTitle = writer.createElement('panelTitle-' + panelClass);
    const panelBody = writer.createElement('panelBody-' + panelClass);

    writer.append(panelTitle, panelHeader);
    writer.append(panelHeader, panel);
    writer.append(panelBody, panel);

    return panel;
}