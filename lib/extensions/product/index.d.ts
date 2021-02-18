/// <reference types="react" />
import { Extension, ExtensionProps, Dispatch } from '../../types';
import { EditorState } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
export declare type Attributes = {
    [attr: string]: string;
};
export declare type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void;
declare type config = ExtensionProps & {
    openDialog: OpenDialogFn;
    attributes: string[];
};
export default class Product extends Extension {
    name: string;
    group: string;
    showMenu: boolean;
    private _openDialog;
    private _attributes;
    constructor(props?: config);
    get schema(): import("../../types").ExtensionSchema | {
        content: string;
        group: string;
        selectable: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {};
            getContent: () => Fragment<any>;
        }[];
        attrs: {};
        toDOM: (node: any) => any[];
    };
    get icon(): JSX.Element;
    active(state: any): boolean;
    enable(state: EditorState): boolean;
    openDialog: (state: EditorState, dispatch: Dispatch) => void;
    customButton({ state, dispatch }: {
        state: any;
        dispatch: any;
    }): JSX.Element;
    customMenu({ state, dispatch }: {
        state: any;
        dispatch: any;
    }): JSX.Element;
}
export {};
