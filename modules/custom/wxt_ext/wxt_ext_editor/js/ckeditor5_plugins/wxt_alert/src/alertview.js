import {
    View,
    ButtonView,
    submitHandler,
    createDropdown,
    addListToDropdown,
    ViewModel,
} from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils';
import { icons } from 'ckeditor5/src/core';
import { AlertClasses } from './alertcssclasses';

/*
    TODO: is there a better way to get selected value from a dropdown? 
    setting a new property to a member of a defined class feels wrong
*/
export default class FormView extends View {
    constructor(locale) {
        super(locale);

        this.alertClasses = AlertClasses;
        const dropdownItems = [];
        this.dropdown = createDropdown(locale);
        this.headingDropdown = createDropdown(locale);
        const items = new Collection();
        const headingItems = new Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // create button for each alert class and add to the collection of buttons for the dropdown list 
        this.alertClasses.forEach(c => {
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
            label: Drupal.t('Alert type'),
            withText: true
        });

        // Store the selected Alert type from user selection
        this.dropdown.on('execute', eventinfo => {
            this.dropdown.selectedValue = eventinfo.source.value;
            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue });
        });

        // Define heading levels (h2, h3, h4, etc.)
        ['h2', 'h3', 'h4', 'h5'].forEach(level => {
            headingItems.add({
                type: 'button',
                model: new ViewModel({
                    withText: true,
                    label: level.toUpperCase(),
                    value: level,
                })
            });
        });

        addListToDropdown(this.headingDropdown, headingItems);

        this.headingDropdown.buttonView.set({
            label: Drupal.t('Heading level'),
            withText: true
        });

        // Store the selected heading level from user selection
        this.headingDropdown.on('execute', eventinfo => {
            this.headingDropdown.selectedValue = eventinfo.source.value;
            this.headingDropdown.buttonView.set({ label: this.headingDropdown.selectedValue });
        });

        // Collect child views and add them to the form, including the heading dropdown
        this.childViews = this.createCollection([
            this.dropdown,
            this.headingDropdown, // Added heading dropdown to the form
            this.saveButtonView,
            this.cancelButtonView
        ]);

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck', 'ck-abbr-form'],
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
