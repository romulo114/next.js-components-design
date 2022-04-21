import React from 'react';
import './modal.scss';

interface ModalProps {
  title: string;
  children?: string | React.ReactElement;
  onHide: () => void;
}
export const Modal = (props: ModalProps) => {
  const { title, onHide, children } = props

  return (
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h4>{title}</h4>
          <span className='close' onClick={onHide}>&times;</span>
        </div>
        <div className='modal-body'>
          {children}
        </div>
      </div>
    </div>
  )
}
