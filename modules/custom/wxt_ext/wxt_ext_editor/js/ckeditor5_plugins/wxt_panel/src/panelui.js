import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5/src/ui';
import { PanelClasses } from './panelcssclasses';
import FormView from './panelview';
import icon from '../../../../icons/panel.svg';

export default class PanelUI extends Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();
        this.panelClasses = PanelClasses;
        editor.ui.componentFactory.add('panel', () => {
            const button = new ButtonView();
            button.label = Drupal.t('Panel');
            button.icon = icon;
            button.tooltip = true;
            button.withText = true;
            const command = editor.commands.get('insertPanel');

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
            const paneltype = formView.dropdown.selectedValue;

            if (paneltype === null || typeof paneltype == 'undefined') {
                // Possible to add validation message to ask a user to choose?
                return;
            }
            let selectionAncestors = editor.model.document.selection.getFirstPosition().getAncestors();
            let selectionIsAlert = false;
            let selection = null;
            // Traverse from the first inner tag to the root
            selectionAncestors.forEach(node => {
                // Check if the current selection is a panel widget
                this.panelClasses.forEach(c => {
                    if (node.name == 'panel-' + c) {
                        // Alert widget found 
                        selection = node;
                        selectionIsAlert = true;
                    }
                });
            });

            // If the selection is within a panel widget, update the selected widget; otherwise create a new one
            if (selectionIsAlert) {
                editor.execute('insertPanel', paneltype, selection);
            } else {
                editor.execute('insertPanel', paneltype, null);
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

        this.formView.dropdown.buttonView.set({ label: Drupal.t('Panel type') })
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