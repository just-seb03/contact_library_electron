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

export function useDashboard() {
  const { clients, hearings, payments, setActiveTab, setSelectedClientId } = useApp();

  const showTab = (tab: AppTab) => {
    navigateToTab(tab);
    setActiveTab(tab);
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const upcomingLimit = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).getTime();
  const todayLabel = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  const { todayHearings, upcomingHearings } = useMemo(() => {
    const todaysHearings: HearingEvent[] = [];
    const upcoming: HearingEvent[] = [];

    hearings.forEach((hearing) => {
      const hearingDate = new Date(hearing.year, hearing.monthIndex, hearing.day).getTime();
      if (hearingDate === today) todaysHearings.push(hearing);
      else if (hearingDate > today && hearingDate <= upcomingLimit) upcoming.push(hearing);
    });

    return {
      todayHearings: todaysHearings.sort(compareHearings),
      upcomingHearings: upcoming.sort(compareHearings),
    };
  }, [hearings, today, upcomingLimit]);

  const paymentsToReview = payments.filter(
    (payment) => payment.status === 'pending' || payment.status === 'overdue'
  );
  const amountToReview = paymentsToReview.reduce((total, payment) => total + payment.amount, 0);

  const openClient = (clientId: number) => {
    setSelectedClientId(clientId);
    showTab('cliente');
  };

  return {
    clientsCount: clients.length,
    todayLabel,
    todayHearings,
    upcomingHearings,
    paymentsToReviewCount: paymentsToReview.length,
    amountToReview,
    openClient,
    showTab,
  };
}