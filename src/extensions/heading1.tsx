import * as React from 'react';
import { setBlockType } from 'prosemirror-commands';
import { Extension, ExtensionProps } from '../types';
import { blockActive } from '../utils';

export default class Heading1 extends Extension {
  constructor(props?: ExtensionProps) {
    super(props);
  }

  get name() {
    return 'heading1';
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
      defining: true,
      parseDOM: [{ tag: 'h1' }],
      attrs: {},
      toDOM: () => ['h1', { class: this.className }, 0]
    }
  }

  get icon() {
    return <strong style={{ fontFamily: 'sans-serif' }}>H<sub>L</sub></strong>
  }

  active(state) {
    return blockActive(state.schema.nodes.heading1)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.heading1)(state);
  }

  onClick(state, dispatch) {
    setBlockType(state.schema.nodes.heading1)(state, dispatch);
  }
}
