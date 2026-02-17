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

/***/ "./icons/panel.svg":
/*!*************************!*\
  !*** ./icons/panel.svg ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?><svg id=\"Layer_2\" xmlns=\"http://www.w3.org/2000/svg\" width=\"50\" height=\"30\" viewBox=\"0 0 50 30\"><g id=\"Layer_1-2\"><path id=\"panel\" d=\"m0,0v30h50V0H0Zm2.98,2.93h19.52v4.56H2.98V2.93Zm44.04,24.29H2.98V10.49h44.04v16.73Z\" stroke-width=\"0\"/></g></svg>");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js":
/*!******************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InsertPanelCommand)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");
/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./panelcssclasses */ "./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js");



class InsertPanelCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {

    /**
     * Triggered when a user clicks the 'save' button on the ContextualBalloon
     * to add a new panel
     * @param {String} panelClass the panel type to create
     */
    execute(panelClass, existingPanel, headingLevel = 'h3') {
        const { model } = this.editor;
        if (existingPanel !== null && existingPanel !== 'undefined') {
            // Existing panel found so we update
            model.change((writer) => {
                updatePanel(writer, panelClass, existingPanel, headingLevel);
            });
        } else {
            // Creating new panel
            model.change((writer) => {
                let panel = getPanelTemplate(writer, panelClass, headingLevel);
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
        const panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_1__.PanelClasses;
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
function updatePanel(writer, panelClass, existingPanel, headingLevel = 'h3') {
    // Get existing content from existing panel
    for (let child of existingPanel.getChildren()) {
        if (child.name.startsWith('panelHeading-')) {
            writer.rename(child, 'panelHeading-' + panelClass);
            for (let c of child.getChildren()) {
                if (c.name.startsWith('panelTitle-')) {
                    writer.rename(c, 'panelTitle-' + panelClass);
                    writer.setAttribute('headingLevel', headingLevel, c);
                }
            }
        } else if (child.name.startsWith('panelBody-')) {
            writer.rename(child, 'panelBody-' + panelClass);
        }
    }
    writer.rename(existingPanel, 'panel-' + panelClass)

    return existingPanel;
}

/**
 * getPanelTemplate
 * 
 * @param {Writer} writer - the document writer
 * @param {String} panelClass - the panel type we're creating
 * @returns {Element} panel - the template of a panel of the given type
 */
function getPanelTemplate(writer, panelClass, headingLevel = 'h3') {
    const panel = writer.createElement('panel-' + panelClass);
    const panelHeader = writer.createElement('panelHeading-' + panelClass);
    const panelTitle = writer.createElement('panelTitle-' + panelClass, { headingLevel });
    const panelBody = writer.createElement('panelBody-' + panelClass);

    writer.append(panelTitle, panelHeader);
    writer.append(panelHeader, panel);
    writer.append(panelBody, panel);

    return panel;
}

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panel.js":
/*!*****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panel.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Panel)
/* harmony export */ });
/* harmony import */ var _panelediting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panelediting */ "./js/ckeditor5_plugins/wxt_panel/src/panelediting.js");
/* harmony import */ var _panelui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./panelui */ "./js/ckeditor5_plugins/wxt_panel/src/panelui.js");
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");




class Panel extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.Plugin {
    static get requires() {
        return [_panelediting__WEBPACK_IMPORTED_MODULE_0__["default"], _panelui__WEBPACK_IMPORTED_MODULE_1__["default"]];
    }
}

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js":
/*!***************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PanelClasses: () => (/* binding */ PanelClasses)
/* harmony export */ });
const PanelClasses = [
    'primary',
    'default',
    'default-well',
    'info',
    'success',
    'danger',
    'warning'
];

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelediting.js":
/*!************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelediting.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PanelEditing)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");
/* harmony import */ var ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/widget */ "ckeditor5/src/widget.js");
/* harmony import */ var _insertpanelcommand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./insertpanelcommand */ "./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js");
/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panelcssclasses */ "./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js");






class PanelEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {
    static get requires() {
        return [ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.Widget];
    }

    init() {
        this.panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__.PanelClasses;

        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertPanel',
            new _insertpanelcommand__WEBPACK_IMPORTED_MODULE_2__["default"](this.editor),
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        // Loop through available panel classes and create schema entries for 
        // panel, panel heading, panel title, panel body.
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
                allowAttributes: ['headingLevel'], // Allow the heading level attribute
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

        this.panelClasses.forEach(c => {
            // Handle special case for "default-well" class
            const castingClasses = (c === 'default-well') 
                ? ['panel', 'panel-default', 'well'] 
                : ['panel', 'panel-' + c];

            let convPriority = (c === 'default-well') ? 'high' : 'normal';

            // Upcast converters
            conversion.for('upcast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: castingClasses,
                },
                converterPriority: convPriority
            });

            conversion.for('upcast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: convPriority
            });

            conversion.for('upcast').elementToElement({
                model: (viewElement, { writer: modelWriter }) => {
                    const headingLevel = viewElement.name.match(/^h[2-6]$/) ? viewElement.name : 'h3';
                    return modelWriter.createElement('panelTitle-' + c, { headingLevel });
                },
                view: {
                    name: /^(h2|h3|h4|h5|h6)$/,
                    classes: 'panel-title',
                },
                converterPriority: convPriority
            });

            conversion.for('upcast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: convPriority
            });

            // Data Downcast converters
            conversion.for('dataDowncast').elementToElement({
                model: 'panel-' + c,
                view: {
                    name: 'section',
                    classes: castingClasses,
                },
                converterPriority: convPriority
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: {
                    name: 'header',
                    classes: 'panel-heading',
                },
                converterPriority: convPriority
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const headingLevel = modelElement.getAttribute('headingLevel') || 'h3';
                    return viewWriter.createContainerElement(headingLevel, {
                        class: 'panel-title'
                    });
                },
                converterPriority: convPriority
            });

            conversion.for('dataDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: {
                    name: 'div',
                    classes: 'panel-body',
                },
                converterPriority: convPriority
            });

            // Editing Downcast converters
            conversion.for('editingDowncast').elementToElement({
                model: 'panel-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const section = viewWriter.createContainerElement('section', {
                        class: castingClasses.join(' '),
                    });
                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidget)(section, viewWriter, { label: `${c} panel`, hasSelectionHandle: true });
                },
                converterPriority: convPriority
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panelTitle-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const headingLevel = modelElement.getAttribute('headingLevel') || 'h3';
                    const heading = viewWriter.createEditableElement(headingLevel, {
                        class: 'panel-title'
                    });
                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(heading, viewWriter);
                },
                converterPriority: convPriority
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panelHeading-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const header = viewWriter.createEditableElement('header', {
                        class: 'panel-heading',
                    });
                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(header, viewWriter);
                },
                converterPriority: convPriority
            });

            conversion.for('editingDowncast').elementToElement({
                model: 'panelBody-' + c,
                view: (modelElement, { writer: viewWriter }) => {
                    const div = viewWriter.createEditableElement('div', {
                        class: 'panel-body',
                    });
                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(div, viewWriter);
                },
                converterPriority: convPriority
            });
        });
    }
}


/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelui.js":
/*!*******************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelui.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PanelUI)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");
/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/ui */ "ckeditor5/src/ui.js");
/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./panelcssclasses */ "./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js");
/* harmony import */ var _panelview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panelview */ "./js/ckeditor5_plugins/wxt_panel/src/panelview.js");
/* harmony import */ var _icons_panel_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../icons/panel.svg */ "./icons/panel.svg");






