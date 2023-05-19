import { Command } from 'ckeditor5/src/core';
import { AlertClasses } from './alertcssclasses';

export default class InsertAlertCommand extends Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new Alert
     * 
     * @param {String} alertClass the alert type to create
     */
    execute(alertClass, existingAlert) {
        const { model } = this.editor;
        if (existingAlert !== null && existingAlert !== 'undefined') {
            // Existing alert found so we update
            model.change((writer) => {
                updateAlert(writer, alertClass, existingAlert);
            });
        } else {
            // Creating new alert
            model.change((writer) => {
                let alert = getAlertTemplate(writer, alertClass);
                model.insertContent(createAlert(writer, alert));
            });
        }

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
 * @param {Element} alert - the alert template
 * 
 * @returns {Element} Alert - the new alert with title and body
 */
function createAlert(writer, alert) {
    // Add placeholder text to new alert widget
    for (let child of alert.getChildren()) {
        if (child.name.startsWith('alertTitle-')) {
            writer.insertText('Alert title', child)
        } else if (child.name.startsWith('alertBody-')) {
            const placeholderText = writer.createElement('paragraph');
            writer.append(placeholderText, child);
            writer.insertText('Alert body', placeholderText);
        }
    }
    return alert;
}

/**
 * updateAlert
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {Element} alert - the template of an alert
 * @param {Element} existingAlert - the existing alert that we are replacing
 * @returns {Element} Alert - the new alert with title and body
 */
function updateAlert(writer, alert, existingAlert) {
    // Get existing content from existing alert
    for (let child of existingAlert.getChildren()) {
        if (child.name.startsWith('alertTitle-')) {
            writer.rename(child, 'alertTitle-' + alert);
        } else if (child.name.startsWith('alertBody-')) {
            writer.rename(child, 'alertBody-' + alert);
        }
    }
    writer.rename(existingAlert, 'alert-' + alert);

    return existingAlert;
}

/**
 * getAlertTemplate
 * 
 * @param {Writer} writer - the document writer
 * @param {String} alertClass - the alert type we're creating
 * @returns {Element} alert - the template of an alert of the given type
 */
function getAlertTemplate(writer, alertClass) {
    const alert = writer.createElement('alert-' + alertClass);
    const alertTitle = writer.createElement('alertTitle-' + alertClass);
    const alertBody = writer.createElement('alertBody-' + alertClass);

    writer.append(alertTitle, alert);
    writer.append(alertBody, alert);

    return alert;
}