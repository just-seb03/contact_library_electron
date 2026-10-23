import { useMemo } from 'react';
import { useApp } from '../../../core/context/useApp';
import type { AppTab, HearingEvent } from '../../../core/context/types';
import { navigateToTab } from '../../../navigation/navigation';

function getTimeInMinutes(time: string): number {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return 0;

  const rawHours = Number(match[1]);
  let hours = match[3] ? rawHours % 12 : rawHours;
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === 'PM') hours += 12;

  return hours * 60 + minutes;
}

function compareHearings(first: HearingEvent, second: HearingEvent): number {
  const firstDate = new Date(first.year, first.monthIndex, first.day).getTime();
  const secondDate = new Date(second.year, second.monthIndex, second.day).getTime();
  return firstDate - secondDate || getTimeInMinutes(first.timeStr) - getTimeInMinutes(second.timeStr);
}

export function useHomeData() {
  const { hearings, setActiveTab, setSelectedClientId } = useApp();

  const now = useMemo(() => new Date(), []);
  const currentHour = now.getHours();

  // Saludo según la hora del día
  const greeting = useMemo(() => {
    if (currentHour < 12) return 'Buenos días';
    if (currentHour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, [currentHour]);

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);
  }, [now]);

  // Encuentra la reunión / audiencia más próxima en el tiempo (o la más reciente)
  const nextMeeting = useMemo(() => {
    if (!hearings || hearings.length === 0) return null;

    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sorted = [...hearings].sort(compareHearings);

    // Priorizar reuniones de hoy o próximas futuras
    const upcoming = sorted.find((h) => {
      const hDate = new Date(h.year, h.monthIndex, h.day).getTime();
      return hDate >= todayStart;
    });

    // Si no hay futuras, retornar la última registrada
    return upcoming ?? sorted[sorted.length - 1];
  }, [hearings, now]);

  const openClient = (clientId: number) => {
    setSelectedClientId(clientId);
    setActiveTab('cliente');
    navigateToTab('cliente');
  };

  const showTab = (tab: AppTab) => {
    setActiveTab(tab);
    navigateToTab(tab);
  };

  return {
    lawyerName: 'Abogado/a',
    greeting,
    todayLabel,
    nextMeeting,
    openClient,
    showTab,
  };
}
