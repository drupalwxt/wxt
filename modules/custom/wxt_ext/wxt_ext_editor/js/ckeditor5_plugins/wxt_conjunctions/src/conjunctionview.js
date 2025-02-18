import {
    View,
    ButtonView,
    submitHandler,
    createDropdown,
    addListToDropdown,
    ViewModel
} from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import { icons } from 'ckeditor5/src/core';
import { ConjunctionClasses } from './conjunctioncssclasses';
import { ResponsiveClasses } from './responsiveclasses';

export default class FormView extends View {
    constructor(locale) {
        super(locale);

        // Conjunction type (and/or).
        this.conjunctionClasses = ConjunctionClasses;
        const dropdownItems = [];
        this.dropdown = createDropdown(locale);
        this.childCountInput = this._createInputField();

        const items = new Collection();

        // Create dropdown items for conjunction types.
        this.conjunctionClasses.forEach(c => {
            dropdownItems.push({
                type: 'button',
                model: new ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        items.addMany(dropdownItems);
        addListToDropdown(this.dropdown, items);

        this.dropdown.buttonView.set({
            label: 'Type',
            withText: true
        });

        this.dropdown.on('execute', (evt) => {
            this.dropdown.selectedValue = evt.source.value;
            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue });
        });

        // Responsive classes (xs/sm/md/lg).
        this.responsiveClasses = ResponsiveClasses;
        const responsiveClassItems = [];
        this.dropdownResponsive = createDropdown(locale);
        this.responsiveClassInput = this._createResponsiveClassDropdown();

        const responsiveItems = new Collection();

        // Create dropdown items for conjunction types.
        this.responsiveClasses.forEach(c => {
            responsiveClassItems.push({
                type: 'button',
                model: new ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        responsiveItems.addMany(responsiveClassItems);
        addListToDropdown(this.dropdownResponsive, responsiveItems);

        this.dropdownResponsive.buttonView.set({
            label: 'Type',
            withText: true
        });

        this.dropdownResponsive.on('execute', (evt) => {
            this.dropdownResponsive.selectedValue = evt.source.value;
            this.dropdownResponsive.buttonView.set({ label: this.dropdownResponsive.selectedValue });
        });

        // Rest of form.
        this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';

        this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        this.childViews = this.createCollection([
            this.dropdown,
            this.responsiveClassInput,
            this.childCountInput,
            this.saveButtonView,
            this.cancelButtonView
        ]);

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck', 'ck-conjunction-form'],
                tabindex: '-1'
            },
            children: this.childViews
        });
    }

    render() {
        super.render();

        submitHandler({
            view: this
        });
    }

    focus() {
        this.childViews.first.focus();
    }

    _createResponsiveClassDropdown() {
        const dropdown = createDropdown(this.locale);
        const items = new Collection();

        // Add options for responsive classes (xs/sm/md/lg).
        this.responsiveClasses.forEach((c) => {
            items.add({
                type: 'button',
                model: new ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        addListToDropdown(dropdown, items);

        dropdown.buttonView.set({
            label: 'Responsive class',
            withText: true
        });

        dropdown.on('execute', (evt) => {
            dropdown.selectedValue = evt.source.value;
            dropdown.buttonView.set({ label: evt.source.value });
        });

        return dropdown;
    }

    _createInputField() {
        const dropdown = createDropdown(this.locale);
        const items = new Collection();

        // Add options for the number of columns (2 to 6).
        [2, 3, 4, 5, 6].forEach((value) => {
            items.add({
                type: 'button',
                model: new ViewModel({
                    withText: true,
                    label: value.toString(),
                    value: value,
                }),
            });
        });

        addListToDropdown(dropdown, items);

        dropdown.buttonView.set({
            label: 'Columns',
            withText: true,
        });

        // Store the selected value in the dropdown.
        dropdown.on('execute', (evt) => {
            dropdown.selectedValue = evt.source.value;
            dropdown.buttonView.set({ label: evt.source.value.toString() });
        });

        return dropdown;
    }

    _createButton(label, icon, className) {
        const button = new ButtonView();

        button.set({
            label,
            icon,
            tooltip: true,
            class: className
        });

        return button;
    }
}
