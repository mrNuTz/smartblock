/// <reference types="react" />
import { Extension, Dispatch } from '../../types';
import { EditorState } from 'prosemirror-state';
export declare type Attributes = {
    [attr: string]: string;
};
export declare type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void;
declare type Props = {
    openDialog: OpenDialogFn;
    attributes: string[];
};
export default class ImageWithText extends Extension {
    name: string;
    showMenu: boolean;
    group: string;
    hideBlockMenuOnFocus: boolean;
    private _openDialog;
    private _attributes;
    constructor({ openDialog, attributes, ...props }: Props);
    get schema(): {
        content: string;
        group: string;
        attrs: {};
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {};
        }[];
        toDOM: (node: any) => {}[];
    };
    openDialog: (state: EditorState, dispatch: Dispatch) => void;
    customButton({ state, dispatch }: {
        state: any;
        dispatch: any;
    }): JSX.Element;
    customMenu({ state, dispatch }: {
        state: any;
        dispatch: any;
    }): JSX.Element;
    active(state: any): boolean;
    enable(state: any): boolean;
    get icon(): JSX.Element;
    get plugins(): import("prosemirror-state").Plugin<any, any>[];
}
export {};
