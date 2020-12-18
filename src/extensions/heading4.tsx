import * as React from 'react';
import { setBlockType } from 'prosemirror-commands';
import { Extension, ExtensionProps } from '../types';
import { blockActive } from '../utils';

export default class Heading4 extends Extension {
  constructor(props?: ExtensionProps) {
    super(props);
  }

  get name() {
    return 'heading4';
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
      parseDOM: [{ tag: 'h4' }],
      attrs: {},
      toDOM: () => ['h4', { class: this.className }, 0]
    }
  }

  get icon() {
    return <strong style={{ fontFamily: 'sans-serif' }}>
      H<sub style={{ fontSize: '.7rem' }}>XS</sub>
    </strong>
  }

  active(state) {
    return blockActive(state.schema.nodes.heading4)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.heading4)(state);
  }

  onClick(state, dispatch) {
    setBlockType(state.schema.nodes.heading4)(state, dispatch);
  }
}
