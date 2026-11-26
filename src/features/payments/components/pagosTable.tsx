import { useEffect, useRef, type FC, type CSSProperties } from 'react';
import type { Payment } from '../types';
import { formatCLP } from '../../../core/utils/format';
import { PaymentActionsMenu } from './PaymentActionsMenu';

interface TableProps {
  payments: Payment[];
  /** Pago a destacar y desplazar a la vista (p. ej. al abrirlo desde una notificación). */
  highlightedPaymentId?: string | null;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

const STATUS_LABELS: Record<Payment['status'], string> = {
  completed: 'Cobrado',
  pending: 'Pendiente',
  overdue: 'Vencido',
};

function formatPaymentDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

const rowCardStyle = (isHighlighted: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '15px 20px',
  borderRadius: 14,
  backgroundColor: isHighlighted
    ? 'var(--macos-active-bg, rgba(255, 255, 255, 0.1))'
    : 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.14)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  userSelect: 'text',
  WebkitUserSelect: 'text',
  transition: 'background-color 0.25s ease',
});

export const PaymentsTable: FC<TableProps> = ({
  payments,
  highlightedPaymentId,
  onEdit,
  onDelete,
}) => {
  const highlightedRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (highlightedPaymentId) {
      highlightedRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedPaymentId]);

  if (payments.length === 0) {
    return (
      <div
        style={{
          padding: '44px 16px',
          textAlign: 'center',
          color: 'var(--macos-text-secondary, #8e8e93)',
          fontSize: 13.5,
        }}
      >
        No hay pagos que coincidan
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {payments.map((payment) => {
        const isHighlighted = payment.id === highlightedPaymentId;
        return (
          <div
            key={payment.id}
            ref={isHighlighted ? highlightedRowRef : undefined}
            aria-current={isHighlighted ? 'true' : undefined}
            style={rowCardStyle(isHighlighted)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: 1 }}>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 450,
                  color: 'var(--macos-text, #ececef)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {payment.client}
              </span>
              <span
                style={{
                  fontSize: 12.5,
                  color: 'var(--macos-text-secondary, #8e8e93)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {payment.concept} · {formatPaymentDate(payment.date)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 550,
                    color: 'var(--macos-text, #ececef)',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatCLP(payment.amount)}
                </span>
                <span
                  style={{
                    fontSize: 11.5,
                    fontStyle: 'italic',
                    color: 'var(--macos-text-secondary, #8e8e93)',
                  }}
                >
                  {STATUS_LABELS[payment.status] ?? payment.status}
                </span>
              </div>

              <PaymentActionsMenu
                onEdit={() => onEdit(payment)}
                onDelete={() => onDelete(payment)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
