import { undoInputRule } from 'prosemirror-inputrules';
import { EditorState } from 'prosemirror-state';
import { joinUp, joinDown, lift, selectParentNode } from 'prosemirror-commands';
import { Extension } from '../types';
export default class DefaultKeys implements Extension {
    get name(): string;
    get showMenu(): boolean;
    keys(): {
        Enter: (state: EditorState<any>, dispatch: any, view: any) => boolean;
        'Mod-z': any;
        'Shift-Mod-z': any;
        Backspace: typeof undoInputRule;
        'Mod-y': any;
        'Alt-ArrowUp': typeof joinUp;
        'Alt-ArrowDown': typeof joinDown;
        'Mod-BracketLeft': typeof lift;
        Escape: typeof selectParentNode;
        'Mod-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(state: EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
        'Shift-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(state: EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
        'Ctrl-Enter': <S extends import("prosemirror-model").Schema<any, any> = any>(state: EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
        'Mod-_': (state: any, dispatch: any) => boolean;
        Tab: any;
        'Shift-Tab': any;
    };
}
