/// <reference types="react" />
import { Extension, ExtensionProps } from '../types';
export default class Emphasis extends Extension {
    constructor(props?: ExtensionProps);
    get name(): string;
    get group(): string;
    get showMenu(): boolean;
    get schema(): import("../types").ExtensionSchema;
    get icon(): JSX.Element;
    active(state: any): any;
    onClick(state: any, dispatch: any): void;
}
