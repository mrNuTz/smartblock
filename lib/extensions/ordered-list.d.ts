/// <reference types="react" />
import { Extension, ExtensionProps } from '../types';
export default class OrderedList extends Extension {
    constructor(props?: ExtensionProps);
    get name(): string;
    get group(): string;
    get showMenu(): boolean;
    get schema(): import("../types").ExtensionSchema | {
        content: string;
        group: string;
        parseDOM: {
            tag: string;
        }[];
        attrs: {};
        toDOM(node: any): (string | number | {
            class: any;
        })[];
    };
    get icon(): JSX.Element;
    get hideBlockMenuOnFocus(): boolean;
    active(state: any): boolean;
    enable(state: any): boolean;
    onClick(state: any, dispatch: any): boolean;
    customMenu({ state, dispatch }: {
        state: any;
        dispatch: any;
    }): JSX.Element;
}
