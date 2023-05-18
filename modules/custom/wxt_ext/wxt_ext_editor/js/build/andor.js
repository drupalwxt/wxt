(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["andor"] = factory();
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/insertandorcommand.js


class InsertAndOrCommand extends delegated_corefrom_dll_reference_CKEditor5.Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new Alert
     * 
     * @param {String} alertClass the alert type to create
     */
    execute(type) {
        const { model } = this.editor;

        model.change((writer) => {
            model.insertContent(createAndOr(writer, type));
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
        this.isEnabled = true;
        // If the selection is inside an and widget
        const selectionInAndWidget = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'and-wrapper',
        );
        // If the selection is inside an or widget
        const selectionInWidget = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'or-wrapper',
        );

        // If selection is inside an 'and' or an 'or' widget, 
        // do not allow adding another 
        if (selectionInWidget === null && selectionInAndWidget === null) {
            this.isEnabled = false;
        }
    }
}

/**
 * createAndOr
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {string} type - the type of widget to create
 * 
 * @returns {Element}  - And/Or widget
 */
function createAndOr(writer, type) {
    const wrapper = writer.createElement(type + '-wrapper');
    const col1 = writer.createElement(type + '-column');
    const col2 = writer.createElement(type + '-column');
    const heading1 = writer.createElement(type + '-heading1');
    const heading2 = writer.createElement(type + '-heading2');
    const cnj = writer.createElement(type + '-cnj');
    const col1Placeholder = writer.createElement('paragraph');
    const col2Placeholder = writer.createElement('paragraph');

    writer.append(col1, wrapper);
    writer.append(cnj, wrapper);
    writer.append(col2, wrapper);
    writer.append(heading1, col1);
    writer.append(heading2, col2);
    writer.append(col1Placeholder, col1);
    writer.append(col2Placeholder, col2);

    writer.insertText(Drupal.t('Header A'), heading1)
    writer.insertText(Drupal.t('Header B'), heading2)
    writer.insertText(Drupal.t('Content for header A'), col1Placeholder);
    writer.insertText(Drupal.t('Content for header B'), col2Placeholder);

    return wrapper;
}
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/types.js
const Types = ['and', 'or'];
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/andorediting.js






class AndOrEditing extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [delegated_widgetfrom_dll_reference_CKEditor5.Widget];
    }

    init() {
        this.widgetTypes = Types;
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertAndOr',
            new InsertAndOrCommand(this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        this.widgetTypes.forEach(type => {
            schema.register(type + '-wrapper', {
                inheritAllFrom: '$block'
            });
            schema.register(type + '-column', {
                inheritAllFrom: '$block',
                allowIn: type + '-wrapper',
                allowContentOf: '$root',
            });
            schema.register(type + '-heading1', {
                isLimit: true,
                allowIn: type + '-column',
                allowContentOf: '$block',
            });
            schema.register(type + '-heading2', {
                isLimit: true,
                allowIn: type + '-column',
                allowContentOf: '$block',
            });
            schema.register(type + '-cnj', {
                isLimit: true,
                allowIn: type + '-wrapper',
            });
            schema.addChildCheck((context, childDefinition) => {
                if (
                    context.endsWith(type + '-column') &&
                    childDefinition.name === type + '-wrapper'
                ) {
                    return false;
                }
            });
        })

    }

    _defineConverters() {
        const { conversion } = this.editor;

        this.widgetTypes.forEach(type => {
            conversion.for('upcast').elementToElement({
                model: type + '-wrapper',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-grd', 'flex-fw-xs', type + '-wdgt'],
                }
            });
            conversion.for('upcast').elementToElement({
                model: type + '-column',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-col', type + '-wdgt'],
                }
            });
            conversion.for('upcast').elementToElement({
                model: type + '-heading1',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading1', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: type + '-heading2',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading2', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: type + '-cnj',
                view: {
                    name: 'div',
                    classes: ['and-or', 'cnjnctn-' + type]
                }
            });

            conversion.for('dataDowncast').elementToElement({
                model: type + '-wrapper',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-grd', 'flex-fw-xs', type + '-wdgt'],
                }
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-column',
                view: {
                    name: 'div',
                    classes: ['cnjnctn-col', type + '-wdgt'],
                }
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-heading1',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading1', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-heading2',
                view: {
                    name: 'h4',
                    classes: ['mrgn-tp-sm', 'text-muted', 'heading2', type + '-wdgt']
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: type + '-cnj',
                view: {
                    name: 'div',
                    classes: ['and-or', 'cnjnctn-' + type]
                }
            });

            conversion.for('editingDowncast').elementToElement({
                model: type + '-wrapper',
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createContainerElement('div', { class: 'cnjnctn-grd flex-fw-xs ' + type + '-wdgt' });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(div, viewWriter);
                }
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-column',
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div', { class: 'cnjnctn-col ' + type + '-wdgt' });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(div, viewWriter);
                }
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-heading1',
                view: (modelElement, { writer: viewWriter }) => {
                    const h4 = viewWriter.createEditableElement('h4', { class: 'mrgn-tp-sm text-muted heading1 ' + type + '-wdgt' });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(h4, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-heading2',
                view: (modelElement, { writer: viewWriter }) => {
                    const h4 = viewWriter.createEditableElement('h4', { class: 'mrgn-tp-sm text-muted heading2 ' + type + '-wdgt' });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(h4, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: type + '-cnj',
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createContainerElement('div', { class: 'and-or cnjnctn-' + type });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(div, viewWriter);
                }
            });
        });
    }
}
// EXTERNAL MODULE: delegated ./ui.js from dll-reference CKEditor5.dll
var delegated_uifrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/ui.js");
// EXTERNAL MODULE: delegated ./utils.js from dll-reference CKEditor5.dll
var delegated_utilsfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/utils.js");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/andorview.js





/*
    TODO: is there a better way to get selected value from a dropdown? 
    setting a new property to a member of a defined class feels wrong
*/
class FormView extends delegated_uifrom_dll_reference_CKEditor5.View {
    constructor(locale) {
        super(locale);

        this.widgetTypes = Types;
        const dropdownItems = [];
        this.dropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(locale);
        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', delegated_corefrom_dll_reference_CKEditor5.icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', delegated_corefrom_dll_reference_CKEditor5.icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // create button for each alert class and add to the collection of buttons for the dropdown list 
        this.widgetTypes.forEach(c => {
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
            label: Drupal.t('Type'),
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/andorui.js




class AndOrUI extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
        this.formView = this._createFormView();

        editor.ui.componentFactory.add('andor', () => {
            const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();
            button.label = Drupal.t('And/Or');
            button.tooltip = true;
            button.withText = true;
            const command = editor.commands.get('insertAndOr');

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
            const type = formView.dropdown.selectedValue;

            if (type === null || typeof type == 'undefined') {
                // Possible to add validation message to ask a user to choose?
                return;
            }

            editor.execute('insertAndOr', type);
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

        this.formView.dropdown.buttonView.set({ label: Drupal.t('Type') })
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/andor.js




class AndOr extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [AndOrEditing, AndOrUI];
    }
}
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/andor/src/index.js


/* harmony default export */ const src = ({
    AndOr: AndOr,
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});