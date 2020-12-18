import * as React from 'react';
import classNames from 'classnames';

type ButtonProps = {
  active?: boolean;
  color?: 'black' | 'white';
  disabled?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
  type?: 'submit' | 'button';
  tag?: 'label';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
}

export default (props: ButtonProps) => {

  if (props.tag === 'label') {
    return <label
    style={props.style}
    title={props.title}
    className={classNames(props.className, 'smartblock-btn', {
    'is-active': props.active,
    'is-black': props.color === 'black',
    'is-disabled': props.disabled
  })}>{props.children}</label>
  }

  return <button
    disabled={props.disabled}
    type={props.type}
    style={props.style}
    onClick={props.onClick}
    title={props.title}
    className={classNames(props.className, 'smartblock-btn', {
    'is-active': props.active,
    'is-black': props.color === 'black',
    'is-disabled': props.disabled
  })}>{props.children}</button>
}