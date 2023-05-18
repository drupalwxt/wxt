import { Command } from 'ckeditor5/src/core';
import { PanelClasses } from './panelcssclasses';

export default class InsertPanelCommand extends Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new panel
     * @param {String} panelClass the panel type to create
     */
    execute(panelClass) {
        const { model } = this.editor;

        model.change((writer) => {
            model.insertContent(createPanel(writer, panelClass));
        });
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
function createPanel(writer, panelClass) {
    const panel = writer.createElement('panel-' + panelClass);
    const panelHeader = writer.createElement('panelHeading-' + panelClass);
    const panelTitle = writer.createElement('panelTitle-' + panelClass);
    const panelBody = writer.createElement('panelBody-' + panelClass);
    const placeholderText = writer.createElement('paragraph');

    writer.append(panelTitle, panelHeader);
    writer.append(panelHeader, panel);
    writer.append(panelBody, panel);
    writer.append(placeholderText, panelBody);

    writer.insertText('Panel title', panelTitle)
    writer.insertText('Panel body', placeholderText);

    return panel;
}