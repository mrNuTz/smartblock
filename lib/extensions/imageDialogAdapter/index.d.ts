/// <reference types="react" />
import { Extension, Dispatch } from '../../types';
import { EditorState } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
export declare type Attributes = {
    [attr: string]: string;
};
export declare type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void;
declare type Props = {
    openDialog: OpenDialogFn;
    attributes: string[];
    previewSrcFromAttrs?: (attrs: Attributes) => string;
    aspectRatio?: number;
};
export default class ImageDialogAdapter extends Extension {
    name: string;
    showMenu: boolean;
    group: string;
    private _openDialog;
    private _attributes;
    private _previewSrcFromAttrs;
    private _aspectRatio?;
    constructor({ openDialog, attributes, previewSrcFromAttrs, aspectRatio, ...props }: Props);
    get schema(): {
        content: string;
        group: string;
        selectable: boolean;
        attrs: {};
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {};
            getContent: () => Fragment<any>;
        }[];
        toDOM: (node: any) => (string | any[] | {
            class: string;
        })[];
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
    enable(state: EditorState): boolean;
    get icon(): JSX.Element;
    get plugins(): import("prosemirror-state").Plugin<any, any>[];
}
export {};
