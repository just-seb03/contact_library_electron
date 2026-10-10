import { useState } from 'react';
import { BlockTitle, List, ListItem } from 'framework7-react';

const navigationItems = [
  { id: 'home', title: 'Inicio', icon: 'house_fill', link: '/' },
  { id: 'summary', title: 'Sumario', icon: 'briefcase_fill', link: '/summary/' },
  { id: 'calendar', title: 'Calendario', icon: 'calendar', link: '/calendar/' },
  { id: 'settings', title: 'Configuraciones', icon: 'gear_alt_fill', link: '/settings/' },
] as const;

export function LeftBar() {
  const [activeItem, setActiveItem] = useState<string>('home');

  return (
    <aside className="leftbar" aria-label="Navegación principal">
      <BlockTitle>Menú de Navegación</BlockTitle>
      <List menuList>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            link={item.link}
            selected={activeItem === item.id}
            className={activeItem === item.id ? 'leftbar-item-active' : undefined}
            onClick={() => setActiveItem(item.id)}
            view=".home-content"
          />
        ))}
      </List>
    </aside>
  );
}