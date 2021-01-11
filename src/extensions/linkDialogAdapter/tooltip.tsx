import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin, TextSelection } from 'prosemirror-state';
import Trash from '../../components/icons/trash';
import Edit from '../../components/icons/edit';
import { render, unmountComponentAtNode } from 'react-dom';
import { getOffset, getScrollTop } from '../../utils';
import { OpenDialogFn } from './';

const TOOLTIP_WIDTH = 92
const ARROWOFFSET = 30;
const ARROWTOPOFFSET = 43;

const calcTopLeft = (view: EditorView) => {
  const { selection } = view.state;
  const offsetLeft = getOffset(view.dom).left;
  const coords = view.coordsAtPos(selection.$head.pos);
  const offsetTop = getOffset(view.dom).top;
  const top = coords.top + getScrollTop() + ARROWTOPOFFSET - offsetTop;
  let left = coords.left - ARROWOFFSET - offsetLeft;
  const width = TOOLTIP_WIDTH;
  if (left + width > view.dom.clientWidth) {
    left = view.dom.clientWidth - width
  } else if (left < 0) {
    left = 0
  }
  return { left, top }
}

const calculateArrowPos = (
  view: EditorView,
) => {
  const { selection } = view.state;
  const offsetLeft = getOffset(view.dom).left;
  const coords = view.coordsAtPos(selection.$head.pos);
  const left = coords.left - ARROWOFFSET - offsetLeft;
  const width = TOOLTIP_WIDTH
  if (left + width > view.dom.clientWidth) {
    return left - view.dom.clientWidth + width + 20;
  }
  return 20;
}

const TooltipComponent = (props: {
  show: boolean;
  onDel(): void;
  onEdit(): void;
  view: EditorView;
}) => {
  const { show, onDel, onEdit, view } = props;

  return !!show && (
    <div className="smartblock-tooltip-wrap" style={calcTopLeft(view)}>
      <div className="smartblock-tooltip-wrap-arrow" style={{ left: calculateArrowPos(view) }} />
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
    coords: view.coordsAtPos(to),
  }
}

type TooltipProps = {
  attributes: string[];
  openDialog: OpenDialogFn;
  view: EditorView;
}

class Tooltip {
  private _tooltip: HTMLDivElement;
  private _attributes: string[];
  private _openDialog: OpenDialogFn;
  private _storedLink?: PlacedLink = null;
  private _dialogOpen: boolean = false;
  private _container: Element;

  constructor({ attributes, openDialog, view }: TooltipProps) {
    this._attributes = attributes
    this._openDialog = openDialog

    this._tooltip = document.createElement('div');
    this._tooltip.className = 'link-tooltip'
    this.update(view);
  }

  _onDel = view => () => {
    if (this._dialogOpen) return
    const { tr } = view.state;
    tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
    this._storedLink = null;
    view.dispatch(tr);
  }

  _onEdit = (view: EditorView) => () => {
    if (this._dialogOpen) return
    const onOk = (attrs) => {
      const { tr } = view.state;
      tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
      tr.addMark(
        this._storedLink.from,
        this._storedLink.to,
        view.state.schema.marks.link.create({ ...attrs, editing: '' })
      );
      tr.setSelection(new TextSelection(tr.doc.resolve(this._storedLink.to + 2)))
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

    if (!this._container) {
      const container = view.dom.closest('.smartblock-container')
      if (container) {
        this._container = container.querySelector('.plugin-toolbar-container')
        this._container.appendChild(this._tooltip)
      }
    }

    if ((!this._storedLink || !this._storedLink.editing) && selectedLink && !this._dialogOpen) {
      this._storedLink = selectedLink;
      if (selectedLink.editing)
        this._onEdit(view)();
    } else if (
      this._storedLink && !this._dialogOpen
      && (!selectedLink || selectedLink.from !== this._storedLink.from)
    ) {
      if (this._storedLink.editing) {
        const { tr } = view.state;
        tr.removeMark(this._storedLink.from, this._storedLink.to, view.state.schema.marks.link);
        this._storedLink = null;
        view.dispatch(tr);
        return;
      }
      this._storedLink = null
    }

    render(
      <TooltipComponent
        show={!!this._storedLink}
        onDel={this._onDel(view)}
        onEdit={this._onEdit(view)}
        view={view}
      />,
      this._tooltip);
  }
  destroy() {
    unmountComponentAtNode(this._tooltip);
    if (this._container)
      this._container.removeChild(this._tooltip);
  }
}

export default ({ attributes, openDialog }) => new Plugin({
  view(view) {
    return new Tooltip({ attributes, openDialog, view });
  }
})
