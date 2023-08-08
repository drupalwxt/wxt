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
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["wxt_alert"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/ckeditor5_plugins/wxt_alert/src/alert.js":
/*!*****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/alert.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Alert)\n/* harmony export */ });\n/* harmony import */ var _alertediting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alertediting */ \"./js/ckeditor5_plugins/wxt_alert/src/alertediting.js\");\n/* harmony import */ var _alertui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alertui */ \"./js/ckeditor5_plugins/wxt_alert/src/alertui.js\");\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n\n\n\n\nclass Alert extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.Plugin {\n    static get requires() {\n        return [_alertediting__WEBPACK_IMPORTED_MODULE_0__[\"default\"], _alertui__WEBPACK_IMPORTED_MODULE_1__[\"default\"]];\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/alert.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js":
/*!***************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AlertClasses\": () => (/* binding */ AlertClasses)\n/* harmony export */ });\nconst AlertClasses = [\n    'info',\n    'success',\n    'danger',\n    'warning'\n];\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_alert/src/alertediting.js":
/*!************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/alertediting.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ AlertEditing)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/widget */ \"ckeditor5/src/widget.js\");\n/* harmony import */ var _alertcssclasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./alertcssclasses */ \"./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js\");\n/* harmony import */ var _insertalertcommand__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./insertalertcommand */ \"./js/ckeditor5_plugins/wxt_alert/src/insertalertcommand.js\");\n\n\n\n\n\n\nclass AlertEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n    static get requires() {\n        return [ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.Widget];\n    }\n\n    init() {\n        this.alertClasses = _alertcssclasses__WEBPACK_IMPORTED_MODULE_2__.AlertClasses;\n\n        this._defineSchema();\n        this._defineConverters();\n        this.editor.commands.add(\n            'insertAlert',\n            new _insertalertcommand__WEBPACK_IMPORTED_MODULE_3__[\"default\"](this.editor),\n        );\n    }\n\n    _defineSchema() {\n        const schema = this.editor.model.schema;\n\n        this.alertClasses.forEach(c => {\n            schema.register('alert-' + c, {\n                inheritAllFrom: '$block'\n            });\n            schema.register('alertTitle-' + c, {\n                isLimit: true,\n                allowContentOf: '$block',\n                allowIn: 'alert-' + c,\n            });\n            schema.register('alertBody-' + c, {\n                isLimit: true,\n                allowIn: 'alert-' + c,\n                allowContentOf: '$root',\n            });\n        });\n    }\n\n    _defineConverters() {\n        const { conversion } = this.editor;\n\n        this.alertClasses.forEach(c => {\n            conversion.for('upcast').elementToElement({\n                model: 'alert-' + c,\n                view: {\n                    name: 'section',\n                    classes: ['alert', 'alert-' + c],\n                },\n                converterPriority: 'high'\n            });\n            conversion.for('upcast').elementToElement({\n                model: 'alertTitle-' + c,\n                view: {\n                    name: 'h3'\n                },\n                converterPriority: 'high'\n            });\n            conversion.for('upcast').elementToElement({\n                model: 'alertBody-' + c,\n                view: {\n                    name: 'div',\n                },\n                converterPriority: 'high'\n            });\n\n            conversion.for('dataDowncast').elementToElement({\n                model: 'alert-' + c,\n                view: {\n                    name: 'section',\n                    classes: ['alert', 'alert-' + c],\n                },\n            });\n            conversion.for('dataDowncast').elementToElement({\n                model: 'alertTitle-' + c,\n                view: {\n                    name: 'h3'\n                },\n                converterPriority: 'high'\n            });\n            conversion.for('dataDowncast').elementToElement({\n                model: 'alertBody-' + c,\n                view: {\n                    name: 'div',\n                },\n                converterPriority: 'high'\n            });\n\n            conversion.for('editingDowncast').elementToElement({\n                model: 'alert-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const div = viewWriter.createContainerElement('section', { class: 'alert alert-' + c });\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidget)(div, viewWriter, { hasSelectionHandle: true });\n                },\n                converterPriority: 'high'\n            });\n            conversion.for('editingDowncast').elementToElement({\n                model: 'alertTitle-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const h3 = viewWriter.createEditableElement('h3');\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(h3, viewWriter);\n                },\n                converterPriority: 'high'\n            }, );\n            conversion.for('editingDowncast').elementToElement({\n                model: 'alertBody-' + c,\n                view: (modelElement, { writer: viewWriter }) => {\n                    const div = viewWriter.createEditableElement('div');\n                    return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(div, viewWriter);\n                },\n                converterPriority: 'high'\n\n            });\n        });\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/alertediting.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_alert/src/alertui.js":
/*!*******************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/alertui.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ AlertUI)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/ui */ \"ckeditor5/src/ui.js\");\n/* harmony import */ var _alertcssclasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./alertcssclasses */ \"./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js\");\n/* harmony import */ var _alertview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./alertview */ \"./js/ckeditor5_plugins/wxt_alert/src/alertview.js\");\n/* harmony import */ var _icons_alert_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../icons/alert.svg */ \"./icons/alert.svg\");\n\n\n\n\n\n\nclass AlertUI extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {\n    init() {\n        const editor = this.editor;\n        this._balloon = this.editor.plugins.get(ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ContextualBalloon);\n        this.formView = this._createFormView();\n        this.alertClasses = _alertcssclasses__WEBPACK_IMPORTED_MODULE_2__.AlertClasses;\n        editor.ui.componentFactory.add('alert', () => {\n            const button = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ButtonView();\n            button.label = Drupal.t('Alert');\n            button.icon = _icons_alert_svg__WEBPACK_IMPORTED_MODULE_4__[\"default\"];\n            button.tooltip = true;\n            button.withText = true;\n            const command = editor.commands.get('insertAlert');\n\n            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');\n            this.listenTo(button, 'execute', () => {\n                this._showUI();\n            });\n\n            return button;\n        });\n    }\n    _createFormView() {\n        const editor = this.editor;\n        const formView = new _alertview__WEBPACK_IMPORTED_MODULE_3__[\"default\"](editor.locale);\n\n        this.listenTo(formView, 'submit', () => {\n            const alerttype = formView.dropdown.selectedValue;\n\n            if (alerttype === null || typeof alerttype == 'undefined') {\n                // Possible to add validation message to ask a user to choose?\n                return;\n            }\n            let selectionAncestors = editor.model.document.selection.getFirstPosition().getAncestors();\n            let selectionIsAlert = false;\n            let selection = null;\n            // Traverse from the first inner tag to the root\n            selectionAncestors.forEach(node => {\n                // Check if the current selection is an alert widget\n                this.alertClasses.forEach(c => {\n                    if (node.name == 'alert-' + c) {\n                        // Alert widget found \n                        selection = node;\n                        selectionIsAlert = true;\n                    }\n                });\n            });\n\n            // If the selection is within an alert widget, update the selected widget; otherwise create a new one\n            if (selectionIsAlert) {\n                //console.log('noice');\n                editor.execute('insertAlert', alerttype, selection);\n            } else {\n                editor.execute('insertAlert', alerttype, null);\n            }\n            this._hideUI();\n        });\n\n        this.listenTo(formView, 'cancel', () => {\n            this._hideUI();\n        });\n\n        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.clickOutsideHandler)({\n            emitter: formView,\n            activator: () => this._balloon.visibleView === formView,\n            contextElements: [this._balloon.view.element],\n            callback: () => this._hideUI()\n        });\n\n        return formView;\n    }\n\n    _showUI() {\n        this._balloon.add({\n            view: this.formView,\n            position: this._getBalloonPositionData()\n        });\n        this.formView.focus();\n    }\n\n    _hideUI() {\n        this.formView.dropdown.selectedValue = null;\n\n        this.formView.dropdown.buttonView.set({ label: Drupal.t('Alert type') })\n        this.formView.element.reset();\n        this._balloon.remove(this.formView);\n        this.editor.editing.view.focus();\n    }\n\n    _getBalloonPositionData() {\n        const view = this.editor.editing.view;\n        const viewDocument = view.document;\n        let target = null;\n        target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());\n\n        return {\n            target\n        };\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/alertui.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_alert/src/alertview.js":
/*!*********************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/alertview.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ FormView)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/ui */ \"ckeditor5/src/ui.js\");\n/* harmony import */ var ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/utils */ \"ckeditor5/src/utils.js\");\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var _alertcssclasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./alertcssclasses */ \"./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js\");\n\n\n\n\n\n/*\n    TODO: is there a better way to get selected value from a dropdown? \n    setting a new property to a member of a defined class feels wrong\n*/\nclass FormView extends ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.View {\n    constructor(locale) {\n        super(locale);\n\n        this.alertClasses = _alertcssclasses__WEBPACK_IMPORTED_MODULE_3__.AlertClasses;\n        const dropdownItems = [];\n        this.dropdown = (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.createDropdown)(locale);\n        const items = new ckeditor5_src_utils__WEBPACK_IMPORTED_MODULE_1__.Collection();\n\n        // Create save and cancel buttons\n        this.saveButtonView = this._createButton('Save', ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.icons.check, 'ck-button-save');\n        this.saveButtonView.type = 'submit';\n        this.cancelButtonView = this._createButton('Cancel', ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.icons.cancel, 'ck-button-cancel');\n        this.cancelButtonView.delegate('execute').to(this, 'cancel');\n\n        // create button for each alert class and add to the collection of buttons for the dropdown list \n        this.alertClasses.forEach(c => {\n            dropdownItems.push({\n                type: 'button',\n                model: new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.Model({\n                    withText: true,\n                    label: c,\n                    value: c\n                })\n            });\n        });\n\n        items.addMany(dropdownItems);\n        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.addListToDropdown)(this.dropdown, items);\n\n        this.dropdown.buttonView.set({\n            label: Drupal.t('Alert type'),\n            withText: true\n        });\n\n        // Store the selected Alert type from user selection\n        this.dropdown.on('execute', eventinfo => {\n            this.dropdown.selectedValue = eventinfo.source.value;\n            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue })\n        });\n\n        // Collect child views and add them to the form\n        this.childViews = this.createCollection([\n            this.dropdown,\n            this.saveButtonView,\n            this.cancelButtonView\n        ]);\n        this.setTemplate({\n            tag: 'form',\n            attributes: {\n                class: ['ck', 'ck-abbr-form'],\n                tabindex: '-1'\n            },\n            children: this.childViews\n        });\n    }\n\n    render() {\n        super.render();\n\n        (0,ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.submitHandler)({\n            view: this\n        });\n    }\n\n    focus() {\n        this.childViews.first.focus();\n    }\n\n    _createButton(label, icon, className) {\n        const button = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_0__.ButtonView();\n\n        button.set({\n            label,\n            icon,\n            tooltip: true,\n            class: className\n        });\n\n        return button;\n    }\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/alertview.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_alert/src/index.js":
/*!*****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _alert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./alert */ \"./js/ckeditor5_plugins/wxt_alert/src/alert.js\");\n/**\n * @file The build process always expects an index.js file. Anything exported\n * here will be recognized by CKEditor 5 as an available plugin. Multiple\n * plugins can be exported in this one file.\n *\n * I.e. this file's purpose is to make plugin(s) discoverable.\n */\n// cSpell:ignore simplebox\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    Alert: _alert__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n});\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/index.js?");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_alert/src/insertalertcommand.js":
/*!******************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_alert/src/insertalertcommand.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ InsertAlertCommand)\n/* harmony export */ });\n/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ \"ckeditor5/src/core.js\");\n/* harmony import */ var _alertcssclasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./alertcssclasses */ \"./js/ckeditor5_plugins/wxt_alert/src/alertcssclasses.js\");\n\n\n\nclass InsertAlertCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {\n\n    /**\n     * Triggered when a user clicks the 'save' button on the ContextualBalloon\n     * to add a new Alert\n     * \n     * @param {String} alertClass the alert type to create\n     */\n    execute(alertClass, existingAlert) {\n        const { model } = this.editor;\n        if (existingAlert !== null && existingAlert !== 'undefined') {\n            // Existing alert found so we update\n            model.change((writer) => {\n                updateAlert(writer, alertClass, existingAlert);\n            });\n        } else {\n            // Creating new alert\n            model.change((writer) => {\n                let alert = getAlertTemplate(writer, alertClass);\n                model.insertContent(createAlert(writer, alert));\n            });\n        }\n\n    }\n\n    /**\n     * Triggered when selection changes. determines if the alert toolbar button should be \n     * enabled if the users selection is not inside an element that allows alerts, disable\n     * the button; otherwise it's active\n     */\n    refresh() {\n        const { model } = this.editor;\n        const { selection } = model.document;\n        const alertClasses = _alertcssclasses__WEBPACK_IMPORTED_MODULE_1__.AlertClasses;\n        this.isEnabled = true;\n\n        alertClasses.forEach(c => {\n            if (model.schema.findAllowedParent(\n                    selection.getFirstPosition(),\n                    'alert-' + c,\n                ) === null) {\n                this.isEnabled = false;\n            }\n        });\n    }\n}\n\n/**\n * createAlert\n * \n * @param {Writer} writer - the writer for the existing editor\n * @param {Element} alert - the alert template\n * \n * @returns {Element} Alert - the new alert with title and body\n */\nfunction createAlert(writer, alert) {\n    // Add placeholder text to new alert widget\n    for (let child of alert.getChildren()) {\n        if (child.name.startsWith('alertTitle-')) {\n            writer.insertText('Alert title', child)\n        } else if (child.name.startsWith('alertBody-')) {\n            const placeholderText = writer.createElement('paragraph');\n            writer.append(placeholderText, child);\n            writer.insertText('Alert body', placeholderText);\n        }\n    }\n    return alert;\n}\n\n/**\n * updateAlert\n * \n * @param {Writer} writer - the writer for the existing editor\n * @param {Element} alert - the template of an alert\n * @param {Element} existingAlert - the existing alert that we are replacing\n * @returns {Element} Alert - the new alert with title and body\n */\nfunction updateAlert(writer, alert, existingAlert) {\n    // Get existing content from existing alert\n    for (let child of existingAlert.getChildren()) {\n        if (child.name.startsWith('alertTitle-')) {\n            writer.rename(child, 'alertTitle-' + alert);\n        } else if (child.name.startsWith('alertBody-')) {\n            writer.rename(child, 'alertBody-' + alert);\n        }\n    }\n    writer.rename(existingAlert, 'alert-' + alert);\n\n    return existingAlert;\n}\n\n/**\n * getAlertTemplate\n * \n * @param {Writer} writer - the document writer\n * @param {String} alertClass - the alert type we're creating\n * @returns {Element} alert - the template of an alert of the given type\n */\nfunction getAlertTemplate(writer, alertClass) {\n    const alert = writer.createElement('alert-' + alertClass);\n    const alertTitle = writer.createElement('alertTitle-' + alertClass);\n    const alertBody = writer.createElement('alertBody-' + alertClass);\n\n    writer.append(alertTitle, alert);\n    writer.append(alertBody, alert);\n\n    return alert;\n}\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./js/ckeditor5_plugins/wxt_alert/src/insertalertcommand.js?");

