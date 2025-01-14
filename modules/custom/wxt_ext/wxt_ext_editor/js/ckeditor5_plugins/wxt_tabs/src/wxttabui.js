import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';
import tabIcon from '../../../../icons/tab.svg';

export default class WXTTabsUI extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertWXTTabs', (locale) => {
      const command = editor.commands.get('insertWXTTabs');
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: 'Tabs',
        icon: tabIcon,
        tooltip: true,
        withText: true,
      });

      buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      this.listenTo(buttonView, 'execute', () => editor.execute('insertWXTTabs'));

      return buttonView;
    });
  }
}
