import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, f7, Page, Block, Card, CardContent } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { APP_COLORS } from '../../../core/theme/style';
import type { HearingEvent } from '../../../core/context/types';

import { AgendaHeader } from '../components/AgendaHeader';
import { AgendaTimeline } from '../components/AgendaTimeline';
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

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 14px',
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.2,
  color: APP_COLORS.black,
};

const calendarCardStyle: CSSProperties = {
  ['--f7-card-bg-color' as string]: APP_COLORS.white,
  ['--f7-card-border-radius' as string]: '16px',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 150px)',
  minHeight: 320,
  margin: 0,
  border: '1px solid rgba(0,0,0,0.08)',
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
  flexShrink: 0,
  borderLeft: '1px solid rgba(0,0,0,0.08)',
};

const undoBannerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '10px 16px',
  borderTop: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: '#f5f5f7',
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

  const fullDateLabel = `${MONTH_NAMES_FULL[currentMonthIndex]} ${currentYear}`;
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

  return (
    <Page noNavbar noToolbar style={{ overflowX: 'hidden' }}>
      <Block
        className="no-margin-top padding-top-half"
        style={{
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <h1 style={sectionTitleStyle}>Calendario</h1>
        <Card style={calendarCardStyle}>
          <AgendaHeader
            day={currentDay}
            monthShort={monthShort}
            fullDateLabel={fullDateLabel}
            onPreviousDay={() => handleSelectDate(new Date(currentYear, currentMonthIndex, currentDay - 1))}
            onToday={() => handleSelectDate(new Date())}
            onNextDay={() => handleSelectDate(new Date(currentYear, currentMonthIndex, currentDay + 1))}
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
              <CardContent style={timelineScrollStyle}>
                <AgendaTimeline
                  todayHearings={todayHearings}
                  calendarEvents={selectedDayEvents}
                  onSelectEvent={setSelectedEvent}
                />
              </CardContent>
            </div>

            <div style={{
              ...sidebarPanelStyle,
              width: compactLayout ? '100%' : 300,
              minWidth: compactLayout ? 0 : 300,
              borderLeft: compactLayout ? 'none' : '1px solid rgba(0,0,0,0.08)',
              borderTop: compactLayout ? '1px solid rgba(0,0,0,0.08)' : 'none',
            }}>
              <AgendaMiniCalendar
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
              <AgendaEventDetail
                event={selectedEvent}
                clientName={selectedEventClient}
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
