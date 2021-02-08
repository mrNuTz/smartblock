import * as React from 'react';
import EditIcon from '../image/edit-icon';
import Icon from './icon'
import { Extension, ExtensionProps, Dispatch } from '../../types'
import { EditorState } from 'prosemirror-state';
import { blockActive, findSelectedNodeWithType, setNodeMarkup, getParentNodeFromState } from '../../utils';
import Button from '../../components/button';

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (attrs: Attributes) => void, onCancel: () => void, attrs: Attributes) => void
type config = ExtensionProps & {
  openDialog: OpenDialogFn;
  attributes: string[];
}

export default class Product extends Extension {
  name = 'product'
  group = 'block'
  showMenu = true
  private _openDialog: OpenDialogFn
  private _attributes: string[]

  constructor(props?: config) {
    super(props);
    this._openDialog = props.openDialog;
    this._attributes = props.attributes;
  }

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    return {
      content: 'text*',
      group: 'block',
      selectable: true,
      parseDOM: [
        {
          tag: 'div.product',
          getAttrs: dom => this._attributes.reduce((attrs, attr) => {
            attrs[attr] = dom.getAttribute(attr)
            return attrs
          }, {})
        }
      ],
      attrs: this._attributes.reduce((attrs, attr) => {
        attrs[attr] = { default: '' }
        return attrs
      }, {}),
      toDOM: node => ['div', { class: 'product', ...node.attrs },
        ['div', { class: 'foto' }],
        ['div', { class: 'text'},
          ['div', { class: 'title' }, node.attrs.title || 'Product'],
          ['div', { class: 'price' }, '€ X,XX']]]
    }
  }

  get icon() {
    return <Icon />
  }

  active(state) {
    return blockActive(state.schema.nodes.product)(state);
  }

  enable(state: EditorState) {
    const node = getParentNodeFromState(state)
    if (node.type.name !== 'paragraph' || node.content.size > 0) {
      return false;
    }
    return setNodeMarkup(state.schema.nodes.product, {})(state);
  }

  openDialog = (state: EditorState, dispatch: Dispatch) => {
    const node = findSelectedNodeWithType(state.schema.nodes.product, state);
    const onOk = (attrs) => setNodeMarkup(state.schema.nodes.product, attrs)(state, dispatch);
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
}
