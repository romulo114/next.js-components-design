import React from 'react';
import logo from '../../../assets/images/icon-32.png';
import setting from '../../../assets/icons/settings.svg';
import './styles.scss';

export const Header = () => {
  return (
    <header>
      <section className='title'>
        <img src={logo} className="logo" alt="logo" />
        <div className='option'>
          <a href={chrome.runtime.getURL("html/panel.html?tab=setting")} target='_blank' rel="noreferrer">
            <img src={setting} className="setting" alt="setting" />
          </a>
        </div>
      </section>
      <section className='content'>
        <h4 className='subtitle'>
          FileScan.IO
          <span>&nbsp;-&nbsp;Next-Gen Malware Analysis</span>
        </h4>
        <p className='description'>
          Detect Threats using Rapid Dynamic Analysis
        </p>

      </section>
    </header>
  )
}
