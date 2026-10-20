import { Card, List, ListItem } from 'framework7-react';
import { formatCLP } from '../../../core/utils/format';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  cobrosPendientesCount: number;
  totalTransacciones: number;
}

export const PaymentsStats = ({
  totalIngresos,
  totalPendientes,
  cobrosPendientesCount,
  totalTransacciones,
}: StatsProps) => (
  <Card>
    <List>
      <ListItem title="Ingresos cobrados" after={formatCLP(totalIngresos)} />
      <ListItem title="Por cobrar" after={formatCLP(totalPendientes)} subtitle={`${cobrosPendientesCount} cobros pendientes`} />
      <ListItem title="Total transacciones" after={String(totalTransacciones)} />
    </List>
  </Card>
);
