/// <reference types="react" />
import { Extension, ExtensionProps } from '../../types';
export default class Sup extends Extension {
    constructor(props?: ExtensionProps);
    name: string;
    group: string;
    showMenu: boolean;
    showInlineMenuOnCaret: boolean;
    get schema(): import("../../types").ExtensionSchema;
    get icon(): JSX.Element;
    active(state: any): any;
    onClick(state: any, dispatch: any): void;
}