class PanelUI extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ContextualBalloon);
        this.formView = this._createFormView();
        this.panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_2__.PanelClasses;
        editor.ui.componentFactory.add('panel', () => {
            const button = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ButtonView();
            button.label = Drupal.t('Panel');
            button.icon = _icons_panel_svg__WEBPACK_IMPORTED_MODULE_4__["default"];
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
        const formView = new _panelview__WEBPACK_IMPORTED_MODULE_3__["default"](editor.locale);

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

        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.clickOutsideHandler)({
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

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelview.js":
/*!*********************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelview.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FormView)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/ui */ "ckeditor5/src/ui.js");
/* harmony import */ var ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/utils */ "ckeditor5/src/utils.js");
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");
/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panelcssclasses */ "./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js");





/*
    TODO: is there a better way to get selected value from a dropdown? 
    setting a new property to a member of a defined class feels wrong
*/
class FormView extends ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.View {
    constructor(locale) {
        super(locale);

        this.panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__.PanelClasses;
        const dropdownItems = [];
        this.dropdown = (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.createDropdown)(locale);
        this.headingDropdown = (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.createDropdown)(locale);
        const items = new ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__.Collection();
        const headingItems = new ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__.Collection();

        // Create save and cancel buttons
        this.saveButtonView = this._createButton('Save', ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';
        this.cancelButtonView = this._createButton('Cancel', ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        // Create the dropdown list from array of panel classes
        this.panelClasses.forEach(c => {
            dropdownItems.push({
                type: 'button',
                model: new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        // Add items to Panel type dropdown.
        items.addMany(dropdownItems);
        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.addListToDropdown)(this.dropdown, items);
        this.dropdown.buttonView.set({
            label: Drupal.t('Panel type'),
            withText: true
        });

        // Add items to Heading level dropdown.
        ['h2', 'h3', 'h4', 'h5'].forEach(level => {
            headingItems.add({
                type: 'button',
                model: new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.ViewModel({
                    withText: true,
                    label: level.toUpperCase(),
                    value: level
                })
            });
        });
        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.addListToDropdown)(this.headingDropdown, headingItems);

        this.headingDropdown.buttonView.set({
            label: Drupal.t('Heading level'),
            withText: true
        });

        // Store selected heading level
        this.headingDropdown.on('execute', eventinfo => {
            this.headingDropdown.selectedValue = eventinfo.source.value;
            this.headingDropdown.buttonView.set({ label: this.headingDropdown.selectedValue });
        });

        // Store the selected panel type from user selection
        this.dropdown.on('execute', eventinfo => {
            this.dropdown.selectedValue = eventinfo.source.value;
            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue })
        });


        // Collect child views and add them to the form
        this.childViews = this.createCollection([
            this.dropdown,
            this.headingDropdown,
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
        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.submitHandler)({
            view: this
        });
    }

    focus() {
        this.childViews.first.focus();
    }

    _createButton(label, icon, className) {
        const button = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.ButtonView();

        button.set({
            label,
            icon,
            tooltip: true,
            class: className
        });

        return button;
    }
}

/***/ }),

/***/ "ckeditor5/src/core.js":
/*!************************************************************!*\
  !*** delegated ./core.js from dll-reference CKEditor5.dll ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/core.js");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/*!**********************************************************!*\
  !*** delegated ./ui.js from dll-reference CKEditor5.dll ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/ui.js");

/***/ }),

/***/ "ckeditor5/src/utils.js":
/*!*************************************************************!*\
  !*** delegated ./utils.js from dll-reference CKEditor5.dll ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/utils.js");

/***/ }),

/***/ "ckeditor5/src/widget.js":
/*!**************************************************************!*\
  !*** delegated ./widget.js from dll-reference CKEditor5.dll ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ "dll-reference CKEditor5.dll"))("./src/widget.js");

/***/ }),

/***/ "dll-reference CKEditor5.dll":
/*!********************************!*\
  !*** external "CKEditor5.dll" ***!
  \********************************/
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/index.js ***!
  \*****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panel */ "./js/ckeditor5_plugins/wxt_panel/src/panel.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    Panel: _panel__WEBPACK_IMPORTED_MODULE_0__["default"],
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});