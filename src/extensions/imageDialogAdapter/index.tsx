import * as React from 'react';
import ImageIcon from '../image/image-icon';
import { blockActive, findSelectedNodeWithType } from '../../utils';
import { Extension, Dispatch } from '../../types'
import { setBlockType } from 'prosemirror-commands';
import { EditorState } from 'prosemirror-state';
import { MediaPlugin } from '../image/plugins';
import Button from '../../components/button';
import ImagePlusIcon from '../image/image-plus-icon';

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void
type Props = {
  openDialog: OpenDialogFn;
  attributes: string[];
}

export default class ImageDialogAdapter extends Extension {
  name = 'image'
  showMenu = true
  group = 'block'
  hideBlockMenuOnFocus = true
  private _openDialog: OpenDialogFn
  private _attributes: string[]

  constructor({ openDialog, attributes, ...props }: Props) {
    super(props);
    this._openDialog = openDialog
    this._attributes = attributes.includes('src') ? attributes : attributes.concat('src')
  }

  get schema() {
    return {
      content: 'inline*',
      isolating: true,
      group: 'block',
      selectable: true,
      attrs: this._attributes.reduce((attrs, attr) => {
        attrs[attr] = { default: '' }
        return attrs
      }, {}),
      parseDOM: [{
        tag: 'figure',
        getAttrs: dom => {
          const attrs = this._attributes.reduce((attrs, attr) => {
            attrs[attr] = dom.getAttribute(attr)
            return attrs
          }, {})
          return {
            ...attrs,
            src: dom.querySelector('img').getAttribute('src'),
          }
        }
      }],
      toDOM: (node) => { // backend render
        const { src, ...attrs } = node.attrs
        return ['figure', attrs,
          ['img', { src }],
          ['figcaption', { class: 'caption' }, 0],
        ];
      }
    };
  }

  openDialog = (state: EditorState, dispatch: Dispatch) => {
    const node = findSelectedNodeWithType(state.schema.nodes.image, state);
    const onOk = (attrs) => setBlockType(state.schema.nodes.image, attrs)(state, dispatch);
    const onCancel = () => { }
    this._openDialog(onOk, onCancel, { ...node?.attrs })
  }

  customButton({ state, dispatch }) {
    const disabled = (this.enable && !this.enable(state)) || this.hideMenuOnFocus;
    return (
      <Button
        active={this.active(state)}
        disabled={disabled}
        onClick={() => {
          this.openDialog(state, dispatch)
        }}
      >
        {this.icon}
      </Button>
    )
  }
  customMenu({ state, dispatch }) {
    return (
      <>
        <Button
          onClick={() => this.openDialog(state, dispatch)}
        >
          <ImagePlusIcon style={{ width: '24px', height: '24px' }} />
        </Button>
      </>
    );
  }
  active(state) {
    return blockActive(state.schema.nodes.image)(state);
  }
  enable(state) {
    return setBlockType(state.schema.nodes.image)(state);
  }
  get icon() {
    return <ImageIcon style={{ width: '24px', height: '24px' }} />;
  }
  get plugins() {
    return [MediaPlugin()]
  }
}
