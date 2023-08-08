/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
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

/***/ "./js/ckeditor5_plugins/wxt_panel/src/index.js":
/*!*****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _panel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panel */ \"./js/ckeditor5_plugins/wxt_panel/src/panel.js\");\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    Panel: _panel__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n});\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/index.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js":
/*!******************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ InsertPanelCommand)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./panelcssclasses */ \"./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js\");\n\n\n\nclass InsertPanelCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {\n\n    /**\n     * Triggered when a user clicks the 'save' button on the ContextualBalloon\n     * to add a new panel\n     * @param {String} panelClass the panel type to create\n     */\n    execute(panelClass, existingPanel) {\n        const { model } = this.editor;\n        if (existingPanel !== null && existingPanel !== 'undefined') {\n            // Existing panel found so we update\n            model.change((writer) => {\n                updatePanel(writer, panelClass, existingPanel);\n            });\n        } else {\n            // Creating new panel\n            model.change((writer) => {\n                let panel = getPanelTemplate(writer, panelClass);\n                model.insertContent(createPanel(writer, panel));\n            });\n        }\n    }\n\n    /**\n     * Triggered when selection changes. determines if the panel toolbar button should be \n     * enabled if the users selection is not inside an element that allows panels, disable\n     * the button; otherwise it's active\n     */\n    refresh() {\n        const { model } = this.editor;\n        const { selection } = model.document;\n        const panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_1__.PanelClasses;\n        this.isEnabled = true;\n\n        panelClasses.forEach(c => {\n            if (model.schema.findAllowedParent(\n                    selection.getFirstPosition(),\n                    'panel-' + c,\n                ) === null) {\n                this.isEnabled = false;\n            }\n        });\n    }\n}\n\n/**\n * createPanel\n * \n * @param {Writer} writer - the writer for the existing editor\n * @param {String} panelClass - the chosen panel type to create\n * \n * @returns {Element} panel - the new panel with title and body\n */\nfunction createPanel(writer, panel) {\n    for (let child of panel.getChildren()) {\n        if (child.name.startsWith('panelHeading-')) {\n            for (let c of child.getChildren()) {\n                if (c.name.startsWith('panelTitle-')) {\n                    writer.insertText('Panel title', c)\n                }\n            }\n        } else if (child.name.startsWith('panelBody-')) {\n            const placeholderText = writer.createElement('paragraph');\n            writer.append(placeholderText, child);\n            writer.insertText('Panel body', placeholderText);\n        }\n    }\n    return panel;\n}\n\n/**\n * updatePanel\n * \n * @param {Writer} writer - the writer for the existing editor\n * @param {Element} panel - the template of a panel\n * @param {Element} existingPanel - the existing panel that we are replacing\n * @returns {Element} panel - the new panel with title and body\n */\nfunction updatePanel(writer, panel, existingPanel) {\n    // Get existing content from existing panel\n    for (let child of existingPanel.getChildren()) {\n        if (child.name.startsWith('panelHeading-')) {\n            writer.rename(child, 'panelHeading-' + panel);\n            for (let c of child.getChildren()) {\n                if (c.name.startsWith('panelTitle-')) {\n                    writer.rename(c, 'panelTitle-' + panel);\n                }\n            }\n        } else if (child.name.startsWith('panelBody-')) {\n            writer.rename(child, 'panelBody-' + panel);\n        }\n    }\n    writer.rename(existingPanel, 'panel-' + panel)\n\n    return existingPanel;\n}\n\n/**\n * getPanelTemplate\n * \n * @param {Writer} writer - the document writer\n * @param {String} panelClass - the panel type we're creating\n * @returns {Element} panel - the template of a panel of the given type\n */\nfunction getPanelTemplate(writer, panelClass) {\n    const panel = writer.createElement('panel-' + panelClass);\n    const panelHeader = writer.createElement('panelHeading-' + panelClass);\n    const panelTitle = writer.createElement('panelTitle-' + panelClass);\n    const panelBody = writer.createElement('panelBody-' + panelClass);\n\n    writer.append(panelTitle, panelHeader);\n    writer.append(panelHeader, panel);\n    writer.append(panelBody, panel);\n\n    return panel;\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panel.js":
/*!*****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panel.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Panel)\n/* harmony export */ });\n/* harmony import */ var _panelediting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./panelediting */ \"./js/ckeditor5_plugins/wxt_panel/src/panelediting.js\");\n/* harmony import */ var _panelui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./panelui */ \"./js/ckeditor5_plugins/wxt_panel/src/panelui.js\");\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n\n\n\n\nclass Panel extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.Plugin {\n    static get requires() {\n        return [_panelediting__WEBPACK_IMPORTED_MODULE_0__[\"default\"], _panelui__WEBPACK_IMPORTED_MODULE_1__[\"default\"]];\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/panel.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js":
/*!***************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PanelClasses\": () => (/* binding */ PanelClasses)\n/* harmony export */ });\nconst PanelClasses = [\n    'primary',\n    'default',\n    'default-well',\n    'info',\n    'success',\n    'danger',\n    'warning'\n];\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelediting.js":
/*!************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelediting.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ PanelEditing)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/widget */ \"ckeditor5/src/widget.js\");\n/* harmony import */ var _insertpanelcommand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./insertpanelcommand */ \"./js/ckeditor5_plugins/wxt_panel/src/insertpanelcommand.js\");\n/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panelcssclasses */ \"./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js\");\n\n\n\n\n\nclass PanelEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n    static get requires() {\n        return [ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.Widget];\n    }\n\n    init() {\n        this.panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__.PanelClasses;\n\n        this._defineSchema();\n        this._defineConverters();\n        this.editor.commands.add(\n            'insertPanel',\n            new _insertpanelcommand__WEBPACK_IMPORTED_MODULE_2__[\"default\"](this.editor),\n        );\n    }\n\n    _defineSchema() {\n        const schema = this.editor.model.schema;\n        // Loop through available panel classes and create schema entries for \n        // panel, panel heading, panel title, panel body.\n        // Would be nice to be able to have a generic panel shema entry and apply\n        // styling class programmatically based on user input\n        this.panelClasses.forEach(c => {\n            schema.register('panel-' + c, {\n                isObject: true,\n                allowWhere: '$block',\n            });\n            schema.register('panelHeading-' + c, {\n                isLimit: true,\n                allowIn: 'panel-' + c,\n                allowContentOf: '$block',\n                allowChildren: 'panelTitle-' + c\n            });\n            schema.register('panelTitle-' + c, {\n                isLimit: true,\n                allowIn: 'panelHeading-' + c,\n                allowContentOf: '$block',\n            });\n            schema.register('panelBody-' + c, {\n                isLimit: true,\n                allowIn: 'panel-' + c,\n                allowContentOf: '$root',\n            });\n        });\n    }\n\n    _defineConverters() {\n        const { conversion } = this.editor;\n\n        // Loop through available panel classes and create conversions for each panel type.\n        // Would be nice to have a generic <section class=\"panel\"> converter and add styling\n        // classes programmatically.  \n        this.panelClasses.forEach(c => {\n            // Default well panels get converted into default panels without a higher converter priority. \n            // Also CKEditor doesnt seem to like spaces in class names so \"default well\" cannot simply be \n            // appended to the string like other classes. We need to fix the castingClasses array for default well panels\n            // See https://www.drupal.org/project/wxt/issues/3362702\n            const castingClasses = ['panel', 'panel-' + c]\n            let convPriority = 'normal';\n            if (c == 'default-well') {\n                castingClasses.pop();\n                castingClasses.push('panel-default');\n                castingClasses.push('well');\n                convPriority = 'high';\n            }\n\n            conversion.for('upcast').elementToElement({\n                model: 'panel-' + c,\n                view: {\n                    name: 'section',\n                    classes: castingClasses,\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('upcast').elementToElement({\n                model: 'panelHeading-' + c,\n                view: {\n                    name: 'header',\n                    classes: 'panel-heading',\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('upcast').elementToElement({\n                model: 'panelTitle-' + c,\n                view: {\n                    name: 'h3',\n                    classes: 'panel-title',\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('upcast').elementToElement({\n                model: 'panelBody-' + c,\n                view: {\n                    name: 'div',\n                    classes: 'panel-body',\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('dataDowncast').elementToElement({\n                model: 'panel-' + c,\n                view: {\n                    name: 'section',\n                    classes: castingClasses,\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('dataDowncast').elementToElement({\n                model: 'panelHeading-' + c,\n                view: {\n                    name: 'header',\n                    classes: 'panel-heading',\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('dataDowncast').elementToElement({\n                model: 'panelTitle-' + c,\n                view: {\n                    name: 'h3',\n                    classes: 'panel-title',\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('dataDowncast').elementToElement({\n                model: 'panelBody-' + c,\n                view: {\n                    name: 'div',\n                    classes: 'panel-body',\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('editingDowncast').elementToElement({\n                model: 'panel-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const section = viewWriter.createContainerElement('section', {\n                        class: castingClasses.join(\" \"),\n                    });\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidget)(section, viewWriter, { label: c + ' panel', hasSelectionHandle: true });\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('editingDowncast').elementToElement({\n                model: 'panelTitle-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const h3 = viewWriter.createEditableElement('h3', {\n                        class: 'panel-title',\n                    });\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(h3, viewWriter);\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('editingDowncast').elementToElement({\n                model: 'panelHeading-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const header = viewWriter.createEditableElement('header', {\n                        class: 'panel-heading',\n                    });\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(header, viewWriter);\n                },\n                converterPriority: convPriority\n            });\n            conversion.for('editingDowncast').elementToElement({\n                model: 'panelBody-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const div = viewWriter.createEditableElement('div', {\n                        class: 'panel-body',\n                    });\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(div, viewWriter);\n                },\n                converterPriority: convPriority\n            });\n        });\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/panelediting.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelui.js":
/*!*******************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelui.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ PanelUI)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/ui */ \"ckeditor5/src/ui.js\");\n/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./panelcssclasses */ \"./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js\");\n/* harmony import */ var _panelview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panelview */ \"./js/ckeditor5_plugins/wxt_panel/src/panelview.js\");\n/* harmony import */ var _icons_panel_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../icons/panel.svg */ \"./icons/panel.svg\");\n\n\n\n\n\n\nclass PanelUI extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n    init() {\n        const editor = this.editor;\n        this._balloon = this.editor.plugins.get(ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ContextualBalloon);\n        this.formView = this._createFormView();\n        this.panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_2__.PanelClasses;\n        editor.ui.componentFactory.add('panel', () => {\n            const button = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ButtonView();\n            button.label = Drupal.t('Panel');\n            button.icon = _icons_panel_svg__WEBPACK_IMPORTED_MODULE_4__[\"default\"];\n            button.tooltip = true;\n            button.withText = true;\n            const command = editor.commands.get('insertPanel');\n\n            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');\n            this.listenTo(button, 'execute', () => {\n                this._showUI();\n            });\n\n            return button;\n        });\n    }\n\n    _createFormView() {\n        const editor = this.editor;\n        const formView = new _panelview__WEBPACK_IMPORTED_MODULE_3__[\"default\"](editor.locale);\n\n        this.listenTo(formView, 'submit', () => {\n            const paneltype = formView.dropdown.selectedValue;\n\n            if (paneltype === null || typeof paneltype == 'undefined') {\n                // Possible to add validation message to ask a user to choose?\n                return;\n            }\n            let selectionAncestors = editor.model.document.selection.getFirstPosition().getAncestors();\n            let selectionIsAlert = false;\n            let selection = null;\n            // Traverse from the first inner tag to the root\n            selectionAncestors.forEach(node => {\n                // Check if the current selection is a panel widget\n                this.panelClasses.forEach(c => {\n                    if (node.name == 'panel-' + c) {\n                        // Alert widget found \n                        selection = node;\n                        selectionIsAlert = true;\n                    }\n                });\n            });\n\n            // If the selection is within a panel widget, update the selected widget; otherwise create a new one\n            if (selectionIsAlert) {\n                editor.execute('insertPanel', paneltype, selection);\n            } else {\n                editor.execute('insertPanel', paneltype, null);\n            }\n            this._hideUI();\n        });\n\n        this.listenTo(formView, 'cancel', () => {\n            this._hideUI();\n        });\n\n        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.clickOutsideHandler)({\n            emitter: formView,\n            activator: () => this._balloon.visibleView === formView,\n            contextElements: [this._balloon.view.element],\n            callback: () => this._hideUI()\n        });\n\n        return formView;\n    }\n\n    _showUI() {\n        this._balloon.add({\n            view: this.formView,\n            position: this._getBalloonPositionData()\n        });\n        this.formView.focus();\n    }\n\n    _hideUI() {\n        this.formView.dropdown.selectedValue = null;\n\n        this.formView.dropdown.buttonView.set({ label: Drupal.t('Panel type') })\n        this.formView.element.reset();\n        this._balloon.remove(this.formView);\n        this.editor.editing.view.focus();\n    }\n\n    _getBalloonPositionData() {\n        const view = this.editor.editing.view;\n        const viewDocument = view.document;\n        let target = null;\n        target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());\n\n        return {\n            target\n        };\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/panelui.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_panel/src/panelview.js":
/*!*********************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_panel/src/panelview.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ FormView)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/ui */ \"ckeditor5/src/ui.js\");\n/* harmony import */ var ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/utils */ \"ckeditor5/src/utils.js\");\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./panelcssclasses */ \"./js/ckeditor5_plugins/wxt_panel/src/panelcssclasses.js\");\n\n\n\n\n\n/*\n    TODO: is there a better way to get selected value from a dropdown? \n    setting a new property to a member of a defined class feels wrong\n*/\nclass FormView extends ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.View {\n    constructor(locale) {\n        super(locale);\n\n        this.panelClasses = _panelcssclasses__WEBPACK_IMPORTED_MODULE_3__.PanelClasses;\n        const dropdownItems = [];\n        this.dropdown = (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.createDropdown)(locale);\n        const items = new ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__.Collection();\n\n        // Create save and cancel buttons\n        this.saveButtonView = this._createButton('Save', ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.icons.check, 'ck-button-save');\n        this.saveButtonView.type = 'submit';\n        this.cancelButtonView = this._createButton('Cancel', ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.icons.cancel, 'ck-button-cancel');\n        this.cancelButtonView.delegate('execute').to(this, 'cancel');\n\n        // Create the dropdown list from array of panel classes\n        this.panelClasses.forEach(c => {\n            dropdownItems.push({\n                type: 'button',\n                model: new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.Model({\n                    withText: true,\n                    label: c,\n                    value: c\n                })\n            });\n        });\n\n        items.addMany(dropdownItems);\n        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.addListToDropdown)(this.dropdown, items);\n        this.dropdown.buttonView.set({\n            label: Drupal.t('Panel type'),\n            withText: true\n        });\n\n        // Store the selected panel type from user selection\n        this.dropdown.on('execute', eventinfo => {\n            this.dropdown.selectedValue = eventinfo.source.value;\n            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue })\n        });\n\n\n        // Collect child views and add them to the form\n        this.childViews = this.createCollection([\n            this.dropdown,\n            this.saveButtonView,\n            this.cancelButtonView\n        ]);\n\n        this.setTemplate({\n            tag: 'form',\n            attributes: {\n                class: ['ck', 'ck-abbr-form'],\n                tabindex: '-1'\n            },\n            children: this.childViews\n        });\n    }\n\n    render() {\n        super.render();\n        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.submitHandler)({\n            view: this\n        });\n    }\n\n    focus() {\n        this.childViews.first.focus();\n    }\n\n    _createButton(label, icon, className) {\n        const button = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.ButtonView();\n\n        button.set({\n            label,\n            icon,\n            tooltip: true,\n            class: className\n        });\n\n        return button;\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./js/ckeditor5_plugins/wxt_panel/src/panelview.js?");

