import { useState } from 'react';
import { Page, Navbar, List, ListItem, Icon } from 'framework7-react';

const navigationItems = [
  { id: 'home', title: 'Inicio', icon: 'house_fill', link: '/' },
  { id: 'summary', title: 'Sumario', icon: 'briefcase_fill', link: '/summary/' },
  { id: 'calendar', title: 'Calendario', icon: 'calendar', link: '/calendar/' },
  { id: 'settings', title: 'Configuraciones', icon: 'gear_alt_fill', link: '/settings/' },
] as const;

export function LeftBar() {
  const [activeItem, setActiveItem] = useState<string>('home');

  return (
    <Page className="bg-color-white">
      <Navbar title="Navegación" transparent />
      <List menuList className="margin-horizontal-half">
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            link={item.link}
            selected={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
            view=".view-main"
            panelClose="left"
          >
            <Icon slot="media" f7={item.icon} />
          </ListItem>
        ))}
      </List>
    </Page>
  );
}