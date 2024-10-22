import { Command } from 'ckeditor5/src/core';
import { AlertClasses } from './alertcssclasses';

export default class InsertAlertCommand extends Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new Alert
     * 
     * @param {String} alertClass the alert type to create
     * @param {Element} existingAlert the existing alert to update, if any
     * @param {String} headingLevel the heading level to use for the alert title
     */
    execute(alertClass, existingAlert, headingLevel = 'h3') {
        const { model } = this.editor;
        if (existingAlert !== null && existingAlert !== 'undefined') {
            // Existing alert found, so we update it
            model.change((writer) => {
                updateAlert(writer, alertClass, existingAlert, headingLevel);
            });
        } else {
            // Creating a new alert
            model.change((writer) => {
                let alert = getAlertTemplate(writer, alertClass, headingLevel);
                model.insertContent(createAlert(writer, alert));
            });
        }
    }

    /**
     * Triggered when selection changes. Determines if the alert toolbar button should be 
     * enabled. If the user's selection is not inside an element that allows alerts, disable
     * the button; otherwise, it's active.
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
    // Add placeholder text to the new alert widget
    for (let child of alert.getChildren()) {
        if (child.name.startsWith('alertTitle-')) {
            writer.insertText('Alert title', child);
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
 * @param {String} alertClass - the alert type to update
 * @param {Element} existingAlert - the existing alert being updated
 * @param {String} headingLevel - the heading level to use for the alert title
 * @returns {Element} Alert - the updated alert
 */
function updateAlert(writer, alertClass, existingAlert, headingLevel) {
    // Get the existing content from the alert
    for (let child of existingAlert.getChildren()) {
        if (child.name.startsWith('alertTitle-')) {
            writer.rename(child, 'alertTitle-' + alertClass);
            writer.setAttribute('headingLevel', headingLevel, child);
        } else if (child.name.startsWith('alertBody-')) {
            writer.rename(child, 'alertBody-' + alertClass);
        }
    }
    writer.rename(existingAlert, 'alert-' + alertClass);

    return existingAlert;
}

/**
 * getAlertTemplate
 * 
 * @param {Writer} writer - the document writer
 * @param {String} alertClass - the alert type we're creating
 * @param {String} headingLevel - the heading level for the alert title
 * @returns {Element} alert - the template of an alert of the given type
 */
function getAlertTemplate(writer, alertClass, headingLevel) {
    const alert = writer.createElement('alert-' + alertClass);
    const alertTitle = writer.createElement('alertTitle-' + alertClass, { headingLevel });
    const alertBody = writer.createElement('alertBody-' + alertClass);

    writer.append(alertTitle, alert);
    writer.append(alertBody, alert);

    return alert;
}
