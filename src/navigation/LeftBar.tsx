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
}

export const LeftBar = () => {
  const { activeTab, setActiveTab, clients, hearings, payments, darkMode, settings } = useApp();

  const handleSelect = (tab: AppTab) => {
    setActiveTab(tab);
    navigateToTab(tab);
  };

  const pendingPaymentsCount = payments.filter(
    (p) => p.status === 'pending' || p.status === 'overdue'
  ).length;

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return 'CL';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const lawyerName = settings?.lawyerName?.trim() || 'Estudio Jurídico';
  const lawyerFirm = settings?.lawyerFirm?.trim() || 'Activo • macOS';
  const initials = getInitials(settings?.lawyerName);

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

  const mainNavItems: NavItemConfig[] = [
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
  ];

  const libraryNavItems: NavItemConfig[] = [
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
  ];

  const systemNavItems: NavItemConfig[] = [
    {
      id: 'config',
      title: 'Ajustes',
      icon: 'gear_alt_fill',
      iconColor: '#8e8e93',
    },
  ];

  const containerStyle: CSSProperties = {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: darkMode ? MACOS_THEME.sidebarGlassDark : MACOS_THEME.sidebarGlass,
    backdropFilter: MACOS_THEME.backdropBlur,
    WebkitBackdropFilter: MACOS_THEME.backdropBlur,
    color: darkMode ? '#ffffff' : '#1c1c1e',
    borderRight: darkMode ? MACOS_THEME.hairlineBorderDark : MACOS_THEME.hairlineBorder,
    userSelect: 'none',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  const renderNavGroup = (title: string, items: NavItemConfig[]) => (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          padding: '6px 14px 4px 14px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: darkMode ? 'rgba(235, 235, 245, 0.45)' : 'rgba(60, 60, 67, 0.55)',
        }}
      >
        {title}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1px 8px',
                padding: '7px 10px',
                borderRadius: 8,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                backgroundColor: isActive
                  ? darkMode
                    ? 'var(--macos-accent-tint-active, rgba(0, 122, 255, 0.26))'
                    : 'var(--macos-accent-tint, rgba(0, 122, 255, 0.12))'
                  : 'transparent',
                color: isActive
                  ? 'var(--macos-accent-color, #007aff)'
                  : darkMode
                  ? '#f2f2f7'
                  : '#1c1c1e',
                fontWeight: isActive ? 600 : 450,
                fontSize: 13,
                transition: 'background-color 0.12s ease, transform 0.08s ease',
                width: 'calc(100% - 16px)',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = darkMode
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, width: '100%' }}>
                {/* Contenedor del icono con la esfera de notificación integrada */}
                <div
                  style={{
                    position: 'relative',
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: isActive
                      ? 'var(--macos-accent-color, #007aff)'
                      : darkMode
                      ? 'rgba(255, 255, 255, 0.08)'
                      : `${item.iconColor}14`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.12s ease',
                  }}
                >
                  <Icon
                    f7={item.icon}
                    size="14px"
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
                        boxShadow: darkMode
                          ? '0 0 0 2px #1e1e20, 0 1px 3px rgba(0,0,0,0.5)'
                          : '0 0 0 2px #f6f6f8, 0 1px 3px rgba(0,0,0,0.2)',
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

                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                  }}
                >
                  {item.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
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
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          WebkitAppRegion: 'drag',
          borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid rgba(0, 0, 0, 0.03)',
        } as CSSProperties}
      >
        <div style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}>
          <TrafficLights />
        </div>
      </div>

      {/* ── Grupos de navegación estilo Source List (sin barra de slide horizontal) ── */}
      <div
        className="sidebar-nav-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '12px 0',
        }}
      >
        {renderNavGroup('Principal', mainNavItems)}
        {renderNavGroup('Biblioteca', libraryNavItems)}
        {renderNavGroup('Sistema', systemNavItems)}
      </div>

      {/* ── Pie de la barra lateral (Perfil del Usuario reflejado desde Ajustes) ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => handleSelect('config')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect('config');
          }
        }}
        title="Ver ajustes y perfil de usuario"
        style={{
          padding: '12px 14px',
          borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.3)',
          cursor: 'pointer',
          transition: 'background-color 0.12s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode
            ? 'rgba(255, 255, 255, 0.06)'
            : 'rgba(255, 255, 255, 0.55)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = darkMode
            ? 'rgba(0, 0, 0, 0.15)'
            : 'rgba(255, 255, 255, 0.3)';
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--macos-accent-color, #007aff), #5856d6)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 2px 6px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.3))',
            letterSpacing: '0.5px',
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: darkMode ? '#ffffff' : '#1c1c1e',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {lawyerName}
          </div>
          <div
            style={{
              fontSize: 11,
              color: darkMode ? '#a1a1aa' : '#8e8e93',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#34c759',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {lawyerFirm}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Sidebar = LeftBar;
export default LeftBar;
