import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { render, unmountComponentAtNode } from 'react-dom';
import TooltipReact from './tooltip-react';
import { getMarkInSelection, getScrollTop } from '../../utils';
import { OpenDialogFn, Attributes } from './'

const TOOLTIP_WIDTH = 92

const filterAttrs = attrs => Object.entries(attrs).reduce((res, [k, v]) => {
  if (v && k !== 'editing')
    res[k] = v;
  return res;
}, {});

const clamp = (v, min, max) => v < min ? min : v > max ? max : v

let linkPos = null

const TooltipComponent = (props: { view: EditorView; attributes: string[]; openDialog: OpenDialogFn }) => {
  const { view, openDialog } = props;
  const { state } = view
  const { selection } = state
  const { from, to, $head } = selection;
  const link = getMarkInSelection('link', state);

  if (from === to || !link || !link.attrs.editing) {
    if (linkPos && (!link || link.attrs.editing)) {
      const { tr } = state;
      tr.removeMark(linkPos.from, linkPos.to, state.schema.marks.link);
      view.dispatch(tr);
    }
    linkPos = null;
    return null;
  }
  linkPos = { from, to }

  const attrs = filterAttrs(link.attrs)
  const onOk = (attrs) => {
    const { tr } = state;
    tr.removeMark(from, to, state.schema.marks.link);
    tr.addMark(
      from,
      to,
      state.schema.marks.link.create({ ...attrs, editing: '' })
    );
    view.dispatch(tr);
  }
  const onCancel = () => {
    const { tr } = state;
    tr.removeMark(from, to, state.schema.marks.link);
    if (Object.values(attrs).some(v => v)) {
      tr.addMark(
        from,
        to,
        view.state.schema.marks.link.create({ ...attrs, editing: '' })
      );
    }
    view.dispatch(tr);
  }
  const onEdit = () => {
    console.log('onEdit')
    openDialog(onOk, onCancel, attrs)
  }
  const onDel = () => {
    const { tr } = state;
    tr.removeMark(from, to, state.schema.marks.link);
    view.dispatch(tr);
  }

  const coords = view.coordsAtPos($head.pos);
  const top = coords.top + getScrollTop() + 43;
  const left = clamp(coords.left - 30, 0, window.innerWidth - TOOLTIP_WIDTH);

  return (
    <div className="smartblock-tooltip-wrap" style={{ left, top }}>
      <div className="smartblock-tooltip-wrap-arrow" style={{ left: 20 }}/>
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
