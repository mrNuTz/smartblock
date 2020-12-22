import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { getOffset, getScrollTop } from '../utils';
import Button from './button';

interface PositionProps {
  view: EditorView;
  blockMenu: any;
}

const { useRef } = React;

const ARROWOFFSET = 30;
const ARROWTOPOFFSET = 35;

const calculatePos = (
  view: EditorView,
  container: React.RefObject<HTMLDivElement>
) => {
  const { selection } = view.state;
  const offsetLeft = getOffset(view.dom).left;
  const coords = view.coordsAtPos(selection.$head.pos);
  const offsetTop = getOffset(view.dom).top;
  const top = coords.top + getScrollTop() + ARROWTOPOFFSET - offsetTop;
  let left = coords.left - ARROWOFFSET - offsetLeft;
  if (container && container.current && container.current.offsetWidth) {
    const width = container.current.offsetWidth;
    if (left + width > view.dom.clientWidth) {
      left = view.dom.clientWidth - width
    } else if (left < 0) {
      left = 0
    }
  }
  return { left, top }
}

const getActiveInlineMenu = (props: PositionProps) => {
  const { blockMenu, view } = props;
  const { state } = view;

  const activeItem = blockMenu.find(item => {
    if (item.active && item.active(state)) {
      return true;
    }
    return false;
  })

  if (activeItem && activeItem.customInlineMenu) {
    return <>{activeItem.customInlineMenu(view)}</>
  }
  return false;
}

const calculateArrowPos = (
  view: EditorView,
  container: React.RefObject<HTMLDivElement>
) => {
  const { selection } = view.state;
  const offsetLeft = getOffset(view.dom).left;
  const coords = view.coordsAtPos(selection.$head.pos);
  const left = coords.left - ARROWOFFSET - offsetLeft;
  const width = container.current ? container.current.offsetWidth : 0
  if (container && container.current && container.current.offsetWidth) {
    if (left + width > view.dom.clientWidth) {
      return left - view.dom.clientWidth + width + 20;
    }
  }
  return 20;
}

const MenuBar = ({
  menu,
  blockMenu,
  children,
  view
}: {
  menu: any;
  blockMenu: any;
  children?: React.ReactChildren;
  view: EditorView;
}) => {
  const { state, dispatch } = view
  const { selection } = view.state
  const container = useRef<HTMLDivElement>(null)
  const pos = calculatePos(view, container)
  const arrowPos = calculateArrowPos(view, container)
  const inlineMenu = getActiveInlineMenu({ blockMenu, view });

  const hide = (!selection || selection.empty || menu.length === 0);
  const style = {
    zIndex: hide ? -10 : null,
    opacity: hide ? 0 : null,
  }

  return (
    <div style={{ ...pos, ...style }} ref={container} className="smartblock-inline-menu">
      <div
        className="smartblock-inline-menu-arrow"
        style={{left: `${arrowPos}px`}}
      >
      </div>
      <div className="smartblock-inline-menu-inner">
        {children}
        {menu.map((item, key) => {
          return (
            <Button
              key={`inline-${key}`}
              type="button"
              active={item.active && item.active(state)}
              // title={item.title}
              disabled={item.enable && !item.enable(state)}
              onClick={e => {
                e.preventDefault()
                item.onClick(state, dispatch)
              }}
            >
              {typeof item.icon !== 'string' ? (
                item.icon
              ) : (
                <span dangerouslySetInnerHTML={{ __html: item.icon }} />
              )}
            </Button>
          )
        })}
        {inlineMenu && inlineMenu.props && inlineMenu.props.children && (
          <>{inlineMenu}</>
        )}
      </div>
    </div>
  )
}

export default MenuBar;
