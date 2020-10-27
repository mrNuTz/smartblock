import { Schema } from 'prosemirror-model';
import { Extension, ExtensionProps } from '../types';
export default class ListItem extends Extension {
    constructor(props?: ExtensionProps);
    get name(): string;
    get showMenu(): boolean;
    get schema(): import("../types").ExtensionSchema | {
        content: string;
        group: string;
        parseDOM: {
            tag: string;
            getAttrs(dom: any): {
                id: any;
            };
        }[];
        attrs: {
            id: {
                default: string;
            };
        };
        toDOM(node: any): (string | number)[];
        defining: boolean;
    };
    keys(schema: Schema): {
        Enter: (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
        Tab: (state: import("prosemirror-state").EditorState<Schema<any, any>>, dispatch?: (tr: import("prosemirror-state").Transaction<Schema<any, any>>) => void) => boolean;
        'Shift-Tab': import("prosemirror-commands").Command<any>;
    };
}
