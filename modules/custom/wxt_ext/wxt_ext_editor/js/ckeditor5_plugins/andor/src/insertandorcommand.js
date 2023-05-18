import { Command } from 'ckeditor5/src/core';

export default class InsertAndOrCommand extends Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new Alert
     * 
     * @param {String} alertClass the alert type to create
     */
    execute(type) {
        const { model } = this.editor;

        model.change((writer) => {
            model.insertContent(createAndOr(writer, type));
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
        this.isEnabled = true;
        // If the selection is inside an and widget
        const selectionInAndWidget = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'and-wrapper',
        );
        // If the selection is inside an or widget
        const selectionInWidget = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'or-wrapper',
        );

        // If selection is inside an 'and' or an 'or' widget, 
        // do not allow adding another 
        if (selectionInWidget === null && selectionInAndWidget === null) {
            this.isEnabled = false;
        }
    }
}

/**
 * createAndOr
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {string} type - the type of widget to create
 * 
 * @returns {Element}  - And/Or widget
 */
function createAndOr(writer, type) {
    const wrapper = writer.createElement(type + '-wrapper');
    const col1 = writer.createElement(type + '-column');
    const col2 = writer.createElement(type + '-column');
    const heading1 = writer.createElement(type + '-heading1');
    const heading2 = writer.createElement(type + '-heading2');
    const cnj = writer.createElement(type + '-cnj');
    const col1Placeholder = writer.createElement('paragraph');
    const col2Placeholder = writer.createElement('paragraph');

    writer.append(col1, wrapper);
    writer.append(cnj, wrapper);
    writer.append(col2, wrapper);
    writer.append(heading1, col1);
    writer.append(heading2, col2);
    writer.append(col1Placeholder, col1);
    writer.append(col2Placeholder, col2);

    writer.insertText(Drupal.t('Header A'), heading1)
    writer.insertText(Drupal.t('Header B'), heading2)
    writer.insertText(Drupal.t('Content for header A'), col1Placeholder);
    writer.insertText(Drupal.t('Content for header B'), col2Placeholder);

    return wrapper;
}