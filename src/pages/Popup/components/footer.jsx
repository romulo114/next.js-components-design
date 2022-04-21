import React from 'react';
import Arrow from '../../../assets/icons/arrow-right.svg';
import './styles.scss';

export const Footer = () => {
  return (
    <footer>
      <a
        href={chrome.runtime.getURL('panel.html') + '?tab=history'}
        target='_blank'
        rel='noreferrer'
      >
        View Scan History&nbsp;
        <img src={Arrow} className='arrow' alt='arrow' />
      </a>
    </footer>
  )
}
