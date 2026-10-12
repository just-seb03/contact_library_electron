import { useEffect, useState, useRef } from 'react';
import { Link, Icon } from 'framework7-react';
import { useApp } from '../../context/AppContext';

type DayScheduleProps = {
  date: number;
  monthIndex: number;
  month: string;
  year: number;
  onClose: () => void;
};

const HOUR_ROW_HEIGHT = 70;
const SCHEDULE_TOP_PADDING = 20;
const HEARING_DURATION_MINUTES = 60;

function parseTime(timeStr: string): number | null {
  const match = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const period = match[3].toUpperCase();
  if (hour < 1 || hour > 12 || minute > 59) return null;

  return (hour % 12 + (period === 'PM' ? 12 : 0)) * 60 + minute;
}

function formatTime(minutes: number): string {
  const normalizedMinutes = minutes % (24 * 60);
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`;
}

export const DayScheduleOverlay = ({ date, monthIndex, month, year, onClose }: DayScheduleProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [panelWidth, setPanelWidth] = useState(420);
  const isResizing = useRef(false);
  const { hearings } = useApp();
  const dayHearings = hearings.filter(
    (h) => h.day === date && h.monthIndex === monthIndex && h.year === year
  );
  
  useEffect(() => {
    // Dispara la animación de entrada después de montar
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Lógica de redimensionamiento
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      setPanelWidth(prev => Math.max(300, Math.min(prev + e.movementX, 800)));
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Espera a que termine la animación
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div style={styles.overlayContainer}>
      {/* Fondo oscuro desenfocado */}
      <div 
        style={{...styles.backdrop, opacity: isVisible ? 1 : 0}} 
        onClick={handleClose} 
      />
      
      {/* Panel Deslizante */}
      <div style={{
        ...styles.panel, 
        width: `${panelWidth}px`,
        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
        // Evita transiciones de ancho mientras se arrastra
        transition: isResizing.current ? 'none' : 'transform 0.3s cubic-bezier(0.1, 0.7, 0.1, 1)'
      }}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{date} de {month}</h2>
            <span style={styles.subtitle}>{year}</span>
          </div>
          <Link onClick={handleClose}>
            <Icon f7="multiply_circle_fill" size="28px" color="gray" />
          </Link>
        </div>

        {dayHearings.length > 0 && (
          <div style={{
            margin: '0 20px 14px 20px',
            padding: '12px 16px',
            background: 'rgba(0, 122, 255, 0.08)',
            border: '1px solid rgba(0, 122, 255, 0.25)',
            borderRadius: '16px',
          }}>
            {dayHearings.map((h) => (
              <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ fontWeight: 600, color: '#007aff', fontSize: '13px' }}>
                  {h.timeStr} · {h.clientName}
                </div>
                <div style={{ fontSize: '12px', color: '#555' }}>
                  {h.expediente} — {h.materia}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>
                  {h.juzgado}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={styles.scheduleContainer}>
          <div style={styles.scheduleInner}>
            {hours.map(hour => (
              <div key={hour} style={styles.hourRow}>
                <div style={styles.timeLabel}>
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                <div style={styles.hourLineContainer}>
                  <div style={styles.hourLine}></div>
                </div>
              </div>
            ))}
            {dayHearings.map((hearing) => {
              const startMinutes = parseTime(hearing.timeStr);
              if (startMinutes === null) return null;

              const top = SCHEDULE_TOP_PADDING + (startMinutes / 60) * HOUR_ROW_HEIGHT;
              const endTime = formatTime(startMinutes + HEARING_DURATION_MINUTES);

              return (
                <div
                  key={hearing.id}
                  style={{
                    ...styles.hearingBlock,
                    top,
                    height: HOUR_ROW_HEIGHT,
                  }}
                >
                  <div style={styles.hearingTime}>
                    {hearing.timeStr} - {endTime}
                  </div>
                  <div style={styles.hearingTitle}>{hearing.clientName}</div>
                  <div style={styles.hearingDetails}>{hearing.expediente} · {hearing.materia}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tirador para redimensionar el panel */}
        <div style={styles.resizer} onMouseDown={startResizing} />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: 'flex',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    transition: 'opacity 0.3s ease',
  },
  panel: {
    position: 'relative',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    backdropFilter: 'blur(30px) saturate(190%)',
    WebkitBackdropFilter: 'blur(30px) saturate(190%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.7)',
    boxShadow: '10px 0 40px rgba(0, 0, 0, 0.09)',
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    overflow: 'hidden',
  },
  resizer: {
    position: 'absolute',
    top: 0,
    right: -3,
    width: '6px',
    height: '100%',
    cursor: 'ew-resize',
    zIndex: 1002,
    backgroundColor: 'transparent',
  },
  header: {
    padding: '70px 24px 20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#86868b',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  scheduleContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '0',
    backgroundColor: 'transparent',
  },
  scheduleInner: {
    padding: '20px 0 60px',
    position: 'relative',
  },
  hourRow: {
    display: 'flex',
    height: '70px',
    position: 'relative',
  },
  timeLabel: {
    width: '80px',
    textAlign: 'right',
    paddingRight: '16px',
    fontSize: '13px',
    color: '#86868b',
    fontWeight: '600',
    position: 'relative',
    top: '-8px', // Para alinear el texto con la línea
    flexShrink: 0,
  },
  hourLineContainer: {
    flex: 1,
    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
    position: 'relative',
  },
  hourLine: {
    position: 'absolute',
    top: '35px', // Mitad de la hora
    left: 0,
    right: 0,
    borderTop: '1px dashed rgba(0, 0, 0, 0.04)', 
  },
  hearingBlock: {
    position: 'absolute',
    left: '88px',
    right: '12px',
    zIndex: 1,
    boxSizing: 'border-box',
    padding: '8px 10px',
    overflow: 'hidden',
    borderRadius: '10px',
    border: '1px solid rgba(0, 122, 255, 0.35)',
    background: 'rgba(0, 122, 255, 0.14)',
    boxShadow: '0 2px 8px rgba(0, 122, 255, 0.12)',
  },
  hearingTime: {
    color: '#0066cc',
    fontSize: '11px',
    fontWeight: 700,
  },
  hearingTitle: {
    marginTop: '3px',
    color: '#1d1d1f',
    fontSize: '13px',
    fontWeight: 600,
  },
  hearingDetails: {
    marginTop: '2px',
    color: '#555',
    fontSize: '11px',
  },
};
