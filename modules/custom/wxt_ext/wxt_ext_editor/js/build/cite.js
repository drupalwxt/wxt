(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["cite"] = factory();
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
// EXTERNAL MODULE: delegated ./ui.js from dll-reference CKEditor5.dll
var delegated_uifrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/ui.js");
// EXTERNAL MODULE: delegated ./widget.js from dll-reference CKEditor5.dll
var delegated_widgetfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/widget.js");
;// CONCATENATED MODULE: ./icons/cite.svg
/* harmony default export */ const cite = ("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M0 1v16.981h4v5.019l7-5.019h13v-16.981h-24zm12 8.028c0 2.337-1.529 3.91-3.684 4.335l-.406-.87c.996-.375 1.637-1.587 1.637-2.493h-1.547v-4h4v3.028zm5 0c0 2.337-1.529 3.91-3.684 4.335l-.406-.87c.996-.375 1.637-1.587 1.637-2.493h-1.547v-4h4v3.028z\"/></svg>");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/cite/src/cite.js






class CitePlugin extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [ delegated_widgetfrom_dll_reference_CKEditor5.Widget ];
    }

    init() {
        const editor = this.editor;

        this._defineSchema();
        this._defineConverters();

        // Add the Cite button to the toolbar.
        editor.ui.componentFactory.add('cite', locale => {
            const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView(locale);
            button.set({
                label: 'Cite',
                icon: cite,
                tooltip: true,
                isEnabled: false
            });

            // Listen for selection changes and update button state.
            const updateButtonState = () => {
                const selection = editor.model.document.selection;
                const selectedElement = selection.getSelectedElement();
                const position = selection.getFirstPosition();

                // Check if the selection is inside a `<cite>` (even if cursor is inside).
                let isInsideCite = false;
                if (position) {
                    for (const ancestor of position.getAncestors()) {
                        if (ancestor.is && ancestor.is('element', 'cite')) {
                            isInsideCite = true;
                            break;
                        }
                    }
                }

                // Enable button if text is selected, the whole cite is selected, OR the cursor is inside `<cite>`.
                button.isEnabled = !selection.isCollapsed || selectedElement?.is('element', 'cite') || isInsideCite;
            };


            // React to selection changes.
            editor.model.document.selection.on('change', updateButtonState);
            editor.model.document.on('change:data', updateButtonState);

            button.on('execute', () => {
                const model = editor.model;
                const selection = model.document.selection;
                const selectedElement = selection.getSelectedElement();
                const position = selection.getFirstPosition();

                let citeElement = null;

                // Check if the selection is inside a <cite> element.
                if (position) {
                    for (const ancestor of position.getAncestors()) {
                        if (ancestor.is && ancestor.is('element', 'cite')) {
                            citeElement = ancestor;
                            break;
                        }
                    }
                }

                model.change(writer => {
                    if (selectedElement && selectedElement.is('element', 'cite')) {
                        // If the whole <cite> is selected, unwrap it.
                        writer.unwrap(selectedElement);
                    } else if (citeElement) {
                        // If cursor is inside an existing <cite>, unwrap it.
                        writer.unwrap(citeElement);
                    } else {
                        // Otherwise, wrap the selected text in a new <cite>.
                        const range = selection.getFirstRange();
                        writer.wrap(range, writer.createElement('cite'));
                    }
                });

                updateButtonState();
            });


            return button;
        });
    }

    // Define Schema to Allow <cite> as a Widget
    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('cite', {
            allowWhere: '$text',
            allowContentOf: '$block',
            isInline: true,
            isObject: true,
            isContent: true
        });
    }

    // Define Converters to Treat Cite as a Widget.
    _defineConverters() {
        const conversion = this.editor.conversion;

        // Upcast <cite> elements from raw HTML into model data.
        conversion.for('upcast').elementToElement({
            model: 'cite',
            view: 'cite'
        });

        // Downcast model data into <cite> elements for editing and data output.
        conversion.for('downcast').elementToElement({
            model: 'cite',
            view: (modelElement, { writer }) => {
                const citeElement = writer.createContainerElement('cite');
                return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(citeElement, writer);
            }
        });
    }
}

;// CONCATENATED MODULE: ./js/ckeditor5_plugins/cite/src/index.js


/* harmony default export */ const src = ({
    CitePlugin: CitePlugin
});

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});