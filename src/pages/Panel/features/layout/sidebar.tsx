import { MenuItemType } from '../../../../types';
import React from 'react';
import { Menu } from '../../../../components/base/menu';
import { MenuItem } from '../../../../components/base/menu-item';

interface ISidebarProps {
  items: MenuItemType[];
  active: number;
  onSelect: (idx: number) => void;
}
export const Sidebar = (props: ISidebarProps) => {

  const { items, active, onSelect } = props;

  return (
    <aside>
      <Menu>
        {items.map((item, idx: number) => (
          <MenuItem
            title={item.title}
            onClick={() => onSelect(idx)}
            active={active === idx}
            key={idx}
          />
        ))}
      </Menu>
    </aside>
  )
}
