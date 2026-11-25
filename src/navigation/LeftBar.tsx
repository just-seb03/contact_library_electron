import { useEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Icon, f7, f7ready } from 'framework7-react';
import type { Router as Framework7Router } from 'framework7/types';
import { useApp } from '../core/context/AppContext';
import type { AppTab } from '../core/context/types';
import { navigateToTab, getAppTabForRoute } from './navigation';

interface NavItemConfig {
  id: AppTab;
  title: string;
  icon: string;
  activeIcon: string;
  badge?: number | null;
  shortcut?: string;
}

interface LeftBarProps {
  onOpenSpotlight?: () => void;
}

export const LeftBar = ({ onOpenSpotlight }: LeftBarProps) => {
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
      icon: 'house',
      activeIcon: 'house_fill',
    },
    {
      id: 'calendar',
      title: 'Agenda',
      icon: 'calendar',
      activeIcon: 'calendar_today',
      badge: hearings.length > 0 ? hearings.length : null,
    },
    {
      id: 'cliente',
      title: 'Clientes',
      icon: 'person_2',
      activeIcon: 'person_2_fill',
      badge: clients.length > 0 ? clients.length : null,
    },
    {
      id: 'pagos',
      title: 'Pagos',
      icon: 'creditcard',
      activeIcon: 'creditcard_fill',
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : null,
    },
    {
      id: 'config',
      title: 'Ajustes',
      icon: 'gear_alt',
      activeIcon: 'gear_alt_fill',
      shortcut: '⌘,',
    },
  ];

  const containerStyle: CSSProperties = {
    position: 'fixed',
    left: 16,
    bottom: 14,
    zIndex: 9000,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    userSelect: 'none',
    pointerEvents: 'auto',
  };

  const renderNavItems = (items: NavItemConfig[]) => (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 6 }}>
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const inactiveColor = 'var(--macos-text-secondary, rgba(60, 60, 67, 0.55))';
        const activeColor = 'var(--macos-text, #1c1c1e)';
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            title={item.shortcut ? `${item.title} (${item.shortcut})` : item.title}
            aria-label={item.title}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              padding: 0,
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: isActive ? activeColor : inactiveColor,
              transition: 'color 0.12s ease, transform 0.08s ease',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = activeColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = inactiveColor;
              }
            }}
          >
            <Icon
              f7={isActive ? item.activeIcon : item.icon}
              size="19px"
              style={{
                color: 'currentColor',
                transition: 'color 0.12s ease',
              }}
            />

            {/* Indicador numérico monocromo sobre el icono */}
            {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: -2,
                  minWidth: 15,
                  height: 15,
                  padding: '0 4px',
                  borderRadius: 8,
                  backgroundColor: 'var(--macos-text, #1c1c1e)',
                  color: 'var(--macos-canvas-bg, #ffffff)',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 1.5px var(--macos-sidebar-glass, #f6f6f8)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  zIndex: 2,
                  boxSizing: 'border-box',
                }}
              >
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const navElement = (
    <nav style={containerStyle} aria-label="Navegación principal">
      {renderNavItems(navItems)}

      {onOpenSpotlight && (
        <button
          type="button"
          onClick={onOpenSpotlight}
          title="Buscar clientes, causas o citas (⌘K)"
          aria-label="Buscar"
          style={{
            height: 32,
            padding: '0 10px',
            borderRadius: 999,
            border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.10))',
            backgroundColor: 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.04))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: 'var(--macos-text-secondary, #5c5c5e)',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--macos-text, #1c1c1e)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--macos-text-secondary, #5c5c5e)';
          }}
        >
          <Icon f7="search" size="14px" />
          <span>Buscar...</span>
          <kbd
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '1px 5px',
              borderRadius: 4,
              backgroundColor: 'var(--macos-hover-bg, rgba(0, 0, 0, 0.06))',
              color: 'var(--macos-text-muted, #636366)',
              border: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.08))',
            }}
          >
            ⌘K
          </kbd>
        </button>
      )}
    </nav>
  );

  return typeof document !== 'undefined' ? createPortal(navElement, document.body) : navElement;
};

export const Sidebar = LeftBar;
export default LeftBar;
