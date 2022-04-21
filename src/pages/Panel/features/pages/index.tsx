import React, { useState } from 'react';
import { Sidebar } from '../layout/sidebar';
import { History } from './history';
import { Setting } from './setting';
import './styles.scss';

const MAIN_PAGES = [
  { title: 'Scan History', tab: 'history', component: History },
  { title: 'Setting', tab: 'setting', component: Setting }
];

export const Main = () => {
  const [active, setActive] = useState(() => {
    const params = new URLSearchParams(globalThis.location.search)
    const tab = params.get('tab')
    return MAIN_PAGES.findIndex(item => item.tab === (tab ?? 'history'));
  });

  const onSelectPage = (idx: number) => {
    setActive(idx);
  }

  const PageComponent = MAIN_PAGES[active].component
  return (
    <div className='main'>
      <Sidebar onSelect={onSelectPage} items={MAIN_PAGES} active={active} />
      <section className='page'>
        <PageComponent />
      </section>
    </div>
  )
}
