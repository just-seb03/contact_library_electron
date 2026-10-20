import { Card, CardContent, Icon } from 'framework7-react';

interface DashboardHeroProps {
  todayHearingsCount: number;
  paymentsToReviewCount: number;
}

export function DashboardHero({ todayHearingsCount, paymentsToReviewCount }: DashboardHeroProps) {
  return (
    <Card>
      <CardContent>
        <Icon f7="sun_max_fill" />
        <h2>
          {todayHearingsCount === 0
            ? 'Hoy no tienes audiencias programadas'
            : `Tienes ${todayHearingsCount} ${todayHearingsCount === 1 ? 'audiencia' : 'audiencias'} hoy`}
        </h2>
        <p className="text-color-gray">
          {paymentsToReviewCount > 0
            ? `${paymentsToReviewCount} ${paymentsToReviewCount === 1 ? 'cobro pendiente necesita' : 'cobros pendientes necesitan'} tu atención.`
            : 'Todo listo para organizar tu jornada.'}
        </p>
      </CardContent>
    </Card>
  );
}
