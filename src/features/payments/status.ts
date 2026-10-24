import type { Payment } from './types';

export type PaymentStatus = Payment['status'];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  completed: 'Cobrado',
  pending: 'Pendiente',
  overdue: 'Vencido',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, { background: string; color: string }> = {
  completed: { background: 'rgba(52, 199, 89, 0.14)', color: '#248a3d' },
  pending: { background: 'rgba(255, 149, 0, 0.14)', color: '#a85d00' },
  overdue: { background: 'rgba(255, 59, 48, 0.12)', color: '#c62820' },
};

export const PAYMENT_STATUS_ORDER: PaymentStatus[] = ['completed', 'pending', 'overdue'];
