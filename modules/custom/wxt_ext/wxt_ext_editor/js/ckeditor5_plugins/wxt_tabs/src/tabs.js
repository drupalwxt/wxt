import WXTTabsEditing from './wxttabediting';
import WXTTabsUI from './wxttabui';
import { Plugin } from 'ckeditor5/src/core';

export default class WXTTabs extends Plugin {
    static get requires() {
        return [WXTTabsEditing, WXTTabsUI];
    }
}
