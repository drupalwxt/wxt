(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["wxt_tabs"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./icons/tab.svg":
/*!***********************!*\
  !*** ./icons/tab.svg ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: #666;\n      }\n    </style>\n  </defs>\n  <path class=\"cls-1\" d=\"M17.5,3.2v2.47h-1v-2.17h-6.52v-1h6.73c.44,0,.79.31.79.7Z\"/>\n  <path d=\"M19.21,6.17v11.81c0,.28-.22.5-.5.5s-.5-.22-.5-.5V6.67h-8.73c-.27,0-.5-.23-.5-.5v-3.67H1.95v3.67c0,.25-.2.47-.45.49v11.32c0,.28-.22.5-.5.5s-.5-.22-.5-.5V6.17c0-.26.2-.47.45-.5v-3.37c0-.44.35-.8.8-.8h7.43c.44,0,.8.36.8.8v3.37h8.73c.28,0,.5.22.5.5Z\"/>\n  <path d=\"M15.5,15.49H4.51c-.28,0-.5-.22-.5-.5s.22-.5.5-.5h10.99c.28,0,.5.22.5.5s-.22.5-.5.5Z\"/>\n  <path d=\"M15.5,11.49H4.51c-.28,0-.5-.22-.5-.5s.22-.5.5-.5h10.99c.28,0,.5.22.5.5s-.22.5-.5.5Z\"/>\n</svg>");

/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_tabs/src/insertwxttabcommand.js":
/*!******************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_tabs/src/insertwxttabcommand.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InsertWXTTabsCommand)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");


class InsertWXTTabsCommand extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Command {
  execute() {
    const { model } = this.editor;

    model.change((writer) => {
      // Create the main container (wxtTabs)
      const wxtTabs = writer.createElement('wxtTabs');
      const wxtTabPanels = writer.createElement('wxtTabPanels');

      // Add a placeholder paragraph inside the tabPanels div
      const placeholder = writer.createElement('paragraph');

      // Append the tabPanels and placeholder to the tabs container
      writer.append(wxtTabPanels, wxtTabs);
      writer.append(placeholder, wxtTabPanels);

      // Insert the widget into the document
      model.insertContent(wxtTabs);
    });
  }

  refresh() {
    const { model } = this.editor;
    const { selection } = model.document;

    this.isEnabled = true;
  }
}


/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_tabs/src/tabs.js":
/*!***************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_tabs/src/tabs.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WXTTabs)
/* harmony export */ });
/* harmony import */ var _wxttabediting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wxttabediting */ "./js/ckeditor5_plugins/wxt_tabs/src/wxttabediting.js");
/* harmony import */ var _wxttabui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wxttabui */ "./js/ckeditor5_plugins/wxt_tabs/src/wxttabui.js");
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");




class WXTTabs extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_2__.Plugin {
    static get requires() {
        return [_wxttabediting__WEBPACK_IMPORTED_MODULE_0__["default"], _wxttabui__WEBPACK_IMPORTED_MODULE_1__["default"]];
    }
}


/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_tabs/src/wxttabediting.js":
/*!************************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_tabs/src/wxttabediting.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WXTTabsEditing)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");
/* harmony import */ var ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/widget */ "ckeditor5/src/widget.js");
/* harmony import */ var _insertwxttabcommand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./insertwxttabcommand */ "./js/ckeditor5_plugins/wxt_tabs/src/insertwxttabcommand.js");




