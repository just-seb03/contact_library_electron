import { useEffect, useState, type FormEvent } from 'react';
import { Button, Icon } from 'framework7-react';
import type { Client } from '../../clients/types';
import type { Payment } from '../types';
import { APP_COLORS } from '../../../core/theme/style';
import {
  PAYMENT_ACTION_BUTTON_STYLE,
  PAYMENT_CONTROL_STYLE,
  PAYMENT_FIELD_STYLE,
  PAYMENT_LABEL_STYLE,
  PAYMENT_MODAL_FOOTER_STYLE,
} from '../styles';
import {
  formatPaymentDate,
  getTodayInputValue,
  toDateInputValue,
} from '../utils/paymentFormat';

interface PaymentFormProps {
  clients: Client[];
  payment: Payment | null;
  onClose: () => void;
  onRegister: (payment: Omit<Payment, 'id'>) => void;
  onUpdate?: (payment: Payment, data: Omit<Payment, 'id' | 'client' | 'clientId'>) => void;
}

export function PaymentForm({
  clients,
  payment,
  onClose,
  onRegister,
  onUpdate,
}: PaymentFormProps) {
  const [clientId, setClientId] = useState('');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayInputValue);
  const [status, setStatus] = useState<Payment['status']>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setClientId(payment?.clientId ? String(payment.clientId) : clients[0] ? String(clients[0].id) : '');
    setConcept(payment?.concept ?? '');
    setAmount(payment ? String(payment.amount) : '');
    setDate(payment ? toDateInputValue(payment.date) : getTodayInputValue());
    setStatus(payment?.status ?? 'pending');
    setErrorMessage('');
  }, [clients, payment]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = clients.find((item) => String(item.id) === clientId);
    const numericAmount = Number(amount);

    if (!client) {
      setErrorMessage('Selecciona un cliente para registrar el pago.');
      return;
    }
    if (!concept.trim()) {
      setErrorMessage('Ingresa el concepto del pago.');
      return;
    }
    if (!Number.isSafeInteger(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Ingresa un monto entero mayor a cero.');
      return;
    }
    if (!date) {
      setErrorMessage('Selecciona la fecha del pago.');
      return;
    }

    const data = {
      concept: concept.trim(),
      amount: numericAmount,
      date: formatPaymentDate(date),
      status,
    };
    if (payment && onUpdate) {
      onUpdate(payment, data);
    } else {
      onRegister({ client: client.name, clientId: client.id, ...data });
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'min(640px, calc(100vh - 40px))',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '22px 24px 14px', flexShrink: 0, borderBottom: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))' }}>
        <h2 style={{ margin: 0, color: 'var(--macos-text, #1c1c1e)', fontSize: 21, fontWeight: 700 }}>
          {payment ? 'Editar pago' : 'Registrar pago'}
        </h2>
        <p style={{ margin: '6px 0 0', color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 13 }}>
          {payment ? 'Actualiza los datos de esta transacción.' : 'Agrega una nueva transacción sin modificar los pagos existentes.'}
        </p>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 24px 20px', backgroundColor: 'var(--macos-modal-bg, #ffffff)' }}>
        {!payment && (
          <div style={PAYMENT_FIELD_STYLE}>
            <label htmlFor="payment-client" style={PAYMENT_LABEL_STYLE}>Cliente</label>
            <select
              id="payment-client"
              required
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              style={PAYMENT_CONTROL_STYLE}
            >
              <option value="" disabled>Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={PAYMENT_FIELD_STYLE}>
          <label htmlFor="payment-concept" style={PAYMENT_LABEL_STYLE}>Concepto</label>
          <input
            id="payment-concept"
            required
            maxLength={120}
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="Ej.: Asesoría jurídica"
            style={PAYMENT_CONTROL_STYLE}
          />
        </div>

        <div style={PAYMENT_FIELD_STYLE}>
          <label htmlFor="payment-amount" style={PAYMENT_LABEL_STYLE}>Monto (CLP)</label>
          <input
            id="payment-amount"
            required
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Ej.: 150000"
            style={PAYMENT_CONTROL_STYLE}
          />
        </div>

        <div style={PAYMENT_FIELD_STYLE}>
          <label htmlFor="payment-date" style={PAYMENT_LABEL_STYLE}>Fecha</label>
          <input
            id="payment-date"
            required
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            style={PAYMENT_CONTROL_STYLE}
          />
        </div>

        <div style={{ ...PAYMENT_FIELD_STYLE, marginBottom: 0 }}>
          <label htmlFor="payment-status" style={PAYMENT_LABEL_STYLE}>Estado</label>
          <select
            id="payment-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Payment['status'])}
            style={PAYMENT_CONTROL_STYLE}
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Cobrado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>

        {errorMessage && (
          <p role="alert" style={{ color: APP_COLORS.danger, fontSize: 13, margin: '14px 0 0' }}>
            {errorMessage}
          </p>
        )}
      </div>

      <div style={PAYMENT_MODAL_FOOTER_STYLE}>
        <Button
          type="button"
          onClick={onClose}
          style={{
            ...PAYMENT_ACTION_BUTTON_STYLE,
            border: '1px solid var(--macos-card-border, #d1d1d6)',
            backgroundColor: 'var(--macos-input-bg, #ffffff)',
            color: 'var(--macos-text, #1c1c1e)',
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          fill
          disabled={clients.length === 0}
          style={{
            ...PAYMENT_ACTION_BUTTON_STYLE,
            backgroundColor: APP_COLORS.primary,
            color: APP_COLORS.white,
            fontWeight: 600,
            padding: '0 18px',
            boxShadow: '0 2px 6px rgba(0, 122, 255, 0.35)',
          }}
        >
          <Icon f7={payment ? 'checkmark' : 'plus'} size="14px" className="margin-right-half" />
          {payment ? 'Guardar cambios' : 'Guardar pago'}
        </Button>
      </div>
    </form>
  );
}
