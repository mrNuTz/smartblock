import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { render, unmountComponentAtNode } from 'react-dom';
import TooltipReact from './tooltip-react';
import { getScrollTop } from '../../utils';
import { OpenDialogFn } from './';

const TOOLTIP_WIDTH = 92

const filterAttrs = (attrs, attributes) => Object.entries(attrs).reduce((res, [k, v]) => {
  if (v && k !== 'editing' && attributes.includes(k))
    res[k] = v;
  return res;
}, {});

const clamp = (v, min, max) => v < min ? min : v > max ? max : v

const calcTopLeft = (coords: { top: number; left: number }) => {
  const top = coords.top + getScrollTop() + 43;
  const left = clamp(coords.left - 30, 0, window.innerWidth - TOOLTIP_WIDTH);
  return { top, left }
}

let storedLink = null
let dialogOpen = false

const getHeadLink = (view: EditorView, attributes) => {
  const { $head, head } = view.state.selection
  const { nodeBefore, nodeAfter } = $head
  const link =
    (nodeBefore && nodeBefore.marks.find(m => m.type.name === 'link'))
    || (nodeAfter && nodeAfter.marks.find(m => m.type.name === 'link'))
    || null
  if (!link)
    return null
  let from = head
  let to = head
  if (nodeBefore && nodeBefore.marks.some(m => m.type.name === 'link'))
    from -= nodeBefore.nodeSize
  if (nodeAfter && nodeAfter.marks.some(m => m.type.name === 'link'))
    to += nodeAfter.nodeSize
  return {
    from,
    to,
    attrs: filterAttrs(link.attrs, attributes),
    editing: link.attrs.editing,
    coords: view.coordsAtPos(from),
  }
}

const TooltipComponent = (props: {
  view: EditorView;
  attributes: string[];
  openDialog: OpenDialogFn;
}) => {
  const { view, openDialog, attributes } = props;
  const selectedLink = getHeadLink(view, attributes)

  if ((!storedLink || !storedLink.editing) && selectedLink && !dialogOpen) {
    storedLink = selectedLink
  } else if (storedLink && !selectedLink && !dialogOpen) {
    if (storedLink.editing) {
      const { tr } = view.state;
      tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
      view.dispatch(tr);
    }
    storedLink = null
  }

  const onDel = () => {
    if (dialogOpen) return
    const { tr } = view.state;
    tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
    storedLink = null;
    view.dispatch(tr);
  }
  const onEdit = () => {
    if (dialogOpen) return
    const onOk = (attrs) => {
      const { tr } = view.state;
      tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
      tr.addMark(
        storedLink.from,
        storedLink.to,
        view.state.schema.marks.link.create({ ...attrs, editing: '' })
      );
      dialogOpen = false;
      storedLink = null;
      view.dispatch(tr);
    }
    const onCancel = () => {
      const { tr } = view.state;
      tr.removeMark(storedLink.from, storedLink.to, view.state.schema.marks.link);
      if (Object.values(storedLink.attrs).some(v => v)) {
        tr.addMark(
          storedLink.from,
          storedLink.to,
          view.state.schema.marks.link.create({ ...storedLink.attrs, editing: '' })
        );
      }
      dialogOpen = false;
      storedLink = null;
      view.dispatch(tr);
    }
    dialogOpen = true
    openDialog(onOk, onCancel, storedLink.attrs)
  }
  return !!storedLink && (
    <div className="smartblock-tooltip-wrap" style={calcTopLeft(storedLink.coords)}>
      <div className="smartblock-tooltip-wrap-arrow" style={{ left: 20 }} />
      <TooltipReact onDel={onDel} onEdit={onEdit} />
    </div>
  )
}

type TooltipProps = {
  attributes: string[];
  openDialog: OpenDialogFn;
  view: EditorView;
}

class Tooltip {
  tooltip: HTMLDivElement
  private _attributes: string[]
  private _openDialog: OpenDialogFn

  constructor({ attributes, openDialog, view }: TooltipProps) {
    this._attributes = attributes
    this._openDialog = openDialog

    this.tooltip = document.createElement('div');
    document.body.appendChild(this.tooltip);
    this.update(view);
  }
  render(view: EditorView) {
    render(
      <TooltipComponent
        view={view}
        attributes={this._attributes}
        openDialog={this._openDialog}
      />,
      this.tooltip);
  }
  update(view: EditorView) {
    this.render(view);
  }
  destroy() {
    unmountComponentAtNode(this.tooltip);
    document.body.removeChild(this.tooltip);
  }
}

export default ({ attributes, openDialog }) => new Plugin({
  view(view) {
    return new Tooltip({ attributes, openDialog, view });
  }
})