/***/ }),

/***/ "./icons/panel.svg":
/*!*************************!*\
  !*** ./icons/panel.svg ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?><svg id=\\\"Layer_2\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" width=\\\"50\\\" height=\\\"30\\\" viewBox=\\\"0 0 50 30\\\"><g id=\\\"Layer_1-2\\\"><path id=\\\"panel\\\" d=\\\"m0,0v30h50V0H0Zm2.98,2.93h19.52v4.56H2.98V2.93Zm44.04,24.29H2.98V10.49h44.04v16.73Z\\\" stroke-width=\\\"0\\\"/></g></svg>\");\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/./icons/panel.svg?");

/***/ }),

/***/ "ckeditor5/src/core.js":
/*!************************************************************!*\
  !*** delegated ./core.js from dll-reference CKEditor5.dll ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/core.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/delegated_./core.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/*!**********************************************************!*\
  !*** delegated ./ui.js from dll-reference CKEditor5.dll ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/ui.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/delegated_./ui.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/utils.js":
/*!*************************************************************!*\
  !*** delegated ./utils.js from dll-reference CKEditor5.dll ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/utils.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/delegated_./utils.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/widget.js":
/*!**************************************************************!*\
  !*** delegated ./widget.js from dll-reference CKEditor5.dll ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/widget.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_panel/delegated_./widget.js_from_dll-reference_CKEditor5.dll?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/ckeditor5_plugins/wxt_panel/src/index.js");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});