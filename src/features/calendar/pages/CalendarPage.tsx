import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, f7, Page, Block, Card, CardContent } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import type { HearingEvent } from '../../../core/context/types';
import { useNavigationFocus } from '../../../navigation/useNavigationFocus';

import { AgendaHeader } from '../components/AgendaHeader';
import { AgendaTimeline } from '../components/AgendaTimeline';
import { AgendaMiniCalendar } from '../components/AgendaMiniCalendar';
import { AgendaEventDetail } from '../components/AgendaEventDetail';
import { CreateEventPopup } from '../components/CreateEventPopup';
import type { CalendarEvent } from '../types';

function to24HourTime(time: string): string | null {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 1 || hours > 12 || minutes > 59) return null;
  if (match[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (match[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

const calendarCardStyle: CSSProperties = {
  ['--f7-card-bg-color' as string]: 'rgba(255, 255, 255, 0.038)',
  ['--f7-card-border-radius' as string]: '18px',
  backgroundColor: 'rgba(255, 255, 255, 0.038)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 980,
  height: 'calc(100vh - 118px)',
  minHeight: 320,
  margin: '0 auto',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.24)',
  overflow: 'hidden',
  maskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black calc(100% - 88px), transparent 100%)',
};

const layoutStyle: CSSProperties = {
  display: 'flex',
  flex: 1,
  minHeight: 0,
};

const timelinePanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  minHeight: 0,
};

const sidebarPanelStyle: CSSProperties = {
  width: 300,
  minWidth: 300,
  minHeight: 0,
  flexShrink: 0,
  borderLeft: '1px solid rgba(0,0,0,0.08)',
  paddingBottom: 68,
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
};

const undoBannerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '10px 16px',
  borderTop: '1px solid var(--macos-card-border, rgba(0,0,0,0.08))',
  backgroundColor: 'var(--macos-input-bg, #f5f5f7)',
  color: 'var(--macos-text, #1c1c1e)',
  fontSize: 13,
};

const timelineScrollStyle: CSSProperties = {
  height: '100%',
  boxSizing: 'border-box',
  padding: 0,
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
};

