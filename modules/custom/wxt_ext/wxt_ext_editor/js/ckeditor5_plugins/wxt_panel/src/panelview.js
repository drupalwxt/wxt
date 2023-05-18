import {
    View,
    ButtonView,
    submitHandler,
    createDropdown,
    addListToDropdown,
    Model
} from 'ckeditor5/src/ui';
import { Collection } from 'ckeditor5/src/utils'
import { icons } from 'ckeditor5/src/core';
import { PanelClasses } from './panelcssclasses';

/*
    TODO: is there a better way to get selected value from a dropdown? 
    setting a new property to a member of a defined class feels wrong
*/
export default class FormView extends View {
    constructor(locale) {
        super(locale);

        this.panelClasses = PanelClasses;
        const dropdownItems = [];
        this.dropdown = createDropdown(locale);
        const items = new Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // Create the dropdown list from array of panel classes
        this.panelClasses.forEach(c => {
            dropdownItems.push({
                type: 'button',
                model: new Model({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        items.addMany(dropdownItems);
        addListToDropdown(this.dropdown, items);
        this.dropdown.buttonView.set({
            label: Drupal.t('Panel type'),
            withText: true
        });

        // Store the selected panel type from user selection
        this.dropdown.on('execute', eventinfo => {
            this.dropdown.selectedValue = eventinfo.source.value;
            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue })
        });


        // Collect child views and add them to the form
        this.childViews = this.createCollection([
            this.dropdown,
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