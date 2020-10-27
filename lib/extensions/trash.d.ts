/// <reference types="react" />
import { Extension } from '../types';
declare type Props = {
    i18n?: {
        remove_block: string;
    };
};
export default class Trash implements Extension {
    i18n: {
        remove_block: string;
    };
    constructor(props?: Props);
    get name(): string;
    get group(): string;
    get showMenu(): boolean;
    get icon(): JSX.Element;
    get btnColor(): 'black';
    onClick(state: any, dispatch: any): void;
}
export {};
