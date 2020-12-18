/// <reference types="react" />
import { Extension } from '../types';
declare type Size = 'XL' | 'L' | 'M' | 'S' | 'XS';
declare type Sizes = [Size, ...Size[]];
declare type Props = {
    sizes: Sizes;
};
export default class Heading extends Extension {
    name: string;
    group: string;
    showMenu: boolean;
    private _sizes;
    constructor({ sizes, ...props }: Props);
    get schema(): import("../types").ExtensionSchema | {
        content: string;
        group: string;
        defining: boolean;
        parseDOM: {
            tag: string;
            getAttrs: (dom: any) => {
                hsize: any;
                usehtag: any;
            };
        }[];
        attrs: {
            hsize: {
                default: Size;
            };
            usehtag: {
                default: string;
            };
        };
        toDOM: (node: any) => any[];
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
export {};
