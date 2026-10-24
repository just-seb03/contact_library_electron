import type { FC } from 'react';
import { Icon } from 'framework7-react';
import type { PaymentStatus } from '../status';
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../status';

interface PaymentStatusIndicatorProps {
  status: PaymentStatus;
}

export const PaymentStatusIndicator: FC<PaymentStatusIndicatorProps> = ({ status }) => {
  const colors = PAYMENT_STATUS_COLORS[status];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: '999px',
        padding: '4px 9px',
        backgroundColor: colors.background,
        color: colors.color,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon f7="circle_fill" size="7px" style={{ color: colors.color }} />
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  );
};
