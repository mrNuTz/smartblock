import * as React from 'react'
import Trash from '../../components/icons/trash'
import Edit from '../../components/icons/edit'

type TooltipReactProps = {
  onEdit(): void;
  onDel(): void;
}

export default (props: TooltipReactProps) => (
  <div className="smartblock-link-dialog-tooltip">
    <div className="smartblock-tooltip-inner">
      <button
        className="smartblock-tooltip-btn"
        onClick={props.onEdit}
        style={{ paddingLeft: '7px' }}>
        <Edit
          style={{ width: '24px', height: '24px', overflow: 'hidden' }}
        />
      </button>
      <button
        className="smartblock-tooltip-btn"
        onClick={props.onDel}
        style={{ paddingLeft: '7px' }}>
        <Trash
          fill="#fff"
          style={{ width: '24px', height: '24px', overflow: 'hidden' }}
        />
      </button>
    </div>
  </div>
)


