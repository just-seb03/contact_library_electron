import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../context/AppContext';
import { TrafficLights } from '../windowControls/TrafficLights';

interface UnifiedToolbarProps {
  onOpenSpotlight: () => void;
}

export const UnifiedToolbar: FC<UnifiedToolbarProps> = ({
  onOpenSpotlight,
}) => {
  const { activeTab, hearings, clients } = useApp();

  const toolbarStyle: CSSProperties = {
    height: 52,
    minHeight: 52,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    boxSizing: 'border-box',
    backgroundColor: 'var(--macos-toolbar-glass, rgba(255, 255, 255, 0.82))',
    backdropFilter: 'blur(25px) saturate(180%)',
    WebkitBackdropFilter: 'blur(25px) saturate(180%)',
    borderBottom: '1px solid var(--macos-hairline-border, rgba(0, 0, 0, 0.08))',
    WebkitAppRegion: 'drag',
    zIndex: 400,
    position: 'relative',
  } as CSSProperties;

  const noDragStyle: CSSProperties = {
    WebkitAppRegion: 'no-drag',
  } as CSSProperties;

  return (
    <header style={toolbarStyle}>
      {/* ── Izquierda: Controles de ventana + Buscador estilo Spotlight al lado ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0, ...noDragStyle }}>
        <TrafficLights />

        <div
          style={{
            width: 'min(340px, 100%)',
            display: 'flex',
          }}
        >
        <button
          type="button"
          onClick={onOpenSpotlight}
          style={{
            width: '100%',
            height: 30,
            padding: '0 12px',
            borderRadius: 8,
            border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.09))',
            backgroundColor: 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.04))',
            color: 'var(--macos-text-secondary, #8e8e93)',
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
              backgroundColor: 'var(--macos-hover-bg, rgba(0, 0, 0, 0.06))',
              color: 'var(--macos-text-muted, #636366)',
              border: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.08))',
            }}
          >
            ⌘K
          </kbd>
        </button>
        </div>
      </div>

      {/* ── Derecha: Contadores contextuales ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...noDragStyle }}>
        {activeTab === 'calendar' && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 6,
              backgroundColor: 'var(--macos-danger-surface, rgba(255, 59, 48, 0.1))',
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
              backgroundColor: 'rgba(88, 86, 214, 0.12)',
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
      </div>
    </header>
  );
};

export default UnifiedToolbar;
