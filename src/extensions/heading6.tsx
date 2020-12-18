import * as React from 'react';
import { setBlockType } from 'prosemirror-commands';
import HeadingIcon from '../components/icons/heading6';
import { Extension, ExtensionProps } from '../types';
import { blockActive } from '../utils';

export default class Heading6 extends Extension {
  constructor(props?: ExtensionProps) {
    super(props);
  }

  get name() {
    return 'heading6';
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
      parseDOM: [{ tag: 'h6' }],
      attrs: {},
      toDOM: () => ['h6', { class: this.className }, 0]
    }
  }

  get icon() {
    return <HeadingIcon style={{ width: '24px', height: '24px' }} />
  }

  active(state) {
    return blockActive(state.schema.nodes.heading6)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.heading6)(state);
  }

  onClick(state, dispatch) {
    setBlockType(state.schema.nodes.heading6)(state, dispatch);
  }
}
