/// <reference types="react" />
import { Extension, ExtensionProps } from '../types';
export default class Paragraph extends Extension {
    constructor(props?: ExtensionProps);
    get name(): string;
    get group(): string;
    get showMenu(): boolean;
    get schema(): import("../types").ExtensionSchema | {
        content: string;
        group: string;
        parseDOM: {
            tag: string;
            getAttrs(dom: any): {};
        }[];
        attrs: {
            align: {
                default: string;
            };
        };
        toDOM: (node: any) => (string | number | {
            style: string;
            class: string;
        })[];
    };
    get icon(): JSX.Element;
    active(state: any): boolean;
    enable(state: any): boolean;
    customMenu({ state, dispatch }: {
        state: any;
        dispatch: any;
    }): JSX.Element;
    onClick(state: any, dispatch: any): void;
}