class WXTTabsEditing extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {
  static get requires() {
    return [ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();

    this.editor.commands.add('insertWXTTabs', new _insertwxttabcommand__WEBPACK_IMPORTED_MODULE_2__["default"](this.editor));
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register('wxtTabs', {
      isObject: true,
      allowWhere: '$block',
    });

    schema.register('wxtTabPanels', {
      isLimit: true,
      allowIn: 'wxtTabs',
      allowContentOf: '$root',
    });
  }

  _defineConverters() {
    const { conversion } = this.editor;

    // Upcast (HTML -> Model)
    conversion.for('upcast').add((dispatcher) => {
      dispatcher.on('element:div', (evt, data, conversionApi) => {
        const { consumable, writer, safeInsert, convertChildren } = conversionApi;
        const viewItem = data.viewItem;

        // Ensure the div has the "wb-tabs" class.
        if (viewItem.hasClass('wb-tabs')) {
          const wxtTabs = writer.createElement('wxtTabs');
          if (safeInsert(wxtTabs, data.modelCursor)) {
            convertChildren(viewItem, writer.createPositionAt(wxtTabs, 0));
            data.modelRange = writer.createRange(
              writer.createPositionBefore(wxtTabs),
              writer.createPositionAfter(wxtTabs)
            );
            data.modelCursor = data.modelRange.end;
            consumable.consume(viewItem, { name: true, classes: 'wb-tabs' });
          }
        }

        // Ensure the div has the "tabpanels" class.
        if (viewItem.hasClass('tabpanels')) {
          const wxtTabPanels = writer.createElement('wxtTabPanels');
          if (safeInsert(wxtTabPanels, data.modelCursor)) {
            convertChildren(viewItem, writer.createPositionAt(wxtTabPanels, 0), {
              // Ignore non-relevant children like `<paragraph>` or `<detail>`.
              ignoreChildren: true,
            });

            data.modelRange = writer.createRange(
              writer.createPositionBefore(wxtTabPanels),
              writer.createPositionAfter(wxtTabPanels)
            );
            data.modelCursor = data.modelRange.end;
            consumable.consume(viewItem, { name: true, classes: 'tabpanels' });
          }
        }
      });
    });

    // Data Downcast (Model -> HTML)
    conversion.for('dataDowncast').elementToElement({
      model: 'wxtTabs',
      view: {
        name: 'div',
        classes: 'wb-tabs',
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'wxtTabPanels',
      view: (modelElement, { writer }) => {
        const div = writer.createContainerElement('div', { class: 'tabpanels' });

        // Append all child elements to the "tabpanels" div.
        modelElement.getChildren().forEach((child) => {
          if (child.name === 'details') {
            writer.insert(writer.createPositionAt(div, 'end'), writer.createContainerElement(child.name, child.getAttributes()));
          }
        });

        return div;
      },
    });

    // Editing Downcast
    conversion.for('editingDowncast').elementToElement({
      model: 'wxtTabs',
      view: (modelElement, { writer }) => {
        // Create the main container div for the widget.
        const div = writer.createContainerElement('div', { class: 'wb-tabs' });

        // Create a label element to add to the widget.
        const label = writer.createContainerElement('div', {
            class: 'wb-conjunction-label',
            'data-cke-ignore-selection': 'true',
        });

        // Add text content to the label.
        writer.insert(writer.createPositionAt(label, 0), writer.createText('Tabbed interface'));

        // Append the label to the main container.
        writer.insert(writer.createPositionAt(div, 0), label);

        // Convert into a widget for selection and handles.
        return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidget)(div, writer, {
            label: 'Tabs widget',
            hasSelectionHandle: true,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'wxtTabPanels',
      view: (modelElement, { writer }) => {
        const div = writer.createEditableElement('div', { class: 'tabpanels' });

        // Append only necessary child elements.
        modelElement.getChildren().forEach((child) => {
          if (child.name === 'details') {
            writer.insert(writer.createPositionAt(div, 'end'), writer.createEditableElement(child.name, child.getAttributes()));
          }
        });

        return (0,ckeditor5_src_widget__WEBPACK_IMPORTED_MODULE_1__.toWidgetEditable)(div, writer);
      },
    });
  }
}


/***/ }),

/***/ "./js/ckeditor5_plugins/wxt_tabs/src/wxttabui.js":
/*!*******************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_tabs/src/wxttabui.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WXTTabsUI)
/* harmony export */ });
/* harmony import */ var ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ckeditor5/src/core */ "ckeditor5/src/core.js");
/* harmony import */ var ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ckeditor5/src/ui */ "ckeditor5/src/ui.js");
/* harmony import */ var _icons_tab_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../icons/tab.svg */ "./icons/tab.svg");




class WXTTabsUI extends ckeditor5_src_core__WEBPACK_IMPORTED_MODULE_0__.Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertWXTTabs', (locale) => {
      const command = editor.commands.get('insertWXTTabs');
      const buttonView = new ckeditor5_src_ui__WEBPACK_IMPORTED_MODULE_1__.ButtonView(locale);

      buttonView.set({
        label: 'Tabs',
        icon: _icons_tab_svg__WEBPACK_IMPORTED_MODULE_2__["default"],
        tooltip: true,
        withText: true,
      });

      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      this.listenTo(buttonView, 'execute', () => editor.execute('insertWXTTabs'));

      return buttonView;
    });
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
/*!****************************************************!*\
  !*** ./js/ckeditor5_plugins/wxt_tabs/src/index.js ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tabs */ "./js/ckeditor5_plugins/wxt_tabs/src/tabs.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    WXTTabs: _tabs__WEBPACK_IMPORTED_MODULE_0__["default"],
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});