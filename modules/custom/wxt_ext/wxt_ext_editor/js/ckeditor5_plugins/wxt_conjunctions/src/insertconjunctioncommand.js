import { Command } from 'ckeditor5/src/core';

export default class InsertConjunctionCommand extends Command {
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
