import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Icon } from 'framework7-react';
import type { Client } from '../../clients/types';
import type { Payment } from '../types';
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

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 14,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 550,
  color: 'var(--macos-text-secondary, #a4a4ab)',
};

const controlStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  height: 38,
  padding: '0 12px',
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.2))',
  borderRadius: 10,
  backgroundColor: 'var(--macos-input-bg, rgba(128, 128, 136, 0.1))',
  color: 'var(--macos-text, #ececef)',
  fontSize: 13.5,
  outline: 'none',
};

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
        maxHeight: 'min(620px, calc(100vh - 40px))',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '18px 24px 12px',
          borderBottom: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.12))',
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0, color: 'var(--macos-text, #ececef)', fontSize: 17, fontWeight: 600 }}>
          {payment ? 'Editar pago' : 'Registrar pago'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            width: 28,
            height: 28,
            border: 'none',
            background: 'transparent',
            color: 'var(--macos-text-secondary, #a4a4ab)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon f7="xmark" size="15px" />
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 24px 12px' }}>
        {!payment && (
          <div style={fieldStyle}>
            <label htmlFor="payment-client" style={labelStyle}>Cliente</label>
            <select
              id="payment-client"
              required
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              style={controlStyle}
            >
              <option value="" disabled>Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={fieldStyle}>
          <label htmlFor="payment-concept" style={labelStyle}>Concepto</label>
          <input
            id="payment-concept"
            required
            maxLength={120}
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="Ej.: Asesoría jurídica"
            style={controlStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="payment-amount" style={labelStyle}>Monto (CLP)</label>
          <input
            id="payment-amount"
            required
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Ej.: 150000"
            style={controlStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="payment-date" style={labelStyle}>Fecha</label>
          <input
            id="payment-date"
            required
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            style={controlStyle}
          />
        </div>

        <div style={{ ...fieldStyle, marginBottom: 0 }}>
          <label htmlFor="payment-status" style={labelStyle}>Estado</label>
          <select
            id="payment-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as Payment['status'])}
            style={controlStyle}
          >
            <option value="pending">Pendiente</option>
            <option value="completed">Cobrado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>

        {errorMessage && (
          <p role="alert" style={{ color: '#ff6961', fontSize: 12.5, margin: '12px 0 0' }}>
            {errorMessage}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 10,
          padding: '14px 24px',
          borderTop: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.12))',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 'auto',
            minWidth: 'auto',
            height: 32,
            padding: '0 14px',
            borderRadius: 999,
            border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
            backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.06))',
            color: 'var(--macos-text, #ececef)',
            fontSize: 12.5,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={clients.length === 0}
          style={{
            width: 'auto',
            minWidth: 'auto',
            height: 32,
            padding: '0 16px',
            borderRadius: 999,
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backgroundColor: 'var(--macos-text, #ececef)',
            color: 'var(--macos-canvas-bg, #18181a)',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: clients.length === 0 ? 'not-allowed' : 'pointer',
            opacity: clients.length === 0 ? 0.5 : 1,
          }}
        >
          {payment ? 'Guardar cambios' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
