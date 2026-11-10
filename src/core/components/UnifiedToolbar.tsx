import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../context/AppContext';
import { navigateToTab } from '../../navigation/navigation';
import { TrafficLights } from '../windowControls/TrafficLights';
import type { AppTab } from '../context/types';

interface UnifiedToolbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSpotlight: () => void;
  onQuickAction?: () => void;
}

const TAB_TITLES: Record<AppTab, { title: string; subtitle?: string; icon: string }> = {
  inicio: { title: 'Inicio', subtitle: 'Panel General', icon: 'house_fill' },
  calendar: { title: 'Agenda', subtitle: 'Citas y Audiencias', icon: 'calendar' },
  cliente: { title: 'Clientes', subtitle: 'Expedientes y Causas', icon: 'person_2_fill' },
  pagos: { title: 'Pagos', subtitle: 'Honorarios y Cobranzas', icon: 'creditcard_fill' },
  config: { title: 'Ajustes', subtitle: 'Configuración del Sistema', icon: 'gear_alt_fill' },
};

export const UnifiedToolbar: FC<UnifiedToolbarProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onOpenSpotlight,
}) => {
  const { activeTab, darkMode, toggleDarkMode, hearings, clients } = useApp();

  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'Contact Library',
    subtitle: '',
    icon: 'folder_fill',
  };

  const toolbarStyle: CSSProperties = {
    height: 52,
    minHeight: 52,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    boxSizing: 'border-box',
    backgroundColor: darkMode ? 'rgba(30, 30, 34, 0.82)' : 'rgba(255, 255, 255, 0.82)',
    backdropFilter: 'blur(25px) saturate(180%)',
    WebkitBackdropFilter: 'blur(25px) saturate(180%)',
    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
    WebkitAppRegion: 'drag',
    zIndex: 400,
    position: 'relative',
  } as CSSProperties;

  const noDragStyle: CSSProperties = {
    WebkitAppRegion: 'no-drag',
  } as CSSProperties;

  const macButtonStyle: CSSProperties = {
    ...noDragStyle,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 30,
    padding: '0 10px',
    borderRadius: 7,
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
    color: darkMode ? '#ffffff' : '#1c1c1e',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.12s ease',
  };

  return (
    <header style={toolbarStyle}>
      {/* ── Izquierda: Botón de barra lateral + Título de la vista ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...noDragStyle }}>
        {!isSidebarOpen && (
          <div style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>
            <TrafficLights />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
          title={isSidebarOpen ? 'Ocultar barra lateral (⌘B)' : 'Mostrar barra lateral (⌘B)'}
          style={{
            ...noDragStyle,
            width: 30,
            height: 30,
            borderRadius: 7,
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: darkMode ? '#a1a1aa' : '#555558',
            transition: 'background-color 0.12s ease',
          }}
        >
          <Icon f7="sidebar_left" size="16px" />
        </button>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 650,
              color: darkMode ? '#ffffff' : '#1c1c1e',
              letterSpacing: '-0.01em',
            }}
          >
            {currentTabInfo.title}
          </span>
          {currentTabInfo.subtitle && (
            <span
              style={{
                fontSize: 12,
                color: darkMode ? '#8e8e93' : '#8e8e93',
                fontWeight: 450,
              }}
            >
              • {currentTabInfo.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* ── Centro: Buscador estilo Spotlight de macOS ── */}
      <div
        style={{
          flex: '0 1 360px',
          display: 'flex',
          justifyContent: 'center',
          ...noDragStyle,
        }}
      >
        <button
          type="button"
          onClick={onOpenSpotlight}
          style={{
            width: '100%',
            maxWidth: 360,
            height: 30,
            padding: '0 12px',
            borderRadius: 8,
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.09)',
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.04)',
            color: darkMode ? '#8e8e93' : '#8e8e93',
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease, background-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon f7="search" size="14px" style={{ opacity: 0.8 }} />
            <span>Buscar clientes, causas o citas...</span>
          </div>
          <kbd
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 5px',
              borderRadius: 4,
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
              color: darkMode ? '#c7c7cc' : '#636366',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            ⌘K
          </kbd>
        </button>
      </div>

      {/* ── Derecha: Acciones rápidas contextuales + Modo Oscuro ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...noDragStyle }}>
        {/* Acción rápida según pestaña */}
        {activeTab === 'inicio' && (
          <button
            type="button"
            onClick={() => navigateToTab('calendar')}
            style={{
              ...macButtonStyle,
              backgroundColor: 'rgba(0, 122, 255, 0.12)',
              color: '#007aff',
              border: '1px solid rgba(0, 122, 255, 0.25)',
              fontWeight: 600,
            }}
          >
            <Icon f7="calendar_badge_plus" size="14px" />
            <span>+ Cita</span>
          </button>
        )}

        {activeTab === 'calendar' && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 6,
              backgroundColor: darkMode ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.1)',
              color: '#ff3b30',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icon f7="clock" size="12px" />
            <span>{hearings.length} audiencias</span>
          </div>
        )}

        {activeTab === 'cliente' && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 6,
              backgroundColor: darkMode ? 'rgba(88, 86, 214, 0.15)' : 'rgba(88, 86, 214, 0.1)',
              color: '#5856d6',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icon f7="person_2" size="12px" />
            <span>{clients.length} activos</span>
          </div>
        )}

        {/* Botón de cambio de tema (Claro / Oscuro) estilo Apple */}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          style={{
            ...macButtonStyle,
            width: 30,
            padding: 0,
            justifyContent: 'center',
          }}
        >
          <Icon
            f7={darkMode ? 'sun_max_fill' : 'moon_fill'}
            size="14px"
            style={{ color: darkMode ? '#ff9f0a' : '#5856d6' }}
          />
        </button>
      </div>
    </header>
  );
};

export default UnifiedToolbar;
