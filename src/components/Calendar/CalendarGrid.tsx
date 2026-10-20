import type { FC } from 'react';
import { Button, Card, CardContent, Icon } from 'framework7-react';
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
  const { hearings } = useApp();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDayOfWeek + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-7">
          {weekdays.map((weekday) => (
            <div key={weekday} className="text-align-center">
              <strong>{weekday}</strong>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const hasHearing = day !== null && hearings.some(
              (hearing) => hearing.day === day
                && hearing.monthIndex === currentMonthIndex
                && hearing.year === currentYear
            );

            return (
              <div key={day ?? `empty-${index}`} className="text-align-center">
                {day !== null && (
                  <Button
                    small
                    fill={day === currentDay}
                    color={day === currentDay ? 'blue' : undefined}
                    onClick={() => onSelectDay(day)}
                    aria-label={`Seleccionar día ${day}`}
                  >
                    {day}
                    {hasHearing && <Icon f7="circle_fill" size="6px" />}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
