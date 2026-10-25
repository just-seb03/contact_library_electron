import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, f7, Page, Block, Card, CardContent } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import type { HearingEvent } from '../../../core/context/types';

import { AgendaHeader } from '../components/AgendaHeader';
import { AgendaTimeline } from '../components/AgendaTimeline';
import { AgendaWeekView } from '../components/AgendaWeekView';
import { AgendaMiniCalendar } from '../components/AgendaMiniCalendar';
import { AgendaEventDetail } from '../components/AgendaEventDetail';
import { CreateEventPopup } from '../components/CreateEventPopup';
import type { CalendarEvent } from '../types';

const MONTH_NAMES_FULL = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTH_NAMES_SHORT = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

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

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 14px',
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.2,
  color: 'var(--macos-text, #1c1c1e)',
};

const calendarCardStyle: CSSProperties = {
  ['--f7-card-bg-color' as string]: 'var(--macos-card-bg, #ffffff)',
  ['--f7-card-border-radius' as string]: '16px',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 150px)',
  minHeight: 320,
  margin: 0,
  border: '1px solid var(--macos-card-border, rgba(0,0,0,0.08))',
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  overflow: 'hidden',
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
  padding: '8px 0',
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
  const [isWeekView, setIsWeekView] = useState(false);
  const [deletedEvent, setDeletedEvent] = useState<CalendarEvent | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const fullDateLabel = `${MONTH_NAMES_FULL[currentMonthIndex]} ${currentYear}`;
  const weekStart = new Date(currentYear, currentMonthIndex, currentDay);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekDateLabel = `Semana del ${weekStart.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  })} al ${weekEnd.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
  const monthShort = MONTH_NAMES_SHORT[currentMonthIndex];

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
      <Block
        className="no-margin-top padding-top-half"
        style={{
          width: '100%',
          minWidth: 0,
          paddingTop: '20px',
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <h1 style={sectionTitleStyle}>Calendario</h1>
        <Card style={calendarCardStyle}>
          <AgendaHeader
            day={currentDay}
            monthShort={monthShort}
            fullDateLabel={isWeekView ? weekDateLabel : fullDateLabel}
            isWeekView={isWeekView}
            onToday={() => handleSelectDate(new Date())}
            onPreviousDay={() => handleSelectDate(new Date(
              currentYear,
              currentMonthIndex,
              currentDay - (isWeekView ? 7 : 1)
            ))}
            onToggleWeekView={() => {
              setIsWeekView((previous) => !previous);
              setSelectedEvent(null);
            }}
            onNextDay={() => handleSelectDate(new Date(
              currentYear,
              currentMonthIndex,
              currentDay + (isWeekView ? 7 : 1)
            ))}
            onAddEvent={() => {
              setEditingEvent(null);
              setIsCreateEventOpen(true);
            }}
          />

          <div
            style={{
              ...layoutStyle,
              gridTemplateColumns: compactLayout ? 'minmax(0, 1fr)' : 'minmax(0, 1fr) 300px',
              overflowY: compactLayout ? 'auto' : 'hidden',
            }}
          >
            <div style={{
              ...timelinePanelStyle,
              height: compactLayout ? '50vh' : '100%',
            }}>
              {isWeekView ? (
                <CardContent style={{ ...timelineScrollStyle, padding: 0 }}>
                  <AgendaWeekView
                    selectedDate={selectedDate}
                    calendarEvents={calendarEvents}
                    hearings={hearings}
                    onSelectEvent={setSelectedEvent}
                  />
                </CardContent>
              ) : (
                <CardContent style={timelineScrollStyle}>
                  <AgendaTimeline
                    todayHearings={todayHearings}
                    calendarEvents={selectedDayEvents}
                    onSelectEvent={setSelectedEvent}
                    selectedDate={selectedDate}
                  />
                </CardContent>
              )}
            </div>

            <div style={{
              ...sidebarPanelStyle,
              width: compactLayout ? '100%' : 300,
              minWidth: compactLayout ? 0 : 300,
              borderLeft: compactLayout ? 'none' : '1px solid var(--macos-card-border, rgba(0,0,0,0.08))',
              borderTop: compactLayout ? '1px solid var(--macos-card-border, rgba(0,0,0,0.08))' : 'none',
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
