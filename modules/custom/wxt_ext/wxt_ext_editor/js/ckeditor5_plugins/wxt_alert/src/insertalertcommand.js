import { Command } from 'ckeditor5/src/core';
import { AlertClasses } from './alertcssclasses';

export default class InsertAlertCommand extends Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new Alert
     * 
     * @param {String} alertClass the alert type to create
     */
    execute(alertClass) {
        const { model } = this.editor;

        model.change((writer) => {
            model.insertContent(createAlert(writer, alertClass));
        });
    }

    /**
     * Triggered when selection changes. determines if the alert toolbar button should be 
     * enabled if the users selection is not inside an element that allows alerts, disable
     * the button; otherwise it's active
     */
    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        const alertClasses = AlertClasses;
        this.isEnabled = true;

        alertClasses.forEach(c => {
            if (model.schema.findAllowedParent(
                    selection.getFirstPosition(),
                    'alert-' + c,
                ) === null) {
                this.isEnabled = false;
            }
        });
    }
}

/**
 * createAlert
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {String} alertClass - the chosen alert type to create
 * 
 * @returns {Element} Alert - the new alert with title and body
 */
function createAlert(writer, alertClass) {
    const alert = writer.createElement('alert-' + alertClass);
    const alertTitle = writer.createElement('alertTitle-' + alertClass);
    const alertBody = writer.createElement('alertBody-' + alertClass);
    const placeholderText = writer.createElement('paragraph');

    writer.append(alertTitle, alert);
    writer.append(alertBody, alert);
    writer.append(placeholderText, alertBody);

    writer.insertText('Alert title', alertTitle)
    writer.insertText('Alert body', placeholderText);

    return alert;
}