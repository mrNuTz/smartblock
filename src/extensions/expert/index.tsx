import * as React from 'react';
import EditIcon from '../image/edit-icon';
import Icon from './icon'
import { Extension, ExtensionProps, Dispatch } from '../../types'
import { EditorState } from 'prosemirror-state';
import { blockActive, findSelectedNodeWithType, setNodeMarkup, getParentNodeFromState } from '../../utils';
import Button from '../../components/button';

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (link: Attributes) => void, onCancel: () => void, attrs: Attributes) => void
type config = ExtensionProps & {
  openDialog: OpenDialogFn;
  attributes: string[];
}

export default class Expert extends Extension {
  name = 'expert'
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
      content: 'inline*',
      isolating: true,
      group: 'block',
      selectable: true,
      parseDOM: [
        {
          tag: 'div.expert',
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
      toDOM: node => ['div',
        { class: 'expert', ...node.attrs },
        ['div', { class: 'content' },
          ['div', { class: 'foto' }],
          ['div', { class: 'text'},
            ['div', { class: 'name' }, node.attrs.name || ''],
            ['div', { class: 'function' }, node.attrs.function || '']]],
        ['div', { class: 'hole' }, 0]
      ]
    }
  }

  get icon() {
    return <Icon />
  }

  active(state) {
    return blockActive(state.schema.nodes.expert)(state);
  }

  enable(state: EditorState) {
    const node = getParentNodeFromState(state)
    if (node.type.name !== 'paragraph' || node.content.size > 0) {
      return false;
    }
    return setNodeMarkup(state.schema.nodes.expert, {})(state);
  }

  openDialog = (state: EditorState, dispatch: Dispatch) => {
    const node = findSelectedNodeWithType(state.schema.nodes.expert, state);
    const onOk = (attrs) => setNodeMarkup(state.schema.nodes.expert, attrs)(state, dispatch);
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
