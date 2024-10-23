(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["wxt_alert"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "ckeditor5/src/core.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/core.js");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/ui.js");

/***/ }),

/***/ "ckeditor5/src/utils.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/utils.js");

/***/ }),

/***/ "ckeditor5/src/widget.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__("dll-reference CKEditor5.dll"))("./src/widget.js");

/***/ }),

/***/ "dll-reference CKEditor5.dll":
/***/ ((module) => {

"use strict";
module.exports = CKEditor5.dll;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

// EXTERNAL MODULE: delegated ./core.js from dll-reference CKEditor5.dll
var delegated_corefrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/core.js");
// EXTERNAL MODULE: delegated ./widget.js from dll-reference CKEditor5.dll
var delegated_widgetfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/widget.js");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js
const AlertClasses = [
    'info',
    'success',
    'danger',
    'warning'
];
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/insertalertcommand.js



class InsertAlertCommand extends delegated_corefrom_dll_reference_CKEditor5.Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new Alert
     * 
     * @param {String} alertClass the alert type to create
     * @param {Element} existingAlert the existing alert to update, if any
     * @param {String} headingLevel the heading level to use for the alert title
     */
    execute(alertClass, existingAlert, headingLevel = 'h3') {
        const { model } = this.editor;
        if (existingAlert !== null && existingAlert !== 'undefined') {
            // Existing alert found, so we update it
            model.change((writer) => {
                updateAlert(writer, alertClass, existingAlert, headingLevel);
            });
        } else {
            // Creating a new alert
            model.change((writer) => {
                let alert = getAlertTemplate(writer, alertClass, headingLevel);
                model.insertContent(createAlert(writer, alert));
            });
        }
    }

    /**
     * Triggered when selection changes. Determines if the alert toolbar button should be 
     * enabled. If the user's selection is not inside an element that allows alerts, disable
     * the button; otherwise, it's active.
     */
    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        const alertClasses = AlertClasses;
        this.isEnabled = true;

        alertClasses.forEach(c => {
            if (model.schema.findAllowedParent(
                    selection.getFirstPosition(),
                    'alert-' + c,
                ) === null) {
                this.isEnabled = false;
            }
        });
    }
}

/**
 * createAlert
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {Element} alert - the alert template
 * 
 * @returns {Element} Alert - the new alert with title and body
 */
function createAlert(writer, alert) {
    // Add placeholder text to the new alert widget
    for (let child of alert.getChildren()) {
        if (child.name.startsWith('alertTitle-')) {
            writer.insertText('Alert title', child);
        } else if (child.name.startsWith('alertBody-')) {
            const placeholderText = writer.createElement('paragraph');
            writer.append(placeholderText, child);
            writer.insertText('Alert body', placeholderText);
        }
    }
    return alert;
}

/**
 * updateAlert
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {String} alertClass - the alert type to update
 * @param {Element} existingAlert - the existing alert being updated
 * @param {String} headingLevel - the heading level to use for the alert title
 * @returns {Element} Alert - the updated alert
 */
function updateAlert(writer, alertClass, existingAlert, headingLevel) {
    // Get the existing content from the alert
    for (let child of existingAlert.getChildren()) {
        if (child.name.startsWith('alertTitle-')) {
            writer.rename(child, 'alertTitle-' + alertClass);
            writer.setAttribute('headingLevel', headingLevel, child);
        } else if (child.name.startsWith('alertBody-')) {
            writer.rename(child, 'alertBody-' + alertClass);
        }
    }
    writer.rename(existingAlert, 'alert-' + alertClass);

    return existingAlert;
}

/**
 * getAlertTemplate
 * 
 * @param {Writer} writer - the document writer
 * @param {String} alertClass - the alert type we're creating
 * @param {String} headingLevel - the heading level for the alert title
 * @returns {Element} alert - the template of an alert of the given type
 */
function getAlertTemplate(writer, alertClass, headingLevel) {
    const alert = writer.createElement('alert-' + alertClass);
    const alertTitle = writer.createElement('alertTitle-' + alertClass, { headingLevel });
    const alertBody = writer.createElement('alertBody-' + alertClass);

    writer.append(alertTitle, alert);
    writer.append(alertBody, alert);

    return alert;
}

;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/alertediting.js






