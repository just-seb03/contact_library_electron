import { useMemo, type FC, type CSSProperties } from 'react';
import { TrafficLights } from '../windowControls/TrafficLights';

export const UnifiedToolbar: FC = () => {

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
    <header style={toolbarStyle} className="chrome-top-enter">
      <style>{`
        @keyframes chromeTopEnter {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chrome-top-enter {
          animation: chromeTopEnter 0.34s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .chrome-top-enter { animation: none !important; transform: none !important; }
        }
      `}</style>
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

      {/* ── Derecha: Espacio reservado ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...noDragStyle }} />
    </header>
  );
};

export default UnifiedToolbar;
