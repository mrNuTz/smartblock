import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { getScrollTop } from '.'

type EditorProps = {
  onChange(
    state: EditorState,
    dispatch: typeof EditorView.prototype.dispatch
  ): void;
  attributes?: { [index: string]: any };
  nodeViews?: { [index: string]: any };
  autoFocus?: boolean;
  options: { [index: string]: any };
  render?({ editor: EditorState, view: EditorView }): React.ReactElement;
}

export const useForceUpdate = () => {
  const [, setTick] = useState(0)
  const update = () => {
    setTick(tick => tick + 1)
  }
  return update;
}

export const useView = (props: EditorProps): EditorView => {
  const forceUpdate = useForceUpdate()
  const instance = useMemo(() => {
    const view = new EditorView(null, {
      state: EditorState.create(props.options),
      dispatchTransaction: transaction => {
        const { state, transactions } = view.state.applyTransaction(transaction)
        view.updateState(state)
        if (transactions.some(tr => tr.docChanged)) {
          props.onChange(state, view.dispatch)
        }
        forceUpdate()
      },
      attributes: props.attributes,
      nodeViews: props.nodeViews
    })
    props.onChange(view.state, view.dispatch)
    return view
  }, [])
  useEffect(() => () => instance.destroy(), [])
  return instance
}

export const useScroll = () => {
  const [scrollTop, setScrollTop] = useState(getScrollTop())
  useEffect(() => {
    const scrollEvent = () => {
      setScrollTop(getScrollTop())
    }
    window.addEventListener('scroll', scrollEvent)
    return () => {
      window.removeEventListener('scroll', scrollEvent)
    }
  }, [scrollTop])
  return scrollTop;
}

export const useScrolling = (
  element: React.MutableRefObject<HTMLDivElement>,
  delay: number
) => {
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    let debounceTimer: number = null;
    let count = 0;
    if (!element.current) {
      return;
    }
    let { top } = element.current.getBoundingClientRect();
    const eventHandler = () => {
      const localTop = element.current.getBoundingClientRect().top;
      if (localTop === top) {
        return;
      }
      top = localTop;
      count++;
      if (count === 3) {
        if (scrolling === false) {
          count = 0;
          setScrolling(true);
        }
      }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setScrolling(false);
        count = 0;
      }, delay);
    }
    const interval = setInterval(eventHandler, 100);
    return () => {
      clearInterval(interval);
    }
  }, [])
  return scrolling;
}
