import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5/src/ui';
import { AlertClasses } from './alertcssclasses';
import FormView from './alertview';
import icon from '../../../../icons/alert.svg';

export default class AlertUI extends Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();
        this.alertClasses = AlertClasses;
        editor.ui.componentFactory.add('alert', () => {
            const button = new ButtonView();
            button.label = Drupal.t('Alert');
            button.icon = icon;
            button.tooltip = true;
            button.withText = true;
            const command = editor.commands.get('insertAlert');

            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            this.listenTo(button, 'execute', () => {
                this._showUI();
            });

            return button;
        });
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new FormView(editor.locale);

        this.listenTo(formView, 'submit', () => {
            const alerttype = formView.dropdown.selectedValue;
            const headingLevel = formView.headingDropdown.selectedValue || 'h3';

            if (alerttype === null || typeof alerttype === 'undefined') {
                return; // Optionally show validation message
            }

            console.log(alerttype);

            let selectionAncestors = editor.model.document.selection.getFirstPosition().getAncestors();
            let selectionIsAlert = false;
            let selection = null;

            // Traverse from the first inner tag to the root
            selectionAncestors.forEach(node => {
                // Check if the current selection is an alert widget
                this.alertClasses.forEach(c => {
                    if (node.name == 'alert-' + c) {
                        // Alert widget found
                        selection = node;
                        selectionIsAlert = true;
                    }
                });
            });

            // If the selection is within an alert widget, update the selected widget; otherwise create a new one
            if (selectionIsAlert) {
                editor.execute('insertAlert', alerttype, selection, headingLevel);
            } else {
                editor.execute('insertAlert', alerttype, null, headingLevel);
            }

            this._hideUI();
        });

        this.listenTo(formView, 'cancel', () => {
            this._hideUI();
        });

        clickOutsideHandler({
            emitter: formView,
            activator: () => this._balloon.visibleView === formView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI()
        });

        return formView;
    }

    _showUI() {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        let selectedAlert = null;
        let selectedAlertType = null;
        let selectedHeadingLevel = null;
        
        // Check if the selection is inside an existing alert.
        selection.getFirstPosition().getAncestors().forEach(node => {
            this.alertClasses.forEach(c => {
                if (node.name === 'alert-' + c) {
                    selectedAlert = node;
                    selectedAlertType = c;
                    
                    // Check if the alertTitle element has a heading level attribute.
                    node.getChildren().forEach(child => {
                        if (child.name.startsWith('alertTitle-')) {
                            selectedHeadingLevel = child.getAttribute('headingLevel') || 'h3';
                        }
                    });
                }
            });
        });

        // Prepopulate the alert type dropdown if there's a selected alert.
        if (selectedAlertType) {
            this.formView.dropdown.selectedValue = selectedAlertType;
            this.formView.dropdown.buttonView.set({ label: selectedAlertType });
        } else {
            this.formView.dropdown.selectedValue = null;
            this.formView.dropdown.buttonView.set({ label: Drupal.t('Alert type') });
        }

        // Prepopulate the heading level dropdown if there's a selected alert.
        if (selectedHeadingLevel) {
            this.formView.headingDropdown.selectedValue = selectedHeadingLevel;
            this.formView.headingDropdown.buttonView.set({ label: selectedHeadingLevel });
        } else {
            this.formView.headingDropdown.selectedValue = null;
            this.formView.headingDropdown.buttonView.set({ label: Drupal.t('Heading level') });
        }

        // Show the balloon with the form.
        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });

        this.formView.focus();
    }

    _hideUI() {
        this.formView.dropdown.selectedValue = null;
        this.formView.dropdown.buttonView.set({ label: Drupal.t('Alert type') });
        this.formView.headingDropdown.selectedValue = null;
        this.formView.headingDropdown.buttonView.set({ label: Drupal.t('Heading level') });
        this.formView.element.reset();
        this._balloon.remove(this.formView);
        this.editor.editing.view.focus();
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        let target = null;
        target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

        return {
            target
        };
    }
}
