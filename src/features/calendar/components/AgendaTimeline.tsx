import type { FC, CSSProperties } from 'react';
import { APP_COLORS } from '../../../core/theme/style';
import type { HearingEvent } from '../../../core/context/types';

interface AgendaTimelineProps {
  todayHearings: HearingEvent[];
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const HOUR_HEIGHT = 64;

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function parseTimeToHour(timeStr: string): number {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return 9;
  let hour = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour + minutes / 60;
}

const EVENT_COLORS = [
  { bg: 'rgba(200, 180, 255, 0.35)', border: '#9b7fd4' },
  { bg: 'rgba(180, 210, 255, 0.35)', border: '#6ea8e6' },
  { bg: 'rgba(180, 240, 200, 0.35)', border: '#5ec488' },
  { bg: 'rgba(255, 220, 180, 0.35)', border: '#e6a85c' },
];

const containerStyle: CSSProperties = {
  position: 'relative',
  minHeight: HOURS.length * HOUR_HEIGHT,
  marginTop: 8,
};

const hourRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  height: HOUR_HEIGHT,
  borderTop: '1px solid rgba(0,0,0,0.06)',
};

const hourLabelStyle: CSSProperties = {
  width: 56,
  flexShrink: 0,
  fontSize: 11,
  fontWeight: 500,
  color: APP_COLORS.neutral,
  textAlign: 'right',
  paddingRight: 12,
  transform: 'translateY(-7px)',
};

const hourCellStyle: CSSProperties = {
  flex: 1,
  height: '100%',
  position: 'relative',
};

const nowLineStyle: CSSProperties = {
  position: 'absolute',
  left: 56,
  right: 0,
  height: 2,
  backgroundColor: APP_COLORS.primary,
  zIndex: 3,
};

const nowDotStyle: CSSProperties = {
  position: 'absolute',
  left: 50,
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: APP_COLORS.primary,
  transform: 'translateY(-4px)',
  zIndex: 4,
};

const eventBlockBaseStyle: CSSProperties = {
  position: 'absolute',
  left: 60,
  right: 8,
  borderRadius: 8,
  padding: '6px 10px',
  zIndex: 2,
  overflow: 'hidden',
  cursor: 'pointer',
  borderLeft: '3px solid',
};

const eventTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: APP_COLORS.black,
  lineHeight: 1.3,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const eventTimeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 400,
  color: APP_COLORS.neutral,
  lineHeight: 1.3,
};

export const AgendaTimeline: FC<AgendaTimelineProps> = ({ todayHearings }) => {
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const nowLineTop = currentHourDecimal * HOUR_HEIGHT;
  const showNowLine = currentHourDecimal >= 0 && currentHourDecimal <= HOURS.length;

  return (
    <div style={containerStyle}>
      {/* Hourly rows */}
      {HOURS.map((hour) => (
        <div key={hour} style={hourRowStyle}>
          <div style={hourLabelStyle}>{formatHour(hour)}</div>
          <div style={hourCellStyle} />
        </div>
      ))}

      {/* Current time indicator */}
      {showNowLine && (
        <>
          <div style={{ ...nowLineStyle, top: nowLineTop }} />
          <div style={{ ...nowDotStyle, top: nowLineTop }} />
        </>
      )}

      {/* Events positioned on the timeline */}
      {todayHearings.map((hearing, idx) => {
        const hourDecimal = parseTimeToHour(hearing.timeStr);
        const top = hourDecimal * HOUR_HEIGHT;
        const eventHeight = Math.min(
          HOUR_HEIGHT * 1.2,
          (HOURS.length - hourDecimal) * HOUR_HEIGHT
        );
        const colors = EVENT_COLORS[idx % EVENT_COLORS.length];

        return (
          <div
            key={hearing.id}
            style={{
              ...eventBlockBaseStyle,
              top,
              height: eventHeight,
              backgroundColor: colors.bg,
              borderLeftColor: colors.border,
            }}
          >
            <div style={eventTitleStyle}>{hearing.clientName}</div>
            <div style={eventTimeStyle}>{hearing.timeStr}</div>
          </div>
        );
      })}
    </div>
  );
};
