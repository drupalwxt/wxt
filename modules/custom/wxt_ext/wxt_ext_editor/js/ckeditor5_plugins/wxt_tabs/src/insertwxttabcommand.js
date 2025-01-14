import { Command } from 'ckeditor5/src/core';

export default class InsertWXTTabsCommand extends Command {
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
