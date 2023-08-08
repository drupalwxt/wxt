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

            if (alerttype === null || typeof alerttype == 'undefined') {
                // Possible to add validation message to ask a user to choose?
                return;
            }
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
                //console.log('noice');
                editor.execute('insertAlert', alerttype, selection);
            } else {
                editor.execute('insertAlert', alerttype, null);
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
        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });
        this.formView.focus();
    }

    _hideUI() {
        this.formView.dropdown.selectedValue = null;

        this.formView.dropdown.buttonView.set({ label: Drupal.t('Alert type') })
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