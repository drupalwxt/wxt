import AndOrEditing from './andorediting';
import AndOrEditingUI from './andorui';
import { Plugin } from 'ckeditor5/src/core';

export default class AndOr extends Plugin {
    static get requires() {
        return [AndOrEditing, AndOrEditingUI];
    }
}