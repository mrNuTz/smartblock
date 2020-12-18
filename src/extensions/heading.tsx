import * as React from 'react';
import { setBlockType } from 'prosemirror-commands';
import { Extension } from '../types';
import { blockActive, getParentNodeFromState } from '../utils';
import Button from '../components/button';

type Size = 'XL' | 'L' | 'M' | 'S' | 'XS';
type Sizes = [Size, ...Size[]];
type Props = {
  sizes: Sizes;
}

export default class Heading extends Extension {
  name = 'heading'
  group = 'block'
  showMenu = true
  private _sizes: Sizes

  constructor({ sizes, ...props }: Props) {
    super(props);
    this._sizes = sizes
  }

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    return {
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        {
          tag: 'h1',
          getAttrs: dom => ({
            hsize: dom.getAttribute('hsize'),
            usehtag: dom.getAttributes('usehtag')
          })
        }
      ],
      attrs: {
        hsize: { default: this._sizes[0] },
        usehtag: { default: 'true' }
      },
      toDOM: node => ['h1', node.attrs, 0]
    }
  }

  get icon() {
    return <strong style={{ fontFamily: 'sans-serif' }}>H</strong>
  }

  active(state) {
    return blockActive(state.schema.nodes.heading)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.heading)(state);
  }

  customMenu({ state, dispatch }) {
    const node = getParentNodeFromState(state);
    return (<>
      {
        this._sizes.map(hsize => (
          <Button
            key={hsize}
            active={node && node.attrs.hsize === hsize}
            type="button"
            onClick={() => {
              setBlockType(state.schema.nodes.heading, {
                ...node.attrs,
                hsize,
              })(state, dispatch)
            }}
          >
            <strong style={{ fontFamily: 'Consolas, Menlo, sans-serif', fontSize: '1rem' }}>{hsize}</strong>
          </Button>
        ))
      }
      <Button
        type="button"
        active={node && node.attrs.usehtag}
        title="use h-tag"
        onClick={() => {
          setBlockType(state.schema.nodes.heading, {
            ...node.attrs,
            usehtag: node.attrs.usehtag ? '' : 'true',
          })(state, dispatch);
        }}
      >
        <strong style={{ fontFamily: 'Consolas, Menlo, sans-serif', fontSize: '1rem' }}>&lt;h&gt;</strong>
      </Button>
    </>)
  }

  onClick(state, dispatch) {
    setBlockType(state.schema.nodes.heading)(state, dispatch);
  }
}
