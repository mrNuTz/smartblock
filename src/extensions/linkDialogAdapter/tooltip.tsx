import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';
import { render, unmountComponentAtNode } from 'react-dom';
import TooltipReact from './tooltip-react';
import { getScrollTop } from '../../utils';
import { OpenDialogFn, Attributes } from './'

const { useRef } = React
const ARROWOFFSET = 50
const ARROWTOPOFFSET = 33
const TOOLTIP_WIDTH = 92

const calculateStyle = (
  view: EditorView
) => {
  const { selection } = view.state;
  const app = view.dom;
  const { $anchor } = view.state.selection;
  const { nodeAfter } = $anchor;
  let link = null;

  if (nodeAfter) {
    link = nodeAfter.marks.find(mark => {
      if (mark.type.name === 'link') {
        return true;
      }
    })
  }

  if (!selection || selection.empty || !app || !link) {
    return {
      left: -1000,
      top: 0
    }
  }

  const coords = view.coordsAtPos(selection.$head.pos);
  const top = coords.top + getScrollTop() + ARROWTOPOFFSET;
  const left = coords.left - ARROWOFFSET;

  const width = TOOLTIP_WIDTH; // container.current.offsetWidth

  return {
    left: (left + width > window.innerWidth) ? window.innerWidth - width : left,
    top
  }
}

const calculatePos = (
  view: EditorView
) => {
  const { selection } = view.state;
  const app = view.dom;
  const { $anchor } = view.state.selection;
  const { nodeAfter } = $anchor;
  let link = null;

  if (nodeAfter) {
    link = nodeAfter.marks.find(mark => {
      if (mark.type.name === 'link') {
        return true;
      }
      return false;
    })
  }

  if (!selection || selection.empty || !app || !link) {
    return 20;
  }

  const coords = view.coordsAtPos(selection.$head.pos);
  const left = coords.left - ARROWOFFSET;

  const width = TOOLTIP_WIDTH; // container.current.offsetWidth
  if (left + width > window.innerWidth) {
    return left - window.innerWidth + width;
  }

  return 20;
}

const filterAttrs = attrs => Object.entries(attrs).reduce((res, [k, v]) => {
  if (v && k !== 'editing')
    res[k] = v;
  return res;
}, {});

const TooltipComponent = (props: { view: EditorView; attributes: string[]; openDialog: OpenDialogFn }) => {
  const { view, openDialog } = props;
  const container = useRef<HTMLDivElement>(null);
  const style = calculateStyle(view);
  const { selection } = view.state;
  const { $anchor } = selection;
  const { nodeBefore, nodeAfter, pos } = $anchor;
  let link = null;
  let editing = '';
  if (nodeAfter) {
    link = nodeAfter.marks.find(mark => {
      if (mark.type.name === 'link') {
        return true;
      }
    })
  }
  let attrs = {};
  if (link) {
    attrs = filterAttrs(link.attrs)
    editing = link.attrs.editing;
  }
  let beforePos = selection.from;
  let afterPos = selection.to;
  if (beforePos === afterPos && nodeBefore && nodeAfter) {
    beforePos = pos - nodeBefore.nodeSize;
    afterPos = pos + nodeAfter.nodeSize;
  }
  const arrowPos = calculatePos(view);

  const onOk = (attrs) => {
    const { tr } = view.state;
    tr.removeMark(beforePos, afterPos, view.state.schema.marks.link);
    tr.addMark(
      beforePos,
      afterPos,
      view.state.schema.marks.link.create({ ...attrs, editing: '' })
    );
    view.dispatch(tr);
  }
  const onCancel = () => {
    const { tr } = view.state;
    tr.removeMark(beforePos, afterPos, view.state.schema.marks.link);
    if (Object.values(attrs).some(v => v)) {
      tr.addMark(
        beforePos,
        afterPos,
        view.state.schema.marks.link.create({ ...attrs, editing: '' })
      );
    }
    view.dispatch(tr);
  }
  const onEdit = () => openDialog(onOk, onCancel, attrs)
  const onDel = () => {
    const { tr } = view.state;
    tr.removeMark(beforePos, afterPos, view.state.schema.marks.link);
    view.dispatch(tr);
  }

  return (
    <div
      className="smartblock-tooltip-wrap"
      ref={container}
      style={style}
    >
      <div
        className="smartblock-tooltip-arrow"
        style={{ left: `${arrowPos}px` }}
      />
      { editing === 'true' &&
        <TooltipReact onDel={onDel} onEdit={onEdit} />
      }
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
