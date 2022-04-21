import React from 'react';
import { Header, Footer, History } from './components';
import './Popup.scss';

const Popup = () => {
  return (
    <div className="app">
      <Header />
      <History />
      <Footer />
    </div>
  );
};

export default Popup;
