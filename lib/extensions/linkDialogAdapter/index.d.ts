/// <reference types="react" />
import { Extension, ExtensionProps } from '../../types';
import { EditorState } from 'prosemirror-state';
export declare type Attributes = {
    [attr: string]: string;
};
export declare type OpenDialogFn = (onOK: (link: Attributes) => void, onCancel: () => void, attrs: Attributes) => void;
declare type config = ExtensionProps & {
    openDialog: OpenDialogFn;
    attributes: string[];
};
export default class LinkDialogAdapter extends Extension {
    private _openDialog;
    private _attributes;
    constructor(props?: config);
    get name(): string;
    get group(): string;
    get showMenu(): boolean;
    get schema(): import("../../types").ExtensionSchema | {
        group: string;
        attrs: {
            editing: {
                default: string;
            };
        };
        inclusive: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {};
        }[];
        toDOM(node: any): any[];
    };
    get icon(): JSX.Element;
    get plugins(): import("prosemirror-state").Plugin<any, any>[];
    active(state: EditorState): boolean;
    enable(state: EditorState): boolean;
    onClick(state: EditorState, dispatch: any): boolean;
}
export {};
