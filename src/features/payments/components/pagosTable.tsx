import type { FC } from 'react';
import { Icon } from 'framework7-react';
import type { Payment } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface TableProps {
  payments: Payment[];
}

const STATUS_LABELS: Record<Payment['status'], string> = {
  completed: 'Pagado',
  pending: 'Pendiente',
  overdue: 'Vencido',
};

const STATUS_COLORS: Record<Payment['status'], { background: string; color: string }> = {
  completed: { background: 'rgba(52, 199, 89, 0.14)', color: '#248a3d' },
  pending: { background: 'rgba(255, 149, 0, 0.14)', color: '#a85d00' },
  overdue: { background: 'rgba(255, 59, 48, 0.12)', color: '#c62820' },
};

function formatPaymentDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CL').format(date);
}

export const PaymentsTable: FC<TableProps> = ({ payments }) => {
  const headerCellStyle = {
    padding: '12px 14px',
    color: '#6e6e73',
    fontSize: '11px',
    fontWeight: 700,
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  };
  const cellStyle = {
    padding: '14px',
    color: '#1c1c1e',
    fontSize: '14px',
    borderTop: '1px solid rgba(60, 60, 67, 0.12)',
    textAlign: 'left' as const,
  };

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        border: '1px solid rgba(60, 60, 67, 0.14)',
        borderRadius: '12px',
        backgroundColor: '#fff',
      }}
    >
      <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Cliente</th>
            <th style={headerCellStyle}>Concepto</th>
            <th style={headerCellStyle}>Fecha</th>
            <th style={{ ...headerCellStyle, textAlign: 'right' }}>Monto</th>
            <th style={headerCellStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ ...cellStyle, padding: '28px 14px', textAlign: 'center', color: '#8e8e93' }}>
                No hay pagos que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr key={payment.id}>
                <td style={{ ...cellStyle, fontWeight: 600 }}>{payment.client}</td>
                <td style={cellStyle}>{payment.concept}</td>
                <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>{formatPaymentDate(payment.date)}</td>
                <td style={{ ...cellStyle, whiteSpace: 'nowrap', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {formatCLP(payment.amount)}
                </td>
                <td style={cellStyle}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '999px',
                      padding: '4px 9px',
                      backgroundColor: STATUS_COLORS[payment.status].background,
                      color: STATUS_COLORS[payment.status].color,
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Icon
                      f7="circle_fill"
                      size="7px"
                      style={{ color: STATUS_COLORS[payment.status].color }}
                    />
                    {STATUS_LABELS[payment.status]}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