/***/ }),

/***/ "./icons/alert.svg":
/*!*************************!*\
  !*** ./icons/alert.svg ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?><svg id=\\\"Layer_2\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" width=\\\"32\\\" height=\\\"28\\\" viewBox=\\\"0 0 32 28\\\"><g id=\\\"Layer_1-2\\\"><path id=\\\"alert\\\" d=\\\"m31.75,25.22L17.61.92c-.72-1.23-2.51-1.23-3.23,0L.25,25.22c-.72,1.23.18,2.78,1.61,2.78h28.27c1.43,0,2.33-1.54,1.61-2.78Zm-15.75.81c-1.33,0-2.35-1.01-2.35-2.27s1.02-2.33,2.35-2.33,2.35,1.04,2.35,2.33-1.05,2.27-2.35,2.27Zm2.66-17.16l-.96,9.98c-.04.51-.52.73-1.4.73h-.61c-.87,0-1.35-.23-1.4-.73l-.96-9.98v-.63c0-.51.52-.78,1.35-.78h2.62c.83,0,1.35.28,1.35.78v.63Z\\\" stroke-width=\\\"0\\\"/></g></svg>\");\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/./icons/alert.svg?");

/***/ }),

/***/ "ckeditor5/src/core.js":
/*!************************************************************!*\
  !*** delegated ./core.js from dll-reference CKEditor5.dll ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/core.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/delegated_./core.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/ui.js":
/*!**********************************************************!*\
  !*** delegated ./ui.js from dll-reference CKEditor5.dll ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/ui.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/delegated_./ui.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/utils.js":
/*!*************************************************************!*\
  !*** delegated ./utils.js from dll-reference CKEditor5.dll ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/utils.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/delegated_./utils.js_from_dll-reference_CKEditor5.dll?");

/***/ }),

/***/ "ckeditor5/src/widget.js":
/*!**************************************************************!*\
  !*** delegated ./widget.js from dll-reference CKEditor5.dll ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = (__webpack_require__(/*! dll-reference CKEditor5.dll */ \"dll-reference CKEditor5.dll\"))(\"./src/widget.js\");\n\n//# sourceURL=webpack://CKEditor5.wxt_alert/delegated_./widget.js_from_dll-reference_CKEditor5.dll?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./js/ckeditor5_plugins/wxt_alert/src/index.js");
/******/ 	__webpack_exports__ = __webpack_exports__["default"];
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});