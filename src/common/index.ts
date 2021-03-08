import { EditorState } from 'prosemirror-state'
import { Extension } from '../types'

export const isInlineMenuVisible = (state: EditorState, inlineMenu: Extension[]): boolean => {
  const { selection } = state;
  if (!selection || !inlineMenu.length)
    return false
  else if (!selection.empty)
    return true
  else
    return inlineMenu.some(ex => ex.active && ex.active(state) && ex.showInlineMenuOnCaret)
}
