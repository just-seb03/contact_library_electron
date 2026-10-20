import { Card, CardContent, List, ListItem } from 'framework7-react';
import { formatCLP } from '../../utils/format';

interface DashboardStatsProps {
  clientsCount: number;
  todayHearingsCount: number;
  amountToReview: number;
}

export function DashboardStats({ clientsCount, todayHearingsCount, amountToReview }: DashboardStatsProps) {
  return (
    <section aria-label="Indicadores">
      <Card>
        <CardContent>
          <List>
            <ListItem title="Clientes" after={String(clientsCount)} />
            <ListItem title="Audiencias hoy" after={String(todayHearingsCount)} />
            <ListItem title="Por cobrar" after={formatCLP(amountToReview)} />
          </List>
        </CardContent>
      </Card>
    </section>
  );
}
