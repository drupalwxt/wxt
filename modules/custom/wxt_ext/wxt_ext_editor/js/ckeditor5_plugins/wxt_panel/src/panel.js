import PanelEditing from './panelediting';
import PanelUI from './panelui';
import { Plugin } from 'ckeditor5/src/core';

export default class Panel extends Plugin {
    static get requires() {
        return [PanelEditing, PanelUI];
    }
}