import { useState } from 'react';
import { BlockTitle, Icon, List, ListItem } from 'framework7-react';

const navigationItems = [
  { id: 'summary', title: 'Sumario', icon: 'briefcase_fill', link: '/summary/' },
  { id: 'calendar', title: 'Calendario', icon: 'calendar', link: '/calendar/' },
  { id: 'settings', title: 'Configuraciones', icon: 'gear_alt_fill', link: '/settings/' },
] as const;

export function LeftBar() {
  const [activeItem, setActiveItem] = useState<string>('summary');

  return (
    <aside className="leftbar liquid-sidebar" aria-label="Navegación principal">
      <div className="sidebar-header titlebar">
        {/* Espacio para los controles de macOS */}
      </div>
      <BlockTitle className="liquid-title">Menu de Navegacion</BlockTitle>
      <List className="leftbar-list">
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            link={item.link}
            className={
              activeItem === item.id
                ? 'leftbar-item leftbar-item-active'
                : 'leftbar-item'
            }
            onClick={() => setActiveItem(item.id)}
            view=".home-content"
          />
        ))}
      </List>
    </aside>
  );
}