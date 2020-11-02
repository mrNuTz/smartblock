import * as React from 'react';
import { setBlockType } from 'prosemirror-commands';
import * as uuid from 'uuid/v4'
import HeadingIcon from '../components/icons/heading5';
import AlignLeftIcon from '../components/icons/align-left';
import AlignCenterIcon from '../components/icons/align-center';
import AlignRightIcon from '../components/icons/align-right';
import { Extension, ExtensionProps } from '../types';
import { blockActive, getParentNodeFromState } from '../utils';
import Button from '../components/button';

export default class Heading5 extends Extension {
  constructor(props?: ExtensionProps) {
    super(props);
  }

  get name() {
    return 'heading5';
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
      parseDOM: [
        {
          tag: 'h5',
          getAttrs(dom) {
            const attr = {
              id: dom.getAttribute('id') || uuid()
            };
            if (dom.style.textAlign) {
              attr['align'] = dom.style.textAlign;
            }
            return attr;
          }
        }
      ],
      attrs: {
        align: { default: 'left' },
        id: { default: '' }
      },
      toDOM(node) {
        return [
          'h5',
          {
            style: `text-align: ${node.attrs.align}`,
            id: node.attrs.id || uuid(),
            class: this.className
          },
          0
        ]
      }
    }
  }

  get icon() {
    return <HeadingIcon style={{ width: '24px', height: '24px' }} />
  }

  active(state) {
    return blockActive(state.schema.nodes.heading5)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.heading5)(state);
  }

  customMenu({ state, dispatch }) {
    const node = getParentNodeFromState(state);
    return (
      <>
        <Button
          active={node && node.attrs.align === 'left'}
          type="button"
          onClick={() => {
            setBlockType(state.schema.nodes.heading5, {
              align: 'left'
            })(state, dispatch)
          }}
        >
          <AlignLeftIcon style={{ width: '24px', height: '24px' }} />
        </Button>
        <Button
          type="button"
          active={node && node.attrs.align === 'center'}
          onClick={() => {
            setBlockType(state.schema.nodes.heading5, {
              align: 'center'
            })(state, dispatch);
          }}
        >
          <AlignCenterIcon style={{ width: '24px', height: '24px' }} />
        </Button>
        <Button
          type="button"
          active={node && node.attrs.align === 'right'}
          onClick={() => {
            setBlockType(state.schema.nodes.heading5, {
              align: 'right'
            })(state, dispatch);
          }}
        >
          <AlignRightIcon style={{ width: '24px', height: '24px' }} />
        </Button>
      </>
    )
  }

  onClick(state, dispatch) {
    setBlockType(state.schema.nodes.heading5)(state, dispatch);
  }
}
