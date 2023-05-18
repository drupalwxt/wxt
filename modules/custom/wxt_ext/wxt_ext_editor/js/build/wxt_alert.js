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
     */
    execute(alertClass) {
        const { model } = this.editor;

        model.change((writer) => {
            model.insertContent(createAlert(writer, alertClass));
        });
    }

    /**
     * Triggered when selection changes. determines if the alert toolbar button should be 
     * enabled if the users selection is not inside an element that allows alerts, disable
     * the button; otherwise it's active
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
 * @param {String} alertClass - the chosen alert type to create
 * 
 * @returns {Element} Alert - the new alert with title and body
 */
function createAlert(writer, alertClass) {
    const alert = writer.createElement('alert-' + alertClass);
    const alertTitle = writer.createElement('alertTitle-' + alertClass);
    const alertBody = writer.createElement('alertBody-' + alertClass);
    const placeholderText = writer.createElement('paragraph');

    writer.append(alertTitle, alert);
    writer.append(alertBody, alert);
    writer.append(placeholderText, alertBody);

    writer.insertText('Alert title', alertTitle)
    writer.insertText('Alert body', placeholderText);

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
            });
            schema.register('alertBody-' + c, {
                isLimit: true,
                allowIn: 'alert-' + c,
                allowContentOf: '$root',
            });
            schema.addChildCheck((context, childDefinition) => {
                if (
                    context.endsWith('alertBody-' + c) &&
                    childDefinition.name === 'alert-' + c
                ) {
                    return false;
                }
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
                model: 'alertTitle-' + c,
                view: {
                    name: 'h3'
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'alertBody-' + c,
                view: {
                    name: 'div',
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
                view: {
                    name: 'h3'
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
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(div, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'alertTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const h3 = viewWriter.createEditableElement('h3');
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(h3, viewWriter);
                },
                converterPriority: 'high'
            }, );
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
        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', delegated_corefrom_dll_reference_CKEditor5.icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', delegated_corefrom_dll_reference_CKEditor5.icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // create button for each alert class and add to the collection of buttons for the dropdown list 
        this.alertClasses.forEach(c => {
            dropdownItems.push({
                type: 'button',
                model: new delegated_uifrom_dll_reference_CKEditor5.Model({
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_alert/src/alertui.js




class AlertUI extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
        this.formView = this._createFormView();

        editor.ui.componentFactory.add('alert', () => {
            const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();
            button.label = Drupal.t('Alert');
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

            editor.execute('insertAlert', alerttype);
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