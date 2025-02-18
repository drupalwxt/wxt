import ConjunctionEditing from './conjunctionediting';
import ConjunctionUI from './conjunctionui';
import { Plugin } from 'ckeditor5/src/core';

export default class Conjunction extends Plugin {
    static get requires() {
        return [ConjunctionEditing, ConjunctionUI];
    }
}