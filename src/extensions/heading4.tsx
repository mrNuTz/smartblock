import * as React from 'react';
import { setBlockType } from 'prosemirror-commands';
import HeadingIcon from '../components/icons/heading4';
import AlignLeftIcon from '../components/icons/align-left';
import AlignCenterIcon from '../components/icons/align-center';
import AlignRightIcon from '../components/icons/align-right';
import { Extension, ExtensionProps } from '../types';
import { blockActive, getParentNodeFromState } from '../utils';
import Button from '../components/button';

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
      parseDOM: [
        {
          tag: 'h4',
          getAttrs(dom) {
            const attr = {};
            if (dom.style.textAlign) {
              attr['align'] = dom.style.textAlign;
            }
            return attr;
          }
        }
      ],
      attrs: {
        align: { default: 'left' },
      },
      toDOM(node) {
        return [
          'h4',
          {
            style: `text-align: ${node.attrs.align}`,
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
    return blockActive(state.schema.nodes.heading4)(state);
  }

  enable(state) {
    return setBlockType(state.schema.nodes.heading4)(state);
  }

  customMenu({ state, dispatch }) {
    const node = getParentNodeFromState(state);
    return (
      <>
        <Button
          active={node && node.attrs.align === 'left'}
          type="button"
          onClick={() => {
            setBlockType(state.schema.nodes.heading4, {
              align: 'left'
            })(state, dispatch);
          }}
        >
          <AlignLeftIcon style={{ width: '24px', height: '24px' }} />
        </Button>
        <Button
          type="button"
          active={node && node.attrs.align === 'center'}
          onClick={() => {
            setBlockType(state.schema.nodes.heading4, {
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
            setBlockType(state.schema.nodes.heading4, {
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
    setBlockType(state.schema.nodes.heading4)(state, dispatch);
  }
}
