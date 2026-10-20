import { useState } from 'react';
import { Page, Block } from 'framework7-react';

import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { CalendarGrid } from '../components/Calendar/CalendarGrid';
import { DayDetailsCard } from '../components/Calendar/DayDetailsCard';
import { UpcomingHearings } from '../components/Calendar/UpcomingHearings';
import { DayScheduleOverlay } from '../components/Calendar/DayScheduleOverlay';

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentDate = new Date();
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  return (
    <Page noNavbar noToolbar>
      <CalendarHeader
        month={currentMonth}
        year={currentYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Block className="no-margin-top">
        <CalendarGrid
          currentYear={currentYear}
          currentMonthIndex={currentDate.getMonth()}
          currentDay={currentDay}
          onSelectDay={setSelectedDay}
        />

        <DayDetailsCard
          month={currentMonth}
          day={currentDay}
        />

        <UpcomingHearings />
      </Block>

      {selectedDay !== null && (
        <DayScheduleOverlay 
          date={selectedDay}
          monthIndex={currentDate.getMonth()}
          month={currentMonth}
          year={currentYear}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </Page>
  );
}
