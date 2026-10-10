import { useState } from 'react';
import { BlockTitle, Icon, List, ListItem } from 'framework7-react';

const navigationItems = [
  { id: 'contacts', title: 'Todos los contactos', icon: 'person_2_fill' },
  { id: 'favorites', title: 'Favoritos', icon: 'star_fill' },
  { id: 'groups', title: 'Grupos', icon: 'person_3_fill' },
  { id: 'settings', title: 'Ajustes', icon: 'gear_alt_fill' },
] as const;

export function LeftBar() {
  const [activeItem, setActiveItem] = useState<string>('contacts');

  return (
    <aside className="leftbar" aria-label="Navegación principal">
      <BlockTitle>Biblioteca</BlockTitle>
      <List className="leftbar-list">
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            className={
              activeItem === item.id
                ? 'leftbar-item leftbar-item-active'
                : 'leftbar-item'
            }
            onClick={() => setActiveItem(item.id)}
          >
            <Icon slot="media" f7={item.icon} />
          </ListItem>
        ))}
      </List>
    </aside>
  );
}