class AlertEditing extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [delegated_widgetfrom_dll_reference_CKEditor5.Widget];
    }

    init() {
        this.alertClasses = AlertClasses;

        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertAlert',
            new InsertAlertCommand(this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        this.alertClasses.forEach(c => {
            schema.register('alert-' + c, {
                inheritAllFrom: '$block'
            });
            schema.register('alertTitle-' + c, {
                isLimit: true,
                allowContentOf: '$block',
                allowIn: 'alert-' + c,
                allowAttributes: ['headingLevel'], // Allow the heading level attribute
            });
            schema.register('alertBody-' + c, {
                isLimit: true,
                allowIn: 'alert-' + c,
                allowContentOf: '$root',
            });
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        this.alertClasses.forEach(c => {
            conversion.for('upcast').elementToElement({
                model: 'alert-' + c,
                view: {
                    name: 'section',
                    classes: ['alert', 'alert-' + c],
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: (viewElement, { writer: modelWriter }) => {
                    const headingLevel = viewElement.name.match(/^h[2-6]$/) ? viewElement.name : 'h3';
                    return modelWriter.createElement('alertTitle-' + c, { headingLevel });
                },
                view: {
                    name: /^(h2|h3|h4|h5|h6)$/,
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'alertBody-' + c,
                view: {
                    name: /^(div|p)$/,
                },
                converterPriority: 'high'
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'alert-' + c,
                view: {
                    name: 'section',
                    classes: ['alert', 'alert-' + c],
                },
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'alertTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const headingLevel = modelElement.getAttribute('headingLevel') || 'h3';
                    return viewWriter.createContainerElement(headingLevel);
                },
                converterPriority: 'high'
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'alertBody-' + c,
                view: {
                    name: 'div',
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'alert-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createContainerElement('section', { class: 'alert alert-' + c });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(div, viewWriter, { hasSelectionHandle: true });
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'alertTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const headingLevel = modelElement.getAttribute('headingLevel') || 'h3';
                    const heading = viewWriter.createEditableElement(headingLevel);
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(heading, viewWriter);
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'alertBody-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div');
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(div, viewWriter);
                },
                converterPriority: 'high'
            });
        });
    }
}

// EXTERNAL MODULE: delegated ./ui.js from dll-reference CKEditor5.dll
var delegated_uifrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/ui.js");
// EXTERNAL MODULE: delegated ./utils.js from dll-reference CKEditor5.dll
var delegated_utilsfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/utils.js");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/alertview.js





/*
    TODO: is there a better way to get selected value from a dropdown? 
    setting a new property to a member of a defined class feels wrong
*/
class FormView extends delegated_uifrom_dll_reference_CKEditor5.View {
    constructor(locale) {
        super(locale);

        this.alertClasses = AlertClasses;
        const dropdownItems = [];
        this.dropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(locale);
        this.headingDropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(locale);
        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();
        const headingItems = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', delegated_corefrom_dll_reference_CKEditor5.icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', delegated_corefrom_dll_reference_CKEditor5.icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // create button for each alert class and add to the collection of buttons for the dropdown list 
        this.alertClasses.forEach(c => {
            dropdownItems.push({
                type: 'button',
                model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        items.addMany(dropdownItems);
        (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(this.dropdown, items);

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
                model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
                    withText: true,
                    label: level.toUpperCase(),
                    value: level,
                })
            });
        });

        (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(this.headingDropdown, headingItems);

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

        (0,delegated_uifrom_dll_reference_CKEditor5.submitHandler)({
            view: this
        });
    }

    focus() {
        this.childViews.first.focus();
    }

    _createButton(label, icon, className) {
        const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();

        button.set({
            label,
            icon,
            tooltip: true,
            class: className
        });

        return button;
    }
}

;// CONCATENATED MODULE: ./icons/alert.svg
/* harmony default export */ const icons_alert = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg id=\"Layer_2\" xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"28\" viewBox=\"0 0 32 28\"><g id=\"Layer_1-2\"><path id=\"alert\" d=\"m31.75,25.22L17.61.92c-.72-1.23-2.51-1.23-3.23,0L.25,25.22c-.72,1.23.18,2.78,1.61,2.78h28.27c1.43,0,2.33-1.54,1.61-2.78Zm-15.75.81c-1.33,0-2.35-1.01-2.35-2.27s1.02-2.33,2.35-2.33,2.35,1.04,2.35,2.33-1.05,2.27-2.35,2.27Zm2.66-17.16l-.96,9.98c-.04.51-.52.73-1.4.73h-.61c-.87,0-1.35-.23-1.4-.73l-.96-9.98v-.63c0-.51.52-.78,1.35-.78h2.62c.83,0,1.35.28,1.35.78v.63Z\" stroke-width=\"0\"/></g></svg>");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/alertui.js






class AlertUI extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
        this.formView = this._createFormView();
        this.alertClasses = AlertClasses;
        editor.ui.componentFactory.add('alert', () => {
            const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();
            button.label = Drupal.t('Alert');
            button.icon = icons_alert;
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

        (0,delegated_uifrom_dll_reference_CKEditor5.clickOutsideHandler)({
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

;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/alert.js




class Alert extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [AlertEditing, AlertUI];
    }
}
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/index.js
/**
 * @file The build process always expects an index.js file. Anything exported
 * here will be recognized by CKEditor 5 as an available plugin. Multiple
 * plugins can be exported in this one file.
 *
 * I.e. this file's purpose is to make plugin(s) discoverable.
 */
// cSpell:ignore simplebox



/* harmony default export */ const src = ({
    Alert: Alert,
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});