export default function Calendar() {
  const {
    hearings,
    calendarEvents,
    clients,
    addCalendarEvent,
    updateCalendarEvent,
    removeCalendarEvent,
    restoreCalendarEvent,
  } = useApp();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | HearingEvent | null>(null);
  const [compactLayout, setCompactLayout] = useState(false);
  const [deletedEvent, setDeletedEvent] = useState<CalendarEvent | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apertura desde fuera de la página (clic en una notificación): ir al día y mostrar el detalle.
  useNavigationFocus('calendarEvent', ({ id }) => {
    const event = calendarEvents.find((item) => item.id === id);
    if (!event) return false;
    const [year, month, day] = event.date.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedEvent(event);
    return true;
  });

  useNavigationFocus('hearing', ({ clientId }) => {
    const hearing = hearings.find((item) => item.clientId === clientId);
    if (!hearing) return false;
    setSelectedDate(new Date(hearing.year, hearing.monthIndex, hearing.day));
    setSelectedEvent(hearing);
    return true;
  });

  const currentDay = selectedDate.getDate();
  const currentMonthIndex = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const todayHearings = useMemo(
    () =>
      hearings.filter(
        (h) =>
          h.day === currentDay &&
          h.monthIndex === currentMonthIndex &&
          h.year === currentYear
      ),
    [hearings, currentDay, currentMonthIndex, currentYear]
  );

  const selectedDayEvents = useMemo(
    () => calendarEvents.filter((event) => {
      const [year, month, day] = event.date.split('-').map(Number);
      return year === currentYear && month === currentMonthIndex + 1 && day === currentDay;
    }),
    [calendarEvents, currentDay, currentMonthIndex, currentYear]
  );

  const eventDates = useMemo(
    () => new Set([
      ...calendarEvents.map((event) => event.date),
      ...hearings.map((hearing) => (
        `${hearing.year}-${String(hearing.monthIndex + 1).padStart(2, '0')}-${String(hearing.day).padStart(2, '0')}`
      )),
    ]),
    [calendarEvents, hearings]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateLayout = () => setCompactLayout(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener('change', updateLayout);
    return () => {
      mediaQuery.removeEventListener('change', updateLayout);
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  const handleCreateEvent = (event: Parameters<typeof addCalendarEvent>[0]) => {
    addCalendarEvent(event);
    const [year, month, day] = event.date.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedEvent(null);
  };

  const handleUpdateEvent = (event: CalendarEvent) => {
    updateCalendarEvent(event);
    const [year, month, day] = event.date.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedEvent(event);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    f7.dialog.confirm(
      `¿Quieres eliminar «${event.title}»?`,
      'Eliminar evento',
      () => {
        const removed = removeCalendarEvent(event.id);
        if (!removed) return;
        setSelectedEvent(null);
        setDeletedEvent(removed);
        if (undoTimer.current) clearTimeout(undoTimer.current);
        undoTimer.current = setTimeout(() => setDeletedEvent(null), 8000);
      }
    );
  };

  const handleUndoDelete = () => {
    if (!deletedEvent) return;
    restoreCalendarEvent(deletedEvent);
    setSelectedEvent(deletedEvent);
    setDeletedEvent(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  };

  const selectedEventClient = selectedEvent && 'clientId' in selectedEvent
    ? clients.find((client) => client.id === selectedEvent.clientId)?.name
    : undefined;
  const selectedHearingEndTime = selectedEvent && !('date' in selectedEvent)
    ? (() => {
        const startTime = to24HourTime(selectedEvent.timeStr);
        if (!startTime) return undefined;

        const date = `${selectedEvent.year}-${String(selectedEvent.monthIndex + 1).padStart(2, '0')}-${String(selectedEvent.day).padStart(2, '0')}`;
        return calendarEvents.find((event) => (
          event.clientId === selectedEvent.clientId
          && event.date === date
          && event.startTime === startTime
        ))?.endTime;
      })()
    : undefined;

  return (
    <Page noNavbar noToolbar style={{ overflowX: 'hidden' }}>
      <style>{`
        @keyframes calEnter {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes calSwitch {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.988);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes calStep {
          from {
            opacity: 0;
            transform: translateX(10px) scale(0.992);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .cal-anim {
          opacity: 0;
          animation: calEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .cal-switch-anim {
          animation: calSwitch 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        .cal-step-anim {
          animation: calStep 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: reduce) {
          .cal-anim,
          .cal-switch-anim,
          .cal-step-anim {
            opacity: 1;
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
      <Block
        className="no-margin-top"
        style={{
          width: '100%',
          minWidth: 0,
          padding: '12px 32px 0 32px',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Card className="cal-anim" style={{ ...calendarCardStyle, animationDelay: '60ms' }}>
          <AgendaHeader
            year={currentYear}
            monthIndex={currentMonthIndex}
            selectedDay={currentDay}
            eventDates={eventDates}
            onSelectDay={(day) => handleSelectDate(new Date(currentYear, currentMonthIndex, day))}
            onAddEvent={() => {
              setEditingEvent(null);
              setIsCreateEventOpen(true);
            }}
          />

          <div
            style={{
              ...layoutStyle,
              flexDirection: compactLayout ? 'column' : 'row',
              overflowY: compactLayout ? 'auto' : 'hidden',
            }}
          >
            <div
              style={{
                ...timelinePanelStyle,
                height: compactLayout ? '50vh' : '100%',
                flex: compactLayout ? '0 0 auto' : 1,
              }}
            >
              <CardContent style={timelineScrollStyle}>
                <div
                  key={`${currentYear}-${currentMonthIndex}-${currentDay}`}
                  className="cal-step-anim"
                >
                  <AgendaTimeline
                    todayHearings={todayHearings}
                    calendarEvents={selectedDayEvents}
                    onSelectEvent={setSelectedEvent}
                    selectedDate={selectedDate}
                  />
                </div>
              </CardContent>
            </div>

            <div style={{
              ...sidebarPanelStyle,
              width: compactLayout ? '100%' : 300,
              minWidth: compactLayout ? 0 : 300,
              borderLeft: compactLayout ? 'none' : '1px solid rgba(255, 255, 255, 0.07)',
              borderTop: compactLayout ? '1px solid rgba(255, 255, 255, 0.07)' : 'none',
            }}>
              <AgendaMiniCalendar
                selectedDate={selectedDate}
                eventDates={eventDates}
                onSelectDate={handleSelectDate}
              />
              <AgendaEventDetail
                event={selectedEvent}
                clientName={selectedEventClient}
                hearingEndTime={selectedHearingEndTime}
                onEdit={(event) => {
                  setEditingEvent(event);
                  setIsCreateEventOpen(true);
                }}
                onDelete={handleDeleteEvent}
              />
            </div>
          </div>
          {deletedEvent && (
            <div style={undoBannerStyle} role="status">
              <span>Se eliminó «{deletedEvent.title}».</span>
              <Button small onClick={handleUndoDelete}>Deshacer</Button>
            </div>
          )}
        </Card>
      </Block>
      <CreateEventPopup
        opened={isCreateEventOpen}
        selectedDate={selectedDate}
        clients={clients}
        existingEvents={calendarEvents}
        existingHearings={hearings}
        editingEvent={editingEvent}
        onClose={() => setIsCreateEventOpen(false)}
        onCreate={handleCreateEvent}
        onUpdate={handleUpdateEvent}
      />
    </Page>
  );
}
