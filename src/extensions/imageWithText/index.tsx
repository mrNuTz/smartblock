import * as React from 'react';
import FloatImageIcon from '../../components/icons/float-image';
import ImageIcon from '../image/image-icon';
import { blockActive, findSelectedNodeWithType, setNodeMarkup } from '../../utils';
import { Extension, Dispatch } from '../../types'
import { EditorState } from 'prosemirror-state';
import { MediaPlugin } from '../image/plugins';
import Button from '../../components/button';
import { wrapInList } from 'prosemirror-schema-list';

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void
type Props = {
  openDialog: OpenDialogFn;
  attributes: string[];
  previewSrcFromAttrs?: (attrs: Attributes) => string;
}

export default class ImageWithText extends Extension {
  name = 'image_with_text'
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
      content: 'paragraph block*',
      group: 'block',
      attrs: this._attributes.reduce((attrs, attr) => {
        attrs[attr] = { default: '' }
        return attrs
      }, {}),
      parseDOM: [{
        tag: 'section',
        getAttrs: dom => {
          const img = dom.querySelector('img');
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
        return ['section', {},
          ['figure', { class: 'img-float-left' }, ['img', { ...attrs, src, _src }]],
          ['main', {}, 0],
        ];
      }
    };
  }

  openDialog = (state: EditorState, dispatch: Dispatch) => {
    const node = findSelectedNodeWithType(state.schema.nodes.image_with_text, state);
    const onOk = (attrs) => node
      ? setNodeMarkup(state.schema.nodes.image_with_text, attrs)(state, dispatch)
      : wrapInList(state.schema.nodes.image_with_text, attrs)(state, dispatch);
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
          <ImageIcon style={{ width: '24px', height: '24px' }} />
        </Button>
      </>
    );
  }
  active(state) {
    return blockActive(state.schema.nodes.image_with_text)(state);
  }
  enable(state) {
    return wrapInList(state.schema.nodes.image_with_text)(state);
  }
  get icon() {
    return <FloatImageIcon style={{ width: '24px', height: '24px' }} />;
  }
  get plugins() {
    return [MediaPlugin()]
  }
}
