import * as React from 'react';
import { Extension, ExtensionProps } from '../types'
import { EditorState } from 'prosemirror-state';
import { blockActive, setNodeMarkup, getParentNodeFromState } from '../utils';

export default class HorizontalRule extends Extension {
  name = 'horizontal_rule'
  group = 'block'
  showMenu = true

  constructor(props?: ExtensionProps) {
    super(props);
  }

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    return {
      content: 'text*',
      group: 'block',
      selectable: true,
      parseDOM: [{ tag: 'hr' }],
      toDOM: () => ['hr', 'foo']
    }
  }

  get icon() {
    return <strong title="horizontal-rule" style={{ fontFamily: 'sans-serif' }}>---</strong>
  }

  active(state) {
    return blockActive(state.schema.nodes.horizontal_rule)(state);
  }

  enable(state: EditorState) {
    const node = getParentNodeFromState(state)
    if (node.type.name !== 'paragraph' || node.content.size > 0) {
      return false;
    }
    return setNodeMarkup(state.schema.nodes.horizontal_rule, {})(state);
  }

  onClick(state, dispatch) {
    setNodeMarkup(state.schema.nodes.horizontal_rule, {})(state, dispatch)
  }
}
