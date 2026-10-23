import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Page, Block, Card, CardContent } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import { APP_COLORS } from '../../../core/theme/style';

import { AgendaHeader } from '../components/AgendaHeader';
import { AgendaTimeline } from '../components/AgendaTimeline';
import { AgendaMiniCalendar } from '../components/AgendaMiniCalendar';
import { AgendaEventDetail } from '../components/AgendaEventDetail';

const MONTH_NAMES_FULL = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const MONTH_NAMES_SHORT = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

const WEEKDAY_NAMES = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles',
  'Jueves', 'Viernes', 'Sábado',
];

const layoutStyle: CSSProperties = {
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
};

const timelinePanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const sidebarPanelStyle: CSSProperties = {
  width: 300,
  minWidth: 300,
  flexShrink: 0,
};

const sidebarCardStyle: CSSProperties = {
  ['--f7-card-bg-color' as string]: APP_COLORS.white,
  ['--f7-card-border-radius' as string]: '16px',
  margin: 0,
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  overflow: 'hidden',
};

const timelineCardStyle: CSSProperties = {
  ['--f7-card-bg-color' as string]: APP_COLORS.white,
  ['--f7-card-border-radius' as string]: '16px',
  margin: 0,
  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
  overflow: 'hidden',
};

const timelineScrollStyle: CSSProperties = {
  padding: '8px 0',
  maxHeight: 'calc(100vh - 220px)',
  minHeight: 320,
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
};

export default function Calendar() {
  const { hearings } = useApp();
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonthIndex = now.getMonth();
  const currentYear = now.getFullYear();
  const currentWeekday = now.getDay();

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

  const fullDateLabel = `${MONTH_NAMES_FULL[currentMonthIndex]} ${currentDay}, ${currentYear}`;
  const weekdayLabel = WEEKDAY_NAMES[currentWeekday];
  const monthShort = MONTH_NAMES_SHORT[currentMonthIndex];

  return (
    <Page noNavbar noToolbar>
      <Block className="no-margin-top padding-top-half">
        <AgendaHeader
          day={currentDay}
          monthShort={monthShort}
          fullDateLabel={fullDateLabel}
          weekdayLabel={weekdayLabel}
        />

        <div style={layoutStyle}>
          {/* Left panel - Timeline */}
          <div style={timelinePanelStyle}>
            <Card style={timelineCardStyle}>
              <CardContent style={timelineScrollStyle}>
                <AgendaTimeline todayHearings={todayHearings} />
              </CardContent>
            </Card>
          </div>

          {/* Right panel - Mini Calendar + Event Detail */}
          <div style={sidebarPanelStyle}>
            <Card style={sidebarCardStyle}>
              <AgendaMiniCalendar />
              <AgendaEventDetail />
            </Card>
          </div>
        </div>
      </Block>
    </Page>
  );
}
