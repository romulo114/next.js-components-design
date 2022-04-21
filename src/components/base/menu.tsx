import React from 'react';
import './menu.scss';

export const Menu: React.FC = ({ children }) => {
  return (
    <div className='menu'>
      {children}
    </div>
  )
}
