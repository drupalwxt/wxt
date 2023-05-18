import AlertEditing from './alertediting';
import AlertUI from './alertui';
import { Plugin } from 'ckeditor5/src/core';

export default class Alert extends Plugin {
    static get requires() {
        return [AlertEditing, AlertUI];
    }
}