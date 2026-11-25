import { useEffect, type CSSProperties } from 'react';
import { Icon, f7, f7ready } from 'framework7-react';
import type { Router as Framework7Router } from 'framework7/types';
import { useApp } from '../core/context/AppContext';
import type { AppTab } from '../core/context/types';
import { navigateToTab, getAppTabForRoute } from './navigation';
import { TrafficLights } from '../core/windowControls/TrafficLights';
import { MACOS_THEME } from '../core/theme/style';

interface NavItemConfig {
  id: AppTab;
  title: string;
  icon: string;
  iconColor: string;
  badge?: number | null;
  badgeColor?: string;
  shortcut?: string;
}

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

  const navItems: NavItemConfig[] = [
    {
      id: 'inicio',
      title: 'Inicio',
      icon: 'house_fill',
      iconColor: 'var(--macos-accent-color, #007aff)',
    },
    {
      id: 'calendar',
      title: 'Agenda',
      icon: 'calendar',
      iconColor: '#ff3b30',
      badge: hearings.length > 0 ? hearings.length : null,
      badgeColor: '#ff3b30',
    },
    {
      id: 'cliente',
      title: 'Clientes',
      icon: 'person_2_fill',
      iconColor: '#5856d6',
      badge: clients.length > 0 ? clients.length : null,
      badgeColor: '#5856d6',
    },
    {
      id: 'pagos',
      title: 'Pagos',
      icon: 'creditcard_fill',
      iconColor: '#34c759',
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
      badgeColor: '#ff9500',
    },
    {
      id: 'config',
      title: 'Ajustes',
      icon: 'gear_alt_fill',
      iconColor: '#8e8e93',
      shortcut: '⌘,',
    },
  ];

  const containerStyle: CSSProperties = {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--macos-sidebar-glass, rgba(246, 246, 248, 0.82))',
    backdropFilter: MACOS_THEME.backdropBlur,
    WebkitBackdropFilter: MACOS_THEME.backdropBlur,
    color: 'var(--macos-text, #1c1c1e)',
    borderRight: '1px solid var(--macos-hairline-border, rgba(0, 0, 0, 0.08))',
    userSelect: 'none',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const renderNavItems = (items: NavItemConfig[]) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            title={item.shortcut ? `${item.title} (${item.shortcut})` : item.title}
            aria-label={item.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 44,
              padding: 0,
              borderRadius: 10,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: isActive
                ? 'var(--macos-accent-tint, rgba(0, 122, 255, 0.12))'
                : 'transparent',
              color: isActive
                ? 'var(--macos-accent-color, #007aff)'
                : 'var(--macos-text, #1c1c1e)',
              transition: 'background-color 0.12s ease, transform 0.08s ease',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'var(--macos-hover-bg, rgba(0, 0, 0, 0.04))';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {/* Contenedor del icono con la esfera de notificación integrada */}
            <div
              style={{
                position: 'relative',
                width: 30,
                height: 30,
                borderRadius: 8,
                backgroundColor: isActive
                  ? 'var(--macos-accent-color, #007aff)'
                  : 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.03))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.12s ease',
              }}
            >
              <Icon
                f7={item.icon}
                size="16px"
                style={{
                  color: isActive ? '#ffffff' : item.iconColor,
                }}
              />

              {/* Esfera de notificación estilo macOS/iOS sobre el icono */}
              {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -6,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    borderRadius: 8,
                    backgroundColor: item.badgeColor || '#ff3b30',
                    color: '#ffffff',
                    fontSize: 9.5,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 0 2px var(--macos-canvas-bg, #f5f5f7), 0 1px 3px rgba(0,0,0,0.25)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    zIndex: 2,
                    boxSizing: 'border-box',
                  }}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <nav style={containerStyle} aria-label="Navegación principal">
      <style>{`
        .sidebar-nav-scroll::-webkit-scrollbar {
          width: 0px !important;
          height: 0px !important;
          display: none !important;
        }
        .sidebar-nav-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ── Cabecera de la barra lateral (Traffic Lights + Arrastre) ── */}
      <div
        style={{
          height: 52,
          minHeight: 52,
          padding: '0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          WebkitAppRegion: 'drag',
          borderBottom: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.06))',
        } as CSSProperties}
      >
        <div style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}>
          <TrafficLights />
        </div>
      </div>

      {/* ── Elementos de navegación agrupados sin encabezados de sección ── */}
      <div
        className="sidebar-nav-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 0',
        }}
      >
        {renderNavItems(navItems)}
      </div>
    </nav>
  );
};

export const Sidebar = LeftBar;
export default LeftBar;
