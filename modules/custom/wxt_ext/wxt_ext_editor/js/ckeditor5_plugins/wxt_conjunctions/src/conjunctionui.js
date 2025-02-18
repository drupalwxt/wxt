import { Plugin } from 'ckeditor5/src/core';
import { ButtonView, ContextualBalloon, clickOutsideHandler } from 'ckeditor5/src/ui';
import { ConjunctionClasses } from './conjunctioncssclasses';
import { ResponsiveClasses } from './responsiveclasses';
import FormView from './conjunctionview';
import icon from '../../../../icons/conjunction.svg';

export default class ConjunctionUI extends Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();
        this.conjunctionClasses = ConjunctionClasses;
        this.responsiveClasses = ResponsiveClasses;

        editor.ui.componentFactory.add('conjunction', () => {
            const button = new ButtonView();
            button.label = 'Conjunction';
            button.icon = icon;
            button.tooltip = true;
            button.withText = true;
            const command = editor.commands.get('insertConjunction');

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
            const conjunctionType = formView.dropdown.selectedValue;
            const childCount = parseInt(formView.childCountInput.selectedValue) || 2;
            const responsiveClass = formView.responsiveClassInput.selectedValue || null;

            if (!conjunctionType) {
                return;
            }

            editor.execute('insertConjunction', conjunctionType, childCount, responsiveClass);
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

        // Default values for the dropdowns
        let selectedConjunctionType = null;
        let selectedColumnCount = '';
        let selectedResponsiveClass = '';

        // Check if the selection is directly a conjunction widget or part of it.
        const selectedWidget = selection.getSelectedElement();

        if (selectedWidget && selectedWidget.is('element', 'conjunction')) {
            // Extract attributes from the selected widgets.
            const fullConjunctionType = selectedWidget.getAttribute('conjunctionType') || 'cnjnctn-type-and';
            selectedConjunctionType = fullConjunctionType.replace('cnjnctn-type-', '');
            selectedColumnCount = selectedWidget.getAttribute('columnCount') || 2;
            selectedResponsiveClass = selectedWidget.getAttribute('responsiveClass') || null;
        }

        // Populate the form with the widget's values or reset to defaults
        if (selectedConjunctionType) {
            this.formView.dropdown.selectedValue = selectedConjunctionType;
            this.formView.dropdown.buttonView.set({ label: selectedConjunctionType });
        } else {
            this.formView.dropdown.selectedValue = null;
            this.formView.dropdown.buttonView.set({ label: 'Type' });
        }

        if (selectedColumnCount) {
            this.formView.childCountInput.selectedValue = selectedColumnCount.toString();
            this.formView.childCountInput.buttonView.set({ label: selectedColumnCount.toString() });
        } else {
            this.formView.childCountInput.selectedValue = '';
            this.formView.childCountInput.buttonView.set({ label: 'Columns' });
        }

        if (selectedResponsiveClass) {
            this.formView.responsiveClassInput.selectedValue = selectedResponsiveClass.toString();
            this.formView.responsiveClassInput.buttonView.set({ label: selectedResponsiveClass.toString() });
        } else {
            this.formView.responsiveClassInput.selectedValue = '';
            this.formView.responsiveClassInput.buttonView.set({ label: 'Responsive class' });
        }

        // Show the form in the balloon
        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });

        this.formView.focus();
    }

    _hideUI() {
        // Reset the dropdown and input field to defaults
        this.formView.dropdown.selectedValue = null;
        this.formView.dropdown.buttonView.set({ label: 'Type' });
        this.formView.childCountInput.selectedValue = '';
        this.formView.childCountInput.buttonView.set({ label: 'Columns' });
        this.formView.responsiveClassInput.selectedValue = '';
        this.formView.responsiveClassInput.buttonView.set({ label: 'Responsive class' });

        // Remove the form from the balloon
        this._balloon.remove(this.formView);
        this.editor.editing.view.focus();
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;

        return {
            target: view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange())
        };
    }

}
