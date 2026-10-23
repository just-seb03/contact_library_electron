import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Page, Block, Card, CardContent } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { APP_COLORS } from '../../../core/theme/style';

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

const timelineScrollStyle: CSSProperties = {
  height: '100%',
  boxSizing: 'border-box',
  padding: '8px 0',
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
};

export default function Calendar() {
  const { hearings, calendarEvents, clients, addCalendarEvent } = useApp();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<CalendarEvent | null>(null);
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

  const handleCreateEvent = (event: Parameters<typeof addCalendarEvent>[0]) => {
    addCalendarEvent(event);
    const [year, month, day] = event.date.split('-').map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedCalendarEvent(null);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedCalendarEvent(null);
  };

  const selectedEventClient = selectedCalendarEvent?.clientId
    ? clients.find((client) => client.id === selectedCalendarEvent.clientId)?.name
    : undefined;

  return (
    <Page noNavbar noToolbar>
      <Block className="no-margin-top padding-top-half">
        <h1 style={sectionTitleStyle}>Calendario</h1>
        <Card style={calendarCardStyle}>
          <AgendaHeader
            day={currentDay}
            monthShort={monthShort}
            fullDateLabel={fullDateLabel}
            onAddEvent={() => setIsCreateEventOpen(true)}
          />

          <div style={layoutStyle}>
            <div style={timelinePanelStyle}>
              <CardContent style={timelineScrollStyle}>
                <AgendaTimeline
                  todayHearings={todayHearings}
                  calendarEvents={selectedDayEvents}
                  onSelectCalendarEvent={setSelectedCalendarEvent}
                />
              </CardContent>
            </div>

            <div style={sidebarPanelStyle}>
              <AgendaMiniCalendar
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
              <AgendaEventDetail
                event={selectedCalendarEvent}
                clientName={selectedEventClient}
              />
            </div>
          </div>
        </Card>
      </Block>
      <CreateEventPopup
        opened={isCreateEventOpen}
        selectedDate={selectedDate}
        clients={clients}
        onClose={() => setIsCreateEventOpen(false)}
        onCreate={handleCreateEvent}
      />
    </Page>
  );
}
