import { Block, Page } from 'framework7-react';

import { useDashboard } from '../hooks/useDashboard';
import { DashboardHeader } from '../components/dashboardHeader';
import { DashboardHero } from '../components/dashboardHero';
import { DashboardStats } from '../components/dashboardStats';
import { DashboardSchedule } from '../components/dashboardSchedule';

export default function Dashboard() {
  const {
    clientsCount,
    todayLabel,
    todayHearings,
    upcomingHearings,
    paymentsToReviewCount,
    amountToReview,
    openClient,
    showTab,
  } = useDashboard();

  return (
    <Page noNavbar noToolbar>
      <Block className="no-margin-top padding-top-half">
        <DashboardHeader todayLabel={todayLabel} />

        <DashboardHero
          todayHearingsCount={todayHearings.length}
          paymentsToReviewCount={paymentsToReviewCount}
        />

        <DashboardStats
          clientsCount={clientsCount}
          todayHearingsCount={todayHearings.length}
          amountToReview={amountToReview}
        />

        <DashboardSchedule
          todayHearings={todayHearings}
          upcomingHearings={upcomingHearings}
          openClient={openClient}
          showTab={showTab}
        />
      </Block>
    </Page>
  );
}