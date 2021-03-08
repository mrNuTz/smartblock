import * as React from 'react'
import { toggleMark } from 'prosemirror-commands'
import { Extension, ExtensionProps } from '../../types'
import { markActive } from '../../utils'

export default class Sup extends Extension {
  constructor(props?: ExtensionProps) {
    super(props);
  }

  name = 'sup'
  group = 'mark'
  showMenu = true
  showInlineMenuOnCaret = true

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    return {
      group: 'mark',
      parseDOM: [{ tag: 'sup' }],
      toDOM: () => ['sup']
    }
  }

  get icon() {
    return <strong style={{ fontFamily: 'sans-serif' }}>x<sup>2</sup></strong>
  }

  active(state) {
    return markActive(state.schema.marks.sup)(state);
  }

  onClick(state, dispatch) {
    toggleMark(state.schema.marks.sup)(state, dispatch);
  }
}
