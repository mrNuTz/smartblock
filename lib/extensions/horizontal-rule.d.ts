/// <reference types="react" />
import { Extension, ExtensionProps } from '../types';
import { EditorState } from 'prosemirror-state';
export default class HorizontalRule extends Extension {
    name: string;
    group: string;
    showMenu: boolean;
    constructor(props?: ExtensionProps);
    get schema(): import("../types").ExtensionSchema | {
        content: string;
        group: string;
        selectable: boolean;
        parseDOM: {
            tag: string;
        }[];
        toDOM: () => string[];
    };
    get icon(): JSX.Element;
    active(state: any): boolean;
    enable(state: EditorState): boolean;
    onClick(state: any, dispatch: any): void;
}
