(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["wxt_panel"] = factory();
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js
const PanelClasses = [
    'primary',
    'default',
    'default well',
    'info',
    'success',
    'danger',
    'warning'
];
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js



class InsertPanelCommand extends delegated_corefrom_dll_reference_CKEditor5.Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new panel
     * @param {String} panelClass the panel type to create
     */
    execute(panelClass, existingPanel) {
        const { model } = this.editor;
        if (existingPanel !== null && existingPanel !== 'undefined') {
            // Existing panel found so we update
            model.change((writer) => {
                updatePanel(writer, panelClass, existingPanel);
            });
        } else {
            // Creating new panel
            model.change((writer) => {
                let panel = getPanelTemplate(writer, panelClass);
                model.insertContent(createPanel(writer, panel));
            });
        }
    }

    /**
     * Triggered when selection changes. determines if the panel toolbar button should be 
     * enabled if the users selection is not inside an element that allows panels, disable
     * the button; otherwise it's active
     */
    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        const panelClasses = PanelClasses;
        this.isEnabled = true;

        panelClasses.forEach(c => {
            if (model.schema.findAllowedParent(
                    selection.getFirstPosition(),
                    'panel-' + c,
                ) === null) {
                this.isEnabled = false;
            }
        });
    }
}

/**
 * createPanel
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {String} panelClass - the chosen panel type to create
 * 
 * @returns {Element} panel - the new panel with title and body
 */
function createPanel(writer, panel) {
    for (let child of panel.getChildren()) {
        if (child.name.startsWith('panelHeading-')) {
            for (let c of child.getChildren()) {
                if (c.name.startsWith('panelTitle-')) {
                    writer.insertText('Panel title', c)
                }
            }
        } else if (child.name.startsWith('panelBody-')) {
            const placeholderText = writer.createElement('paragraph');
            writer.append(placeholderText, child);
            writer.insertText('Panel body', placeholderText);
        }
    }
    return panel;
}

/**
 * updatePanel
 * 
 * @param {Writer} writer - the writer for the existing editor
 * @param {Element} panel - the template of a panel
 * @param {Element} existingPanel - the existing panel that we are replacing
 * @returns {Element} panel - the new panel with title and body
 */
function updatePanel(writer, panel, existingPanel) {
    // Get existing content from existing panel
    for (let child of existingPanel.getChildren()) {
        if (child.name.startsWith('panelHeading-')) {
            writer.rename(child, 'panelHeading-' + panel);
            for (let c of child.getChildren()) {
                if (c.name.startsWith('panelTitle-')) {
                    writer.rename(c, 'panelTitle-' + panel);
                }
            }
        } else if (child.name.startsWith('panelBody-')) {
            writer.rename(child, 'panelBody-' + panel);
        }
    }
    writer.rename(existingPanel, 'panel-' + panel)

    return existingPanel;
}

/**
 * getPanelTemplate
 * 
 * @param {Writer} writer - the document writer
 * @param {String} panelClass - the panel type we're creating
 * @returns {Element} panel - the template of a panel of the given type
 */
function getPanelTemplate(writer, panelClass) {
    const panel = writer.createElement('panel-' + panelClass);
    const panelHeader = writer.createElement('panelHeading-' + panelClass);
    const panelTitle = writer.createElement('panelTitle-' + panelClass);
    const panelBody = writer.createElement('panelBody-' + panelClass);

    writer.append(panelTitle, panelHeader);
    writer.append(panelHeader, panel);
    writer.append(panelBody, panel);

    return panel;
}
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/panelediting.js






class PanelEditing extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [delegated_widgetfrom_dll_reference_CKEditor5.Widget];
    }

    init() {
        this.panelClasses = PanelClasses;

        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertPanel',
            new InsertPanelCommand(this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;
        // Loop through available panel classes and create schema entries for 
        // panel, panel heading, panel title, panel body.
        // Would be nice to be able to have a generic panel shema entry and apply
        // styling class programmatically based on user input
        this.panelClasses.forEach(c => {
            schema.register('panel-' + c, {
                isObject: true,
                allowWhere: '$block',
            });
            schema.register('panelHeading-' + c, {
                isLimit: true,
                allowIn: 'panel-' + c,
                allowContentOf: '$block',
                allowChildren: 'panelTitle-' + c
            });
            schema.register('panelTitle-' + c, {
                isLimit: true,
                allowIn: 'panelHeading-' + c,
                allowContentOf: '$block',
            });
            schema.register('panelBody-' + c, {
                isLimit: true,
                allowIn: 'panel-' + c,
                allowContentOf: '$root',
            });
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        // Loop through available panel classes and create conversions for each panel type.
        // Would be nice to have a generic <section class="panel"> converter and add styling
        // classes programmatically.  
        this.panelClasses.forEach(c => {
            conversion.for('upcast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: ['panel', 'panel-' + c],
                },
                converterPriority: 'high'
            });

            conversion.for('upcast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'panelTitle-' + c,
                view: {
                    name: 'h3',
                    classes: 'panel-title',
                },
                converterPriority: 'high'
            });
            conversion.for('upcast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: 'high'
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: ['panel', 'panel-' + c],
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: {
                    name: 'h3',
                    classes: 'panel-title',
                },
                converterPriority: 'high'
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: 'high'
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panel-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const section = viewWriter.createContainerElement('section', {
                        class: 'panel panel-' + c,
                    });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(section, viewWriter, { label: c + ' panel' });
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const h3 = viewWriter.createEditableElement('h3', {
                        class: 'panel-title',
                    });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(h3, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const header = viewWriter.createEditableElement('header', {
                        class: 'panel-header',
                    });
                    return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(header, viewWriter);
                },
                converterPriority: 'high'
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div', {
                        class: 'panel-body',
                    });
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/panelview.js





/*
    TODO: is there a better way to get selected value from a dropdown? 
    setting a new property to a member of a defined class feels wrong
*/
class FormView extends delegated_uifrom_dll_reference_CKEditor5.View {
    constructor(locale) {
        super(locale);

        this.panelClasses = PanelClasses;
        const dropdownItems = [];
        this.dropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(locale);
        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', delegated_corefrom_dll_reference_CKEditor5.icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', delegated_corefrom_dll_reference_CKEditor5.icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // Create the dropdown list from array of panel classes
        this.panelClasses.forEach(c => {
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/panelui.js





class PanelUI extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
        this.formView = this._createFormView();
        this.panelClasses = PanelClasses;
        editor.ui.componentFactory.add('panel', () => {
            const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();
            button.label = Drupal.t('Panel');
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/panel.js




class Panel extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [PanelEditing, PanelUI];
    }
}
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_panel/src/index.js


/* harmony default export */ const src = ({
    Panel: Panel,
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});