import { useState } from 'react';
import { Card, CardContent, Icon } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { DASHBOARD_WIDGET_STYLE } from '../styles';

function getTimeInMinutes(time: string): number | null {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;

  const rawHours = Number(match[1]);
  let hours = match[3] ? rawHours % 12 : rawHours;
  const minutes = Number(match[2]);
  if (match[3]?.toUpperCase() === 'PM') hours += 12;

  return hours * 60 + minutes;
}

function formatTime(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return time;
  const meridiem = match[3]?.toUpperCase();
  const hours = meridiem
    ? `${Number(match[1])}:${match[2]} ${meridiem}`
    : `${String(Number(match[1])).padStart(2, '0')}:${match[2]}`;
  return hours;
}

export function DailyProgressCard() {
  const { hearings } = useApp();
  const [showSchedule, setShowSchedule] = useState(false);
  const now = new Date();
  const todayHearings = hearings
    .filter(
      (hearing) =>
        hearing.year === now.getFullYear() &&
        hearing.monthIndex === now.getMonth() &&
        hearing.day === now.getDate()
    )
    .sort((first, second) => {
      return (getTimeInMinutes(first.timeStr) ?? 0) - (getTimeInMinutes(second.timeStr) ?? 0);
    });
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const elapsedHearings = todayHearings.filter((hearing) => {
    const time = getTimeInMinutes(hearing.timeStr);
    return time !== null && time <= currentTime;
  });
  const remainingHearings = todayHearings.filter((hearing) => {
    const time = getTimeInMinutes(hearing.timeStr);
    return time === null || time > currentTime;
  });
  const progress = todayHearings.length
    ? Math.round((elapsedHearings.length / todayHearings.length) * 100)
    : 0;
  const nextHearing = remainingHearings[0];
  const circumference = 2 * Math.PI * 42;

  return (
    <Card
      outline
      className="no-margin"
      style={{
        ...DASHBOARD_WIDGET_STYLE,
        minHeight: '170px',
        height: '100%',
      }}
    >
      <CardContent
        style={{
          height: '100%',
          minHeight: '170px',
          padding: '20px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setShowSchedule((visible) => !visible)}
          aria-label={showSchedule ? 'Mostrar avance de la jornada' : 'Ver agenda restante de hoy'}
          aria-pressed={showSchedule}
          style={{
            position: 'relative',
            flex: '0 0 108px',
            width: '108px',
            height: '108px',
            padding: 0,
            border: 0,
            borderRadius: '50%',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <svg viewBox="0 0 100 100" width="108" height="108" aria-hidden="true">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0, 122, 255, 0.12)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#007aff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * circumference} ${circumference}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </svg>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--macos-text, #1c1c1e)',
            }}
          >
            <strong style={{ fontSize: '23px', lineHeight: 1 }}>{progress}%</strong>
            <span style={{ marginTop: '4px', fontSize: '10px', color: 'var(--macos-text-secondary, #6e6e73)' }}>del día</span>
          </span>
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <h2 className="no-margin" style={{ color: 'var(--macos-text, #1c1c1e)', fontSize: '15px', fontWeight: 700 }}>
              JORNADA DE HOY
            </h2>
            <span style={{ color: 'var(--macos-text-secondary, #6e6e73)', fontSize: '12px' }}>
              {elapsedHearings.length} de {todayHearings.length}
            </span>
          </div>

          {showSchedule ? (
            remainingHearings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {remainingHearings.map((hearing) => (
                  <div
                    key={hearing.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--macos-text, #1c1c1e)', fontSize: '13px' }}
                  >
                    <Icon f7="clock" size="14px" style={{ color: '#007aff', flexShrink: 0 }} />
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formatTime(hearing.timeStr)} · {hearing.clientName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-margin" style={{ color: 'var(--macos-text-secondary, #6e6e73)', fontSize: '13px' }}>
                No quedan reuniones en la agenda de hoy.
              </p>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--macos-text, #1c1c1e)' }}>
                <Icon f7="checkmark_circle_fill" size="14px" style={{ color: '#34c759', marginRight: '7px' }} />
                {elapsedHearings.length} {elapsedHearings.length === 1 ? 'reunión transcurrida' : 'reuniones transcurridas'}
                {elapsedHearings.length > 0 && <span style={{ color: 'var(--macos-text-secondary, #6e6e73)' }}> según horario</span>}
              </span>
              <span style={{ color: 'var(--macos-text, #1c1c1e)' }}>
                <Icon f7="circle_fill" size="8px" style={{ color: '#007aff', marginRight: '10px' }} />
                {nextHearing
                  ? `${remainingHearings.length} ${remainingHearings.length === 1 ? 'audiencia restante' : 'audiencias restantes'} · ${formatTime(nextHearing.timeStr)}`
                  : 'Sin audiencias restantes'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
