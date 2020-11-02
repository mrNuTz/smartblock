import { Extension } from '../types';
declare type Config = {
    placeholder: string;
};
export default class DefaultPlugins implements Extension {
    placeholder: string;
    constructor(config: Config);
    get name(): string;
    get showMenu(): boolean;
    get plugins(): any[];
}
export {};
