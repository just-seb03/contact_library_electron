import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';

interface AgendaHeaderProps {
  year: number;
  monthIndex: number;
  selectedDay: number;
  eventDates: ReadonlySet<string>;
  onSelectDay?: (day: number) => void;
  onAddEvent: () => void;
}

export const AgendaHeader: FC<AgendaHeaderProps> = ({
  year,
  monthIndex,
  selectedDay,
  eventDates,
  onSelectDay,
  onAddEvent,
}) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthPadded = String(monthIndex + 1).padStart(2, '0');

  const headerStyle: CSSProperties = {
    padding: '10px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  };

  return (
    <div style={headerStyle}>
      {/* ── Izquierda: Puntos por cada día del mes seleccionado ── */}
      <div
        className="cal-step-anim"
        key={`${year}-${monthIndex}`}
        role="group"
        aria-label="Días del mes"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 5,
          minWidth: 0,
        }}
      >
        {Array.from({ length: daysInMonth }, (_, idx) => {
          const dayNum = idx + 1;
          const dateKey = `${year}-${monthPadded}-${String(dayNum).padStart(2, '0')}`;
          const hasEvent = eventDates.has(dateKey);
          const isFilled = dayNum <= selectedDay;
          const isCurrentDay = dayNum === selectedDay;

          const dotColor = hasEvent
            ? '#ff3b30'
            : isFilled
            ? 'var(--macos-text, #ececef)'
            : 'rgba(255, 255, 255, 0.16)';

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => onSelectDay?.(dayNum)}
              title={`Día ${dayNum}${hasEvent ? ' • Con eventos' : ''}`}
              aria-label={`Día ${dayNum}${hasEvent ? ', tiene eventos' : ''}`}
              aria-pressed={isCurrentDay}
              style={{
                width: isCurrentDay ? 8 : 6,
                height: isCurrentDay ? 8 : 6,
                padding: 0,
                border: 'none',
                borderRadius: '50%',
                backgroundColor: dotColor,
                opacity: hasEvent ? (isFilled ? 1 : 0.72) : isFilled ? (isCurrentDay ? 1 : 0.78) : 1,
                boxShadow: hasEvent
                  ? '0 0 6px rgba(255, 59, 48, 0.5)'
                  : isCurrentDay
                  ? '0 0 0 2px rgba(255, 255, 255, 0.2)'
                  : 'none',
                cursor: onSelectDay ? 'pointer' : 'default',
                transition: 'all 0.16s cubic-bezier(0.16, 1, 0.3, 1)',
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      {/* ── Derecha: Icono + grande para añadir evento ── */}
      <button
        type="button"
        onClick={onAddEvent}
        aria-label="Añadir evento"
        title="Añadir evento"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          padding: 0,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'var(--macos-text, #ececef)',
          opacity: 0.85,
          cursor: 'pointer',
          transition: 'opacity 0.14s ease, transform 0.14s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.85';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Icon f7="plus" size="24px" />
      </button>
    </div>
  );
};

export default AgendaHeader;
