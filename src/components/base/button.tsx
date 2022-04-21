import React from 'react';
import './button.scss'

interface ButtonProps {
  onClick: () => Promise<void>;
  variant?: 'primary' | 'secondary' | 'dark' | 'danger';
  isOutlined?: boolean;
}
export const Button: React.FC<ButtonProps> = (props) => {
  const { onClick } = props;
  const variant = props.variant ?? 'primary';
  const outlined = props.isOutlined ?? false;


  return (
    <button onClick={onClick} className={`btn btn-${variant} ${outlined ? 'outlined' : ''}`}>
      {props.children}
    </button>
  )
}
