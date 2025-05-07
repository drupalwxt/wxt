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

            const headingLevel = formView.headingDropdown.selectedValue || 'h3';

            // If the selection is within a panel widget, update the selected widget; otherwise create a new one
            if (selectionIsAlert) {
                editor.execute('insertPanel', paneltype, selection, headingLevel);
            } else {
                editor.execute('insertPanel', paneltype, null, headingLevel);
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
        let selectedPanel = null;
        let selectedPanelType = null;

        // Check if the selection is inside an existing panel.
        selection.getFirstPosition().getAncestors().forEach(node => {
            this.panelClasses.forEach(c => {
                if (node.name === 'panel-' + c) {
                    selectedPanel = node;
                    selectedPanelType = c;
                }
            });
        });

        // Prepopulate the panel type dropdown if there's a selected panel.
        if (selectedPanelType) {
            this.formView.dropdown.selectedValue = selectedPanelType;
            this.formView.dropdown.buttonView.set({ label: selectedPanelType });
        } else {
            this.formView.dropdown.selectedValue = null;
            this.formView.dropdown.buttonView.set({ label: Drupal.t('Panel type') });
        }

        // Check inside the selected panel for the panelTitle element.
        let selectedHeadingLevel = null;
        if (selectedPanel) {
            for (const child of selectedPanel.getChildren()) {
                if (child.name.startsWith('panelHeading-')) {
                    for (const grandchild of child.getChildren()) {
                        if (grandchild.name.startsWith('panelTitle-')) {
                            selectedHeadingLevel = grandchild.getAttribute('headingLevel') || 'h3';
                        }
                    }
                }
            }
        }

        if (selectedHeadingLevel) {
            this.formView.headingDropdown.selectedValue = selectedHeadingLevel;
            this.formView.headingDropdown.buttonView.set({ label: selectedHeadingLevel.toUpperCase() });
        } else {
            this.formView.headingDropdown.selectedValue = null;
            this.formView.headingDropdown.buttonView.set({ label: Drupal.t('Heading level') });
        }

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