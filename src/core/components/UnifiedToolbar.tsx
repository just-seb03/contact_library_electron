import { useMemo, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import { useApp } from '../context/AppContext';
import { TrafficLights } from '../windowControls/TrafficLights';

export const UnifiedToolbar: FC = () => {
  const { activeTab, hearings, clients } = useApp();

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

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
    WebkitAppRegion: 'drag',
    zIndex: 400,
    position: 'relative',
  } as CSSProperties;

  const noDragStyle: CSSProperties = {
    WebkitAppRegion: 'no-drag',
  } as CSSProperties;

  return (
    <header style={toolbarStyle}>
      {/* ── Izquierda: Controles de ventana + Fecha actual con transparencia ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...noDragStyle }}>
        <TrafficLights />
        <span
          style={{
            fontSize: 12,
            color: 'var(--macos-text, #ececef)',
            opacity: 0.58,
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
          }}
        >
          {todayLabel}
        </span>
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
