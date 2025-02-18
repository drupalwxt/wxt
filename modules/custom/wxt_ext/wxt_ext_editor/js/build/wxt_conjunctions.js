(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CKEditor5"] = factory();
	else
		root["CKEditor5"] = root["CKEditor5"] || {}, root["CKEditor5"]["wxt_conjunctions"] = factory();
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
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/conjunctioncssclasses.js
const ConjunctionClasses = [
    'and',
    'or'
];

;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/insertconjunctioncommand.js


class InsertConjunctionCommand extends delegated_corefrom_dll_reference_CKEditor5.Command {
    execute(conjunctionType = 'and', numColumns = 2, responsiveClass = '') {
        const { model } = this.editor;

        model.change((writer) => {
            const selection = model.document.selection;

            // Check if the selection is directly on an existing conjunction
            const selectedWidget = selection.getSelectedElement();

            if (selectedWidget && selectedWidget.is('element', 'conjunction')) {
                const originalTag = selectedWidget.getAttribute('originalTag');

                // Update the existing widget's attributes
                writer.setAttribute('conjunctionType', `cnjnctn-type-${conjunctionType}`, selectedWidget);
                writer.setAttribute('columnCount', numColumns, selectedWidget);
                writer.setAttribute('responsiveClass', responsiveClass, selectedWidget);
                writer.setAttribute('originalTag', originalTag, selectedWidget);

                // Update the number of columns
                this._updateConjunctionColumns(writer, selectedWidget, numColumns);
            } else {
                // Insert a new widget
                const conjunction = writer.createElement('conjunction', {
                    conjunctionType: `cnjnctn-type-${conjunctionType}`,
                    columnCount: numColumns,
                    ...(responsiveClass ? { responsiveClass } : {}),
                    originalTag: 'div',
                });

                const insertPosition = model.document.selection.getFirstPosition();
                model.insertContent(conjunction, insertPosition);

                // Add the specified number of conjunctionCol children
                for (let i = 0; i < numColumns; i++) {
                    const column = writer.createElement('conjunctionCol');
                    writer.append(column, conjunction);

                    const paragraph = writer.createElement('paragraph');
                    writer.append(paragraph, column);
                    writer.insertText(`Column ${i + 1}`, paragraph);
                }

                // Set selection inside the first column for usability
                const firstColumn = conjunction.getChild(0);
                if (firstColumn) {
                    writer.setSelection(writer.createPositionAt(firstColumn, 0));
                }
            }
        });
    }

    _updateConjunctionColumns(writer, widget, numColumns) {
      const existingColumns = Array.from(widget.getChildren());

      const defaultOriginalTag = existingColumns.length > 0
        ? existingColumns[0].getAttribute('originalTag')
        : 'div';

      // Add new columns if needed
      while (existingColumns.length < numColumns) {
          const column = writer.createElement('conjunctionCol', { originalTag: defaultOriginalTag });
          writer.append(column, widget);

          // Add an empty paragraph if the column is new
          const paragraph = writer.createElement('paragraph');
          writer.append(paragraph, column);
          existingColumns.push(column);
      }

      // Remove extra columns if needed
      while (existingColumns.length > numColumns) {
          writer.remove(existingColumns.pop());
      }

      // Keep the existing text/content in the remaining columns
      existingColumns.forEach((column, index) => {
          if (column.childCount === 0) {
              // Ensure each column has a paragraph if it's empty
              const paragraph = writer.createElement('paragraph');
              writer.append(paragraph, column);
          }
      });
    }


    refresh() {
        const { model } = this.editor;
        const { selection } = model.document;
        this.isEnabled = model.schema.findAllowedParent(
            selection.getFirstPosition(),
            'conjunction'
        ) !== null;
    }
}

;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/conjunctionediting.js






class ConjunctionEditing extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [delegated_widgetfrom_dll_reference_CKEditor5.Widget];
    }

    init() {
        // Intercept and override the list plugin's upcast converters
        this.editor.conversion.for('upcast').add((dispatcher) => {
            dispatcher.on('element:ul', (evt, data, conversionApi) => {
                const viewElement = data.viewItem;

                // Check if this <ul> is conjunction-specific
                if (viewElement.hasClass('cnjnctn-type-and') || viewElement.hasClass('cnjnctn-type-or')) {
                    // Disable the list plugin for this element
                    dispatcher.off('element:ul');
                }
            }, { priority: 'highest' });
        });

        this.conjunctionClasses = ConjunctionClasses;
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add(
            'insertConjunction',
            new InsertConjunctionCommand(this.editor)
        );

        // Listen for attribute changes in the model, to update widget label.
        this.editor.model.document.on('change:data', (evt, batch) => {
            // Only handle user-initiated changes.
            if (batch.type === 'default') {
                const differ = this.editor.model.document.differ;

                for (const change of differ.getChanges()) {
                    if (change.type === 'attribute' && change.attributeKey === 'conjunctionType') {
                        const modelElement = change.range.start.nodeAfter;

                        if (modelElement && modelElement.is('element', 'conjunction')) {
                            // Handle the change and update the label.
                            this.updateConjunctionLabel(modelElement, change.attributeNewValue);
                        }
                    }
                }
            }
        });
    }

    // Utility function to update the label
    updateConjunctionLabel(modelElement, conjunctionType) {
        const label = conjunctionType.toLowerCase() === 'cnjnctn-type-and' ? 'AND' : 'OR';

        this.editor.model.change((writer) => {
            // Update the label in the model
            writer.setAttribute('label', label, modelElement);
        });

        // Update the view dynamically
        const view = this.editor.editing.mapper.toViewElement(modelElement);

        if (view) {
            this.editor.editing.view.change((writer) => {
                // Find the label element inside the view
                const labelElement = Array.from(view.getChildren()).find(
                    (child) => child.hasClass && child.hasClass('wb-conjunction-label')
                );

                if (labelElement) {
                    // Remove existing text and insert the updated label
                    Array.from(labelElement.getChildren()).forEach((child) => writer.remove(child));
                    writer.insert(writer.createPositionAt(labelElement, 0), writer.createText('Conjunction: ' + label));
                }
            });
        }
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('conjunction', {
            isObject: true,
            allowWhere: '$block',
            allowAttributes: ['conjunctionType', 'columnCount', 'responsiveClass'],
            allowContentOf: '$block',
            inheritAllFrom: '$block',
        });

        schema.register('conjunctionCol', {
            isLimit: true,
            allowIn: 'conjunction',
            allowContentOf: '$root',
            allowAttributes: ['useSection', 'originalTag']
        });
    }

    _defineConverters() {
        const { conversion } = this.editor;

        // Upcast
        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const originalTag = viewElement.name;
                const conjunctionType = viewElement.hasClass('cnjnctn-type-and') ? 'cnjnctn-type-and' : 'cnjnctn-type-or';
                const responsiveClass = viewElement.getAttribute('class').match(/cnjnctn-(xs|sm|md|lg)/)?.[0];
                
                // Count the number of child elements with the `cnjnctn-col` class.
                const columnCount = Array.from(viewElement.getChildren())
                    .filter(child => child.hasClass && child.hasClass('cnjnctn-col'))
                    .length;

                return modelWriter.createElement('conjunction', {
                    conjunctionType,
                    columnCount,
                    ...(responsiveClass ? { responsiveClass } : {}),
                    originalTag,
                });
            },
            view: {
                name: /^(div|ul)$/,
                classes: /cnjnctn-type-(and|or)/,
            },
        });

        conversion.for('upcast').elementToElement({
            model: (viewElement, { writer: modelWriter }) => {
                const originalTag = viewElement.name;
                const useSection = originalTag === 'section';

                return modelWriter.createElement('conjunctionCol', {
                    useSection,
                    originalTag,
                });
            },
            view: {
                name: /^(div|section|li)$/,
                classes: 'cnjnctn-col'
            },
        });

        // Data Downcast
        conversion.for('dataDowncast').elementToElement({
            model: 'conjunction',
            view: (modelElement, { writer: viewWriter }) => {
                const conjunctionType = modelElement.getAttribute('conjunctionType') || 'or';
                const responsiveClass = modelElement.getAttribute('responsiveClass');
                const originalTag = modelElement.getAttribute('originalTag') || 'div';

                // Create the class string conditionally
                const classString = responsiveClass
                    ? `${conjunctionType} ${responsiveClass}`
                    : conjunctionType;

                const container = viewWriter.createContainerElement(originalTag, {
                    class: classString,
                });

                return container;
            },
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'conjunctionCol',
            view: (modelElement, { writer: viewWriter }) => {
                const originalTag = modelElement.getAttribute('originalTag') || 'div';
                return viewWriter.createContainerElement(originalTag, {
                    class: 'cnjnctn-col'
                });
            }
        });

        // Editing Downcast
        conversion.for('editingDowncast').elementToElement({
            model: 'conjunction',
            view: (modelElement, { writer, mapper }) => {
                const conjunctionType = modelElement.getAttribute('conjunctionType') || 'or';
                const responsiveClass = modelElement.getAttribute('responsiveClass');
                const originalTag = modelElement.getAttribute('originalTag') || 'div';

                // Create the class string conditionally
                const classString = responsiveClass
                    ? `${conjunctionType} ${responsiveClass}`
                    : conjunctionType;

                const container = writer.createContainerElement(originalTag, {
                    class: classString,
                });

                // Create a label element to add to the widget.
                const label = writer.createContainerElement('div', {
                    class: 'wb-conjunction-label',
                    'data-cke-ignore-selection': 'true',
                });

                // Determine the text for the label based on the conjunctionType.
                const labelText = conjunctionType.toLowerCase() === 'cnjnctn-type-and' ? 'AND' : 'OR';
                writer.insert(writer.createPositionAt(label, 0), writer.createText('Conjunction: ' + labelText));
                writer.insert(writer.createPositionAt(container, 0), label);

                return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidget)(container, writer, { hasSelectionHandle: true });
            },
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'conjunctionCol',
            view: (modelElement, { writer: viewWriter }) => {
                const originalTag = modelElement.getAttribute('originalTag') || 'div';
                const container = viewWriter.createEditableElement(originalTag, {
                    class: 'cnjnctn-col'
                });
                return (0,delegated_widgetfrom_dll_reference_CKEditor5.toWidgetEditable)(container, viewWriter);
            }
        });
    }
}

