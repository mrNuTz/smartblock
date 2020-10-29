import * as React from 'react'
import { toggleMark } from 'prosemirror-commands'
import LinkIcon from '../../components/icons/link'
import { Extension, ExtensionProps } from '../../types'
import { markActive, getMarkInSelection } from '../../utils'
import tooltip from './tooltip'

export type Attributes = { [attr: string]: string }
export type OpenDialogFn = (onOK: (link: Attributes) => void, onCancel: () => void) => void
type config = ExtensionProps & {
  openDialog: OpenDialogFn;
  attributes: string[];
}

export default class LinkDialogAdapter extends Extension {

  private _openDialog: OpenDialogFn
  private _attributes: string[]

  constructor(props?: config) {
    super(props);

    this._openDialog = props.openDialog;
    this._attributes = props.attributes;
  }

  get name() {
    return 'link'
  }

  get group() {
    return 'mark'
  }

  get showMenu() {
    return true
  }

  get schema() {
    if (this.customSchema) {
      return this.customSchema;
    }
    const { className } = this;
    return {
      group: 'mark',
      attrs: {
        editing: { default: true },
        ...(this._attributes.reduce((attrs, attr) => {
          attrs[attr] = { default: '' }
          return attrs
        }, {}))
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]:not(.embed)',
          getAttrs(dom) {
            return this._attributes.reduce((attrs, attr) => {
              attrs[attr] = dom.getAttribute(attr)
              return attrs
            }, {})
          }
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
    return [tooltip({ openDialog: this._openDialog, attributes: this._attributes})]
  }

  active(state) {
    console.log(state)
    return markActive(state.schema.marks.link)(state)
  }

  onClick(state, dispatch) {
    if (markActive(state.schema.marks.link)(state)) {
      const link = getMarkInSelection('link', state);
      const { selection } = state;
      const { $anchor } = selection;
      const { nodeBefore, nodeAfter, pos } = $anchor;
      let beforePos = selection.from;
      let afterPos = selection.to;
      if (beforePos === afterPos && nodeBefore && nodeAfter) {
        beforePos = pos - nodeBefore.nodeSize;
        afterPos = pos + nodeAfter.nodeSize;
      }
      const { tr } = state;
      tr.removeMark(beforePos, afterPos, state.schema.marks.link);
      tr.addMark(
        beforePos,
        afterPos,
        state.schema.marks.link.create({ href: link.attrs.href, editing: true })
      )
      // dispatch
      dispatch(tr.scrollIntoView());
      return true;
    }

    toggleMark(state.schema.marks.link, { href: '', editing: true })(
      state,
      dispatch
    )
  }
}
