import React from 'react';
import { Header } from './features/layout';
import { Main } from './features/pages';

import './Panel.css';

const Panel = () => {
  return (
    <div className="container">
      <Header />
      <Main />
    </div>
  );
};

export default Panel;
