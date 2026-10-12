import { useState } from 'react';
import type { CSSProperties, FC } from 'react';
import { Card, CardContent } from 'framework7-react';
import { useApp } from '../../context/AppContext';

interface CalendarGridProps {
  currentYear: number;
  currentMonthIndex: number;
  currentDay: number;
  onSelectDay: (day: number) => void;
}

export const CalendarGrid: FC<CalendarGridProps> = ({
  currentYear,
  currentMonthIndex,
  currentDay,
  onSelectDay,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const { hearings } = useApp();

  const firstDay = new Date(currentYear, currentMonthIndex, 1);
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.

  const emptyBefore = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyAfterCount = 42 - firstDayOfWeek - daysInMonth;
  const emptyAfter = Array.from({ length: emptyAfterCount > 0 ? emptyAfterCount : 0 }, (_, i) => i);

  return (
    <Card 
      outline={false}
      className="no-border margin-horizontal-none margin-bottom elevation-2"
      style={styles.glassCard}
    >
      <CardContent padding={false} style={{ padding: '12px' }}>
        <div style={styles.gridContainer} className="calendar-grid-container">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <div key={d} style={styles.headerDay} className="calendar-header-day">{d}</div>
          ))}

          {emptyBefore.map(i => (
            <div key={`eb-${i}`} style={styles.emptyCell} className="calendar-empty-cell"></div>
          ))}

          {days.map(d => {
            const isCurrent = d === currentDay;
            const isHovered = hoveredDay === d;

            let cellStyle: CSSProperties = { ...styles.dayCell };

            if (isCurrent) {
              cellStyle = {
                ...cellStyle,
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(0, 135, 255, 0.95) 0%, rgba(0, 105, 235, 1) 100%)'
                  : 'linear-gradient(135deg, rgba(0, 122, 255, 0.9) 0%, rgba(0, 90, 220, 0.98) 100%)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: isHovered
                  ? '0 8px 22px rgba(0, 122, 255, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.5)'
                  : '0 6px 18px rgba(0, 122, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                fontWeight: 700,
                transform: isHovered ? 'translateY(-2px)' : 'none',
              };
            } else if (isHovered) {
              cellStyle = {
                ...cellStyle,
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
                zIndex: 2,
              };
            }

            const hasHearing = hearings.some(
              (h) => h.day === d && h.monthIndex === currentMonthIndex && h.year === currentYear
            );

            return (
              <div 
                key={d} 
                className={`calendar-day-cell ${isCurrent ? 'current-day' : ''}`}
                onClick={() => onSelectDay(d)}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                style={cellStyle}
              >
                <span style={{ fontSize: '15px' }}>{d}</span>
                {hasHearing && (
                  <span 
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? '#ffffff' : '#007aff',
                      marginTop: '4px',
                      boxShadow: isCurrent ? '0 0 4px #fff' : '0 0 4px rgba(0, 122, 255, 0.6)',
                    }}
                    title="Audiencia programada"
                  />
                )}
              </div>
            );
          })}

          {emptyAfter.map(i => (
            <div key={`ea-${i}`} style={styles.emptyCell} className="calendar-empty-cell"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const styles: Record<string, CSSProperties> = {
  glassCard: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    backgroundColor: 'rgba(240, 242, 247, 0.4)',
    gap: '6px',
    padding: '12px',
    borderRadius: '22px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.65)',
  },
  headerDay: {
    fontWeight: 600,
    padding: '10px 0',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    color: 'inherit',
    fontSize: '12px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    userSelect: 'none',
  },
  emptyCell: {
    background: 'rgba(255, 255, 255, 0.15)',
    minHeight: '70px',
    borderRadius: '14px',
    border: '1px dashed rgba(255, 255, 255, 0.4)',
  },
  dayCell: {
    minHeight: '70px',
    background: 'rgba(255, 255, 255, 0.42)',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '8px 10px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
  },
};
