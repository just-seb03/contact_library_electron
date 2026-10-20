import type { FC } from 'react';
import { Button, List, ListItem } from 'framework7-react';
import type { Payment } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface TableProps {
  payments: Payment[];
  onStatusChange?: (id: string, status: 'completed' | 'pending' | 'overdue') => void;
}

export const PaymentsTable: FC<TableProps> = ({ payments, onStatusChange }) => {
  const nextStatusMap: Record<Payment['status'], Payment['status']> = {
    completed: 'pending',
    pending: 'overdue',
    overdue: 'completed',
  };
  const statusLabels: Record<Payment['status'], string> = {
    completed: 'Completado',
    pending: 'Pendiente',
    overdue: 'Vencido',
  };

  return (
    <List mediaList strong inset>
      {payments.length === 0 && <ListItem title="No hay pagos para mostrar" />}
      {payments.map((payment) => (
        <ListItem
          key={payment.id}
          title={payment.client}
          subtitle={payment.concept}
          text={`${payment.date} · ${formatCLP(payment.amount)}`}
        >
          <Button
            slot="after"
            small
            color={payment.status === 'completed' ? 'green' : payment.status === 'pending' ? 'orange' : 'red'}
            onClick={() => onStatusChange?.(payment.id, nextStatusMap[payment.status])}
          >
            {statusLabels[payment.status]}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
