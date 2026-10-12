import { Page } from 'framework7-react';

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
    <Page className="liquid-page" style={{ background: 'transparent', overflowX: 'hidden' }}>
      <div
        style={{
          margin: 0,
          padding: '64px 4% 20px',
          color: '#1d2735',
          minHeight: '100%',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'visible',
          flexShrink: 0,
        }}
      >
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
      </div>
    </Page>
  );
}