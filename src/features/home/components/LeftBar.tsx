import { useEffect, type CSSProperties } from 'react';
import {
  List,
  ListItem,
  Icon,
  Badge,
  BlockTitle,
  Link,
  f7,
  f7ready,
} from 'framework7-react';
import type { Router as Framework7Router } from 'framework7/types';
import { useApp } from '../../../core/context/AppContext';
import type { AppTab } from '../../../core/context/types';
import { navigateToTab, getAppTabForRoute } from '../../../navigation/navigation';
import { TrafficLights } from '../../../core/windowControls/TrafficLights';

export const LeftBar = () => {
  const { activeTab, setActiveTab, clients, hearings, payments } = useApp();

  const handleSelect = (tab: AppTab) => {
    setActiveTab(tab);
    navigateToTab(tab);
  };

  const pendingPaymentsCount = payments.filter(
    (p) => p.status === 'pending' || p.status === 'overdue'
  ).length;

  useEffect(() => {
    f7ready(() => {
      const view =
        f7.views?.get('#content-view') ??
        f7.view?.get('#content-view') ??
        f7.views?.main ??
        f7.view?.main;
      const router = view?.router;
      if (!router) return;

      const syncActiveTab = (route: Framework7Router.Route) => {
        const tab = getAppTabForRoute(route.path);
        if (tab && tab !== activeTab) {
          setActiveTab(tab);
        }
      };

      router.on('routeChanged', syncActiveTab);
      if (router.currentRoute) {
        syncActiveTab(router.currentRoute);
      }

      return () => {
        router.off('routeChanged', syncActiveTab);
      };
    });
  }, [activeTab, setActiveTab]);

  const sidebarContainerStyle: CSSProperties = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div className="app-sidebar" style={sidebarContainerStyle}>
      {/* Cabecera estilo macOS con Traffic Lights y controles de ventana */}
      <div
        className="app-sidebar-header display-flex align-items-center justify-content-space-between padding-horizontal padding-vertical-half"
        style={{ WebkitAppRegion: 'drag' } as CSSProperties}
      >
        <div style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}>
          <TrafficLights />
        </div>
        <div
          className="display-flex align-items-center"
          style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
        >
          <Link
            iconF7="folder_badge_plus"
            iconSize="16px"
            className="text-color-gray margin-right-half"
            aria-label="Nueva carpeta"
          />
          <Link
            iconF7="sidebar_left"
            iconSize="16px"
            className="text-color-gray"
            aria-label="Alternar barra lateral"
          />
        </div>
      </div>

      {/* Primer grupo de accesos directos (Inicio, Agenda) */}
      <List
        menuList
        strongIos={false}
        outlineIos={false}
        dividersIos={false}
        className="app-sidebar-list no-margin-top no-margin-bottom"
      >
        <ListItem
          link="#"
          title="Inicio"
          selected={activeTab === 'inicio'}
          onClick={() => handleSelect('inicio')}
        >
          <Icon
            slot="media"
            f7="house_fill"
            className={activeTab === 'inicio' ? 'app-sidebar-icon-selected' : 'app-sidebar-icon'}
          />
        </ListItem>
        <ListItem
          link="#"
          title="Agenda"
          selected={activeTab === 'calendar'}
          onClick={() => handleSelect('calendar')}
        >
          <Icon
            slot="media"
            f7="calendar"
            className={activeTab === 'calendar' ? 'app-sidebar-icon-selected' : 'app-sidebar-icon'}
          />
          {hearings.length > 0 && (
            <Badge slot="after" color="blue">
              {hearings.length}
            </Badge>
          )}
        </ListItem>
      </List>

      {/* Título de sección Biblioteca */}
      <BlockTitle className="text-color-gray margin-left-half margin-top-half margin-bottom-half">
        Biblioteca
      </BlockTitle>

      {/* Segundo grupo: Clientes, Pagos, Ajustes */}
      <List
        menuList
        strongIos={false}
        outlineIos={false}
        dividersIos={false}
        className="app-sidebar-list no-margin-top no-margin-bottom"
      >
        <ListItem
          link="#"
          title="Clientes"
          selected={activeTab === 'cliente'}
          onClick={() => handleSelect('cliente')}
        >
          <Icon
            slot="media"
            f7="person_2_fill"
            className={activeTab === 'cliente' ? 'app-sidebar-icon-selected' : 'app-sidebar-icon'}
          />
          <Badge
            slot="after"
            color={activeTab === 'cliente' ? 'blue' : 'gray'}
          >
            {clients.length}
          </Badge>
        </ListItem>
        <ListItem
          link="#"
          title="Pagos"
          selected={activeTab === 'pagos'}
          onClick={() => handleSelect('pagos')}
        >
          <Icon
            slot="media"
            f7="creditcard_fill"
            className={activeTab === 'pagos' ? 'app-sidebar-icon-selected' : 'app-sidebar-icon'}
          />
          {pendingPaymentsCount > 0 && (
            <Badge
              slot="after"
              color="orange"
            >
              {pendingPaymentsCount}
            </Badge>
          )}
        </ListItem>
        <ListItem
          link="#"
          title="Ajustes"
          selected={activeTab === 'config'}
          onClick={() => handleSelect('config')}
        >
          <Icon
            slot="media"
            f7="gear_alt_fill"
            className={activeTab === 'config' ? 'app-sidebar-icon-selected' : 'app-sidebar-icon'}
          />
        </ListItem>
      </List>
    </div>
  );
};

export const Sidebar = LeftBar;
export default LeftBar;
