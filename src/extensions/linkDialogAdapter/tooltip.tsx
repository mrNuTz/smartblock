import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import Trash from '../../components/icons/trash';
import Edit from '../../components/icons/edit';
import { render, unmountComponentAtNode } from 'react-dom';
import { getScrollTop } from '../../utils';
import { OpenDialogFn } from './';

const TOOLTIP_WIDTH = 92

const clamp = (v, min, max) => v < min ? min : v > max ? max : v

const calcTopLeft = (coords: { top: number; left: number }) => {
  const top = coords.top + getScrollTop() + 43;
  const left = clamp(coords.left - 30, 0, window.innerWidth - TOOLTIP_WIDTH);
  return { top, left }
}

const TooltipComponent = (props: {
  linkCoords?: { top: number; left: number };
  onDel(): void;
  onEdit(): void;
}) => {
  const { linkCoords, onDel, onEdit } = props;

  return !!linkCoords && (
    <div className="smartblock-tooltip-wrap" style={calcTopLeft(linkCoords)}>
      <div className="smartblock-tooltip-wrap-arrow" style={{ left: 20 }} />
      <div className="smartblock-link-dialog-tooltip">
        <div className="smartblock-tooltip-inner">
          <button
            className="smartblock-tooltip-btn"
            onClick={onEdit}
            style={{ paddingLeft: '7px' }}>
            <Edit
              style={{ width: '24px', height: '24px', overflow: 'hidden' }}
            />
          </button>
          <button
            className="smartblock-tooltip-btn"
            onClick={onDel}
            style={{ paddingLeft: '7px' }}>
            <Trash
              fill="#fff"
              style={{ width: '24px', height: '24px', overflow: 'hidden' }}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

const filterAttrs = (attrs, attributes) => Object.entries(attrs).reduce((res, [k, v]) => {
  if (v && k !== 'editing' && attributes.includes(k))
    res[k] = v;
  return res;
}, {});

type PlacedLink = {
  from: number;
  to: number;
  attrs: {};
  editing: string;
  coords: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

const getSelectedLink = (view: EditorView, attributes): PlacedLink => {
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

type TooltipProps = {
  attributes: string[];
  openDialog: OpenDialogFn;
  view: EditorView;
}

class Tooltip {
  tooltip: HTMLDivElement;
  private _attributes: string[];
  private _openDialog: OpenDialogFn;
  private _storedLink?: PlacedLink = null;
  private _dialogOpen: boolean = false;

  constructor({ attributes, openDialog, view }: TooltipProps) {
    this._attributes = attributes
    this._openDialog = openDialog

    this.tooltip = document.createElement('div');
    document.body.appendChild(this.tooltip);
    this.update(view);
  }

  _onDel = view => () => {
    if (this._dialogOpen) return
    const { tr } = view.state;
    tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
    this._storedLink = null;
    view.dispatch(tr);
  }

  _onEdit = view => () => {
    if (this._dialogOpen) return
    const onOk = (attrs) => {
      const { tr } = view.state;
      tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
      tr.addMark(
        this._storedLink.from,
        this._storedLink.to,
        view.state.schema.marks.link.create({ ...attrs, editing: '' })
      );
      this._dialogOpen = false;
      this._storedLink = null;
      view.dispatch(tr);
    }
    const onCancel = () => {
      const { tr } = view.state;
      tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
      if (Object.values(this._storedLink.attrs).some(v => v)) {
        tr.addMark(
          this._storedLink.from,
          this._storedLink.to,
          view.state.schema.marks.link.create({ ...this._storedLink.attrs, editing: '' })
        );
      }
      this._dialogOpen = false;
      this._storedLink = null;
      view.dispatch(tr);
    }
    this._dialogOpen = true
    this._openDialog(onOk, onCancel, this._storedLink.attrs)
  }

  update(view: EditorView) {
    const selectedLink = getSelectedLink(view, this._attributes);

    if ((!this._storedLink || !this._storedLink.editing) && selectedLink && !this._dialogOpen) {
      this._storedLink = selectedLink
    } else if (
      this._storedLink && !this._dialogOpen
      && (!selectedLink || selectedLink.from !== this._storedLink.from)
    ) {
      if (this._storedLink.editing) {
        const { tr } = view.state;
        tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
        this._storedLink = null
        view.dispatch(tr);
        return;
      }
      this._storedLink = null
    }

    render(
      <TooltipComponent
        linkCoords={this._storedLink && this._storedLink.coords}
        onDel={this._onDel(view)}
        onEdit={this._onEdit(view)}
      />,
      this.tooltip);
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
