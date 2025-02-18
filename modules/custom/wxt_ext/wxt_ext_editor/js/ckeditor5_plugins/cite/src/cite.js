import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import { toWidget, toWidgetEditable } from 'ckeditor5/src/widget';
import { Widget } from 'ckeditor5/src/widget';
import citeIcon from '../../../../icons/cite.svg';

export default class CitePlugin extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        const editor = this.editor;

        this._defineSchema();
        this._defineConverters();

        // Add the Cite button to the toolbar.
        editor.ui.componentFactory.add('cite', locale => {
            const button = new ButtonView(locale);
            button.set({
                label: 'Cite',
                icon: citeIcon,
                tooltip: true,
                isEnabled: false
            });

            // Listen for selection changes and update button state.
            const updateButtonState = () => {
                const selection = editor.model.document.selection;
                const selectedElement = selection.getSelectedElement();
                const position = selection.getFirstPosition();

                // Check if the selection is inside a `<cite>` (even if cursor is inside).
                let isInsideCite = false;
                if (position) {
                    for (const ancestor of position.getAncestors()) {
                        if (ancestor.is && ancestor.is('element', 'cite')) {
                            isInsideCite = true;
                            break;
                        }
                    }
                }

                // Enable button if text is selected, the whole cite is selected, OR the cursor is inside `<cite>`.
                button.isEnabled = !selection.isCollapsed || selectedElement?.is('element', 'cite') || isInsideCite;
            };


            // React to selection changes.
            editor.model.document.selection.on('change', updateButtonState);
            editor.model.document.on('change:data', updateButtonState);

            button.on('execute', () => {
                const model = editor.model;
                const selection = model.document.selection;
                const selectedElement = selection.getSelectedElement();
                const position = selection.getFirstPosition();

                let citeElement = null;

                // Check if the selection is inside a <cite> element.
                if (position) {
                    for (const ancestor of position.getAncestors()) {
                        if (ancestor.is && ancestor.is('element', 'cite')) {
                            citeElement = ancestor;
                            break;
                        }
                    }
                }

                model.change(writer => {
                    if (selectedElement && selectedElement.is('element', 'cite')) {
                        // If the whole <cite> is selected, unwrap it.
                        writer.unwrap(selectedElement);
                    } else if (citeElement) {
                        // If cursor is inside an existing <cite>, unwrap it.
                        writer.unwrap(citeElement);
                    } else {
                        // Otherwise, wrap the selected text in a new <cite>.
                        const range = selection.getFirstRange();
                        writer.wrap(range, writer.createElement('cite'));
                    }
                });

                updateButtonState();
            });


            return button;
        });
    }

    // Define Schema to Allow <cite> as a Widget
    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('cite', {
            allowWhere: '$text',
            allowContentOf: '$block',
            isInline: true,
            isObject: true,
            isContent: true
        });
    }

    // Define Converters to Treat Cite as a Widget.
    _defineConverters() {
        const conversion = this.editor.conversion;

        // Upcast <cite> elements from raw HTML into model data.
        conversion.for('upcast').elementToElement({
            view: 'cite',
            model: (viewElement, { writer }) => {
                // If the cite is already inside another cite, unwrap it.
                if (viewElement.parent && viewElement.parent.name === 'cite') {
                    return null;
                }
                return writer.createElement('cite');
            },
        });

        // Downcast model data into <cite> elements for editing and data output.
        conversion.for('downcast').elementToElement({
            model: 'cite',
            view: (modelElement, { writer }) => {
                return writer.createContainerElement('cite');
            }
        });

        // Downcast for editing mode (Ensures it's editable but doesn't add attributes)
        conversion.for('editingDowncast').elementToElement({
            model: 'cite',
            view: (modelElement, { writer }) => {
                const citeElement = writer.createEditableElement('cite');
                return toWidgetEditable(citeElement, writer);
            }
        });
    }
}
