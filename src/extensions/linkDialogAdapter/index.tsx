import * as React from 'react'
import { toggleMark } from 'prosemirror-commands'
import LinkIcon from '../../components/icons/link'
import { Extension, ExtensionProps } from '../../types'
import { markActive } from '../../utils'
import tooltip from './tooltip'
import { EditorState } from 'prosemirror-state'

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (link: Attributes) => void, onCancel: () => void, attrs: Attributes) => void
type config = ExtensionProps & {
  openDialog: OpenDialogFn;
  attributes: string[];
}

export default class LinkDialogAdapter extends Extension {

  name = 'link'
  group = 'mark'
  showMenu = true
  private _openDialog: OpenDialogFn
  private _attributes: string[]

  constructor(props?: config) {
    super(props);

    this._openDialog = props.openDialog;
    this._attributes = props.attributes.includes('href')
      ? props.attributes
      : props.attributes.concat('href');
  }

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    return {
      group: 'mark',
      attrs: (this._attributes.concat('editing').reduce((attrs, attr) => {
        attrs[attr] = { default: '' }
        return attrs
      }, {})),
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]:not(.embed)',
          getAttrs: dom =>
            this._attributes.concat('editing').reduce((attrs, attr) => {
              attrs[attr] = dom.getAttribute(attr)
              return attrs
            }, {})
        }
      ],
      toDOM(node) {
        return ['a', node.attrs, 0];
      }
    }
  }

  get icon() {
    return <LinkIcon style={{ width: '24px', height: '24px' }} />
  }

  get plugins() {
    return [tooltip({ openDialog: this._openDialog, attributes: this._attributes })]
  }

  active(state: EditorState) {
    return false
  }

  enable(state: EditorState) {
    return !markActive(state.schema.marks.link)(state)
  }

  onClick(state: EditorState, dispatch) {
    toggleMark(state.schema.marks.link, { href: '', editing: 'true' })(
      state,
      dispatch
    )
  }
}
