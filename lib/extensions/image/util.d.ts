import { EditorState } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
export declare const deleteSelectionAtPos: (state: EditorState, pos: any, dispatch: any) => Transform;
export declare const getNodeIndexFromPos: (doc: EditorState['doc'], pos: number) => any;
export declare const getPosFromIndex: (doc: EditorState['doc'], index: number) => number;
export declare const hasClass: (el: HTMLElement, className: string) => boolean;
export declare const readFiles: (files: FileList) => Promise<any[]>;
