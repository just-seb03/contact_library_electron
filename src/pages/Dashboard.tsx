import { Block, Page } from 'framework7-react';

import { useDashboard } from '../control/Dashboard/useDashboard';
import { DashboardHeader } from '../components/Dashboard/dashboardHeader';
import { DashboardHero } from '../components/Dashboard/dashboardHero';
import { DashboardStats } from '../components/Dashboard/dashboardStats';
import { DashboardSchedule } from '../components/Dashboard/dashboardSchedule';

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