import { useEffect, useRef, type FC } from 'react';
import type { Payment } from '../types';
import { formatCLP } from '../../../core/utils/format';
import { PaymentActionsMenu } from './PaymentActionsMenu';
import { PaymentStatusIndicator } from './PaymentStatusIndicator';
import { PAYMENT_SURFACE_STYLE } from '../styles';

interface TableProps {
  payments: Payment[];
  /** Pago a destacar y desplazar a la vista (p. ej. al abrirlo desde una notificación). */
  highlightedPaymentId?: string | null;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

function formatPaymentDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CL').format(date);
}

export const PaymentsTable: FC<TableProps> = ({ payments, highlightedPaymentId, onEdit, onDelete }) => {
  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (highlightedPaymentId) {
      highlightedRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedPaymentId]);

  const headerCellStyle = {
    padding: '12px 14px',
    color: 'var(--macos-text-secondary, #6e6e73)',
    fontSize: '11px',
    fontWeight: 700,
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
    borderBottom: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))',
  };
  const cellStyle = {
    padding: '14px',
    color: 'var(--macos-text, #1c1c1e)',
    fontSize: '14px',
    borderTop: '1px solid var(--macos-card-border, rgba(60, 60, 67, 0.12))',
    textAlign: 'left' as const,
  };

  return (
    <div
      style={{
        ...PAYMENT_SURFACE_STYLE,
        width: '100%',
        overflowX: 'auto',
      }}
    >
        <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Cliente</th>
            <th style={headerCellStyle}>Concepto</th>
            <th style={headerCellStyle}>Fecha</th>
            <th style={{ ...headerCellStyle, textAlign: 'right' }}>Monto</th>
            <th style={headerCellStyle}>Estado</th>
            <th style={{ ...headerCellStyle, width: 44 }} aria-label="Acciones" />
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ ...cellStyle, padding: '28px 14px', textAlign: 'center', color: '#8e8e93' }}>
                No hay pagos que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            payments.map((payment) => {
              const isHighlighted = payment.id === highlightedPaymentId;
              return (
              <tr
                key={payment.id}
                ref={isHighlighted ? highlightedRowRef : undefined}
                aria-current={isHighlighted ? 'true' : undefined}
                style={{
                  backgroundColor: isHighlighted ? 'var(--macos-accent-tint-active, rgba(0, 122, 255, 0.26))' : undefined,
                  transition: 'background-color 0.6s ease',
                }}
              >
                <td style={{ ...cellStyle, fontWeight: 600 }}>{payment.client}</td>
                <td style={cellStyle}>{payment.concept}</td>
                <td style={{ ...cellStyle, whiteSpace: 'nowrap' }}>{formatPaymentDate(payment.date)}</td>
                <td style={{ ...cellStyle, whiteSpace: 'nowrap', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {formatCLP(payment.amount)}
                </td>
                <td style={cellStyle}>
                  <PaymentStatusIndicator status={payment.status} />
                </td>
                <td style={{ ...cellStyle, width: 44, paddingLeft: 4, paddingRight: 8 }}>
                  <PaymentActionsMenu
                    onEdit={() => onEdit(payment)}
                    onDelete={() => onDelete(payment)}
                  />
                </td>
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