// EXTERNAL MODULE: delegated ./ui.js from dll-reference CKEditor5.dll
var delegated_uifrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/ui.js");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/responsiveclasses.js
const ResponsiveClasses = [
    'cnjnctn-xs',
    'cnjnctn-sm',
    'cnjnctn-md',
    'cnjnctn-lg',
];

// EXTERNAL MODULE: delegated ./utils.js from dll-reference CKEditor5.dll
var delegated_utilsfrom_dll_reference_CKEditor5 = __webpack_require__("ckeditor5/src/utils.js");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/conjunctionview.js






class FormView extends delegated_uifrom_dll_reference_CKEditor5.View {
    constructor(locale) {
        super(locale);

        // Conjunction type (and/or).
        this.conjunctionClasses = ConjunctionClasses;
        const dropdownItems = [];
        this.dropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(locale);
        this.childCountInput = this._createInputField();

        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Create dropdown items for conjunction types.
        this.conjunctionClasses.forEach(c => {
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
            label: 'Type',
            withText: true
        });

        this.dropdown.on('execute', (evt) => {
            this.dropdown.selectedValue = evt.source.value;
            this.dropdown.buttonView.set({ label: this.dropdown.selectedValue });
        });

        // Responsive classes (xs/sm/md/lg).
        this.responsiveClasses = ResponsiveClasses;
        const responsiveClassItems = [];
        this.dropdownResponsive = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(locale);
        this.responsiveClassInput = this._createResponsiveClassDropdown();

        const responsiveItems = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Create dropdown items for conjunction types.
        this.responsiveClasses.forEach(c => {
            responsiveClassItems.push({
                type: 'button',
                model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        responsiveItems.addMany(responsiveClassItems);
        (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(this.dropdownResponsive, responsiveItems);

        this.dropdownResponsive.buttonView.set({
            label: 'Type',
            withText: true
        });

        this.dropdownResponsive.on('execute', (evt) => {
            this.dropdownResponsive.selectedValue = evt.source.value;
            this.dropdownResponsive.buttonView.set({ label: this.dropdownResponsive.selectedValue });
        });

        // Rest of form.
        this.saveButtonView = this._createButton('Save', delegated_corefrom_dll_reference_CKEditor5.icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';

        this.cancelButtonView = this._createButton('Cancel', delegated_corefrom_dll_reference_CKEditor5.icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        this.childViews = this.createCollection([
            this.dropdown,
            this.responsiveClassInput,
            this.childCountInput,
            this.saveButtonView,
            this.cancelButtonView
        ]);

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck', 'ck-conjunction-form'],
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

    _createResponsiveClassDropdown() {
        const dropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(this.locale);
        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Add options for responsive classes (xs/sm/md/lg).
        this.responsiveClasses.forEach((c) => {
            items.add({
                type: 'button',
                model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
                    withText: true,
                    label: c,
                    value: c
                })
            });
        });

        (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(dropdown, items);

        dropdown.buttonView.set({
            label: 'Responsive class',
            withText: true
        });

        dropdown.on('execute', (evt) => {
            dropdown.selectedValue = evt.source.value;
            dropdown.buttonView.set({ label: evt.source.value });
        });

        return dropdown;
    }

    _createInputField() {
        const dropdown = (0,delegated_uifrom_dll_reference_CKEditor5.createDropdown)(this.locale);
        const items = new delegated_utilsfrom_dll_reference_CKEditor5.Collection();

        // Add options for the number of columns (2 to 6).
        [2, 3, 4, 5, 6].forEach((value) => {
            items.add({
                type: 'button',
                model: new delegated_uifrom_dll_reference_CKEditor5.ViewModel({
                    withText: true,
                    label: value.toString(),
                    value: value,
                }),
            });
        });

        (0,delegated_uifrom_dll_reference_CKEditor5.addListToDropdown)(dropdown, items);

        dropdown.buttonView.set({
            label: 'Columns',
            withText: true,
        });

        // Store the selected value in the dropdown.
        dropdown.on('execute', (evt) => {
            dropdown.selectedValue = evt.source.value;
            dropdown.buttonView.set({ label: evt.source.value.toString() });
        });

        return dropdown;
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

;// CONCATENATED MODULE: ./icons/conjunction.svg
/* harmony default export */ const conjunction = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\">\n  <g>\n    <path d=\"M18,11c-.55,0-1,.51-1,1.14v5.71c0,.63.45,1.14,1,1.14s1-.51,1-1.14v-5.71c0-.63-.45-1.14-1-1.14Z\"/>\n    <path d=\"M14,11c-.55,0-1,.51-1,1.14v5.71c0,.63.45,1.14,1,1.14s1-.51,1-1.14v-5.71c0-.63-.45-1.14-1-1.14Z\"/>\n  </g>\n  <path d=\"M3.64,17.36c-.26,0-.51-.1-.71-.29-.39-.39-.39-1.02,0-1.41L15.66,2.93c.39-.39,1.02-.39,1.41,0s.39,1.02,0,1.41l-12.73,12.73c-.2.2-.45.29-.71.29Z\"/>\n  <path d=\"M8,4h-2v-2c0-.55-.45-1-1-1s-1,.45-1,1v2h-2c-.55,0-1,.45-1,1s.45,1,1,1h2v2c0,.55.45,1,1,1s1-.45,1-1v-2h2c.55,0,1-.45,1-1s-.45-1-1-1Z\"/>\n</svg>");
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/conjunctionui.js







class ConjunctionUI extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    init() {
        const editor = this.editor;
        this._balloon = this.editor.plugins.get(delegated_uifrom_dll_reference_CKEditor5.ContextualBalloon);
        this.formView = this._createFormView();
        this.conjunctionClasses = ConjunctionClasses;
        this.responsiveClasses = ResponsiveClasses;

        editor.ui.componentFactory.add('conjunction', () => {
            const button = new delegated_uifrom_dll_reference_CKEditor5.ButtonView();
            button.label = 'Conjunction';
            button.icon = conjunction;
            button.tooltip = true;
            button.withText = true;
            const command = editor.commands.get('insertConjunction');

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
            const conjunctionType = formView.dropdown.selectedValue;
            const childCount = parseInt(formView.childCountInput.selectedValue) || 2;
            const responsiveClass = formView.responsiveClassInput.selectedValue || null;

            if (!conjunctionType) {
                return;
            }

            editor.execute('insertConjunction', conjunctionType, childCount, responsiveClass);
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

        // Default values for the dropdowns
        let selectedConjunctionType = null;
        let selectedColumnCount = '';
        let selectedResponsiveClass = '';

        // Check if the selection is directly a conjunction widget or part of it.
        const selectedWidget = selection.getSelectedElement();

        if (selectedWidget && selectedWidget.is('element', 'conjunction')) {
            // Extract attributes from the selected widgets.
            const fullConjunctionType = selectedWidget.getAttribute('conjunctionType') || 'cnjnctn-type-and';
            selectedConjunctionType = fullConjunctionType.replace('cnjnctn-type-', '');
            selectedColumnCount = selectedWidget.getAttribute('columnCount') || 2;
            selectedResponsiveClass = selectedWidget.getAttribute('responsiveClass') || null;
        }

        // Populate the form with the widget's values or reset to defaults
        if (selectedConjunctionType) {
            this.formView.dropdown.selectedValue = selectedConjunctionType;
            this.formView.dropdown.buttonView.set({ label: selectedConjunctionType });
        } else {
            this.formView.dropdown.selectedValue = null;
            this.formView.dropdown.buttonView.set({ label: 'Type' });
        }

        if (selectedColumnCount) {
            this.formView.childCountInput.selectedValue = selectedColumnCount.toString();
            this.formView.childCountInput.buttonView.set({ label: selectedColumnCount.toString() });
        } else {
            this.formView.childCountInput.selectedValue = '';
            this.formView.childCountInput.buttonView.set({ label: 'Columns' });
        }

        if (selectedResponsiveClass) {
            this.formView.responsiveClassInput.selectedValue = selectedResponsiveClass.toString();
            this.formView.responsiveClassInput.buttonView.set({ label: selectedResponsiveClass.toString() });
        } else {
            this.formView.responsiveClassInput.selectedValue = '';
            this.formView.responsiveClassInput.buttonView.set({ label: 'Responsive class' });
        }

        // Show the form in the balloon
        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });

        this.formView.focus();
    }

    _hideUI() {
        // Reset the dropdown and input field to defaults
        this.formView.dropdown.selectedValue = null;
        this.formView.dropdown.buttonView.set({ label: 'Type' });
        this.formView.childCountInput.selectedValue = '';
        this.formView.childCountInput.buttonView.set({ label: 'Columns' });
        this.formView.responsiveClassInput.selectedValue = '';
        this.formView.responsiveClassInput.buttonView.set({ label: 'Responsive class' });

        // Remove the form from the balloon
        this._balloon.remove(this.formView);
        this.editor.editing.view.focus();
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;

        return {
            target: view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange())
        };
    }

}

;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/conjunctions.js




class Conjunction extends delegated_corefrom_dll_reference_CKEditor5.Plugin {
    static get requires() {
        return [ConjunctionEditing, ConjunctionUI];
    }
}
;// CONCATENATED MODULE: ./js/ckeditor5_plugins/wxt_conjunctions/src/index.js


/* harmony default export */ const src = ({
    Conjunction: Conjunction,
});
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});