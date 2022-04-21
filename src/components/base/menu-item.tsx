import React from 'react';
import Arrow from '../../assets/icons/arrow-right.svg';
import './menu-item.scss';

interface IMenuItemProps {
  active: boolean;
  title: string;
  onClick: VoidFunction;
}
export const MenuItem = (props: IMenuItemProps) => {
  const { active, title, onClick } = props
  return (
    <div className={`menu-item ${active ? 'active' : ''}`} onClick={onClick}>
      {title}
      <img src={Arrow} className='arrow' alt='arrow' />
    </div>
  )
}
