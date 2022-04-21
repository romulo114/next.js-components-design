import React from 'react'
import logo from '../../../assets/images/icon-32.png';
import setting from '../../../assets/icons/settings.svg';
import './styles.scss';

export const Header = () => {
  return (
    <header>
      <div className='title'>
        <img src={logo} className="logo" alt="logo" />
        <div className='option'>
          <a href={chrome.runtime.getURL("panel.html?tab=setting")} target='_blank' rel="noreferrer">
            <img src={setting} className="setting" alt="setting" />
          </a>
        </div>
      </div>
      <h4 className='content'>FSIO client for chrome</h4>
    </header>
  )
}
