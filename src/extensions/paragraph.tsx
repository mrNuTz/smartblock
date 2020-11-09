import * as React from 'react'
import { setBlockType } from 'prosemirror-commands'
import ParagraphIcon from '../components/icons/paragraph'
import { Extension, ExtensionProps } from '../types'
import { blockActive } from '../utils'

export default class Paragraph extends Extension {
  constructor(props?: ExtensionProps) {
    super(props);
  }

  get name() {
    return 'paragraph';
  }

  get group() {
    return 'block';
  }

  get showMenu() {
    return true;
  }

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    return {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      attrs: {},
      toDOM: () => ['p', { class: this.className }, 0]
    }
  }

  get icon() {
    return <ParagraphIcon style={{ width: '24px', height: '24px' }} />
  }

  active(state) {
    return blockActive(state.schema.nodes.paragraph)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.paragraph)(state);
  }

  onClick(state, dispatch) {
    setBlockType(state.schema.nodes.paragraph)(state, dispatch);
  }
}
