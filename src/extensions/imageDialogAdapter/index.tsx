import * as React from 'react';
import ImageIcon from '../image/image-icon';
import EditIcon from '../image/edit-icon';
import { blockActive, findSelectedNodeWithType, getParentNodeFromState } from '../../utils';
import { Extension, Dispatch } from '../../types'
import { setBlockType } from 'prosemirror-commands';
import { EditorState } from 'prosemirror-state';
import { MediaPlugin } from '../image/plugins';
import Button from '../../components/button';

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void
type Props = {
  openDialog: OpenDialogFn;
  attributes: string[];
  previewSrcFromAttrs?: (attrs: Attributes) => string;
}

export default class ImageDialogAdapter extends Extension {
  name = 'image'
  showMenu = true
  group = 'block'
  hideBlockMenuOnFocus = true
  private _openDialog: OpenDialogFn
  private _attributes: string[]
  private _previewSrcFromAttrs: (attrs: Attributes) => string

  constructor({ openDialog, attributes, previewSrcFromAttrs, ...props }: Props) {
    super(props);
    this._openDialog = openDialog
    this._attributes = attributes.includes('src') ? attributes : attributes.concat('src')
    this._previewSrcFromAttrs = previewSrcFromAttrs || (({ src }) => src)
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
          const img = dom.querySelector('img')
          return img ? this._attributes.concat('_src').reduce((attrs, attr) => {
            if (attr === 'src') return attrs
            const a = img.getAttribute(attr)
            if (a) attrs[attr === '_src' ? 'src' : attr] = a
            return attrs
          }, {}) : {}
        }
      }],
      toDOM: (node) => {
        const src = this._previewSrcFromAttrs(node.attrs)
        const { src: _src, ...attrs } = node.attrs
        return ['figure', { class: 'no-edit' },
          ['img', { ...attrs, src, _src }],
          ['div', { class: 'hole' }, 0],
          attrs.caption ? ['figcaption', { class: 'caption' }, attrs.caption] : ['div'],
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
          <EditIcon style={{ width: '24px', height: '24px' }} />
        </Button>
      </>
    );
  }
  active(state) {
    return blockActive(state.schema.nodes.image)(state);
  }
  enable(state: EditorState) {
    const node = getParentNodeFromState(state)
    if (node.type.name !== 'paragraph' || node.content.size > 0) {
      return false;
    }
    return setBlockType(state.schema.nodes.image)(state);
  }
  get icon() {
    return <ImageIcon style={{ width: '24px', height: '24px' }} />;
  }
  get plugins() {
    return [MediaPlugin()]
  }
}
