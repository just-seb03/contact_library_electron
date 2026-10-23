import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Button, Icon, Popup } from 'framework7-react';
import type { Client } from '../../clients/types';
import type { Payment } from '../types';
import { APP_COLORS } from '../../../core/theme/style';

interface RegisterPaymentPopupProps {
  opened: boolean;
  clients: Client[];
  onClose: () => void;
  onRegister: (payment: Omit<Payment, 'id'>) => void;
}

const popupStyle: CSSProperties = {
  width: '100%',
  height: 'calc(100% - 32px)',
  overflow: 'hidden',
  backgroundColor: 'transparent',
};

const contentStyle: CSSProperties = {
  position: 'absolute',
  top: 16,
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'min(500px, calc(100vw - 32px))',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 16,
  backgroundColor: APP_COLORS.white,
  boxShadow: '0 12px 40px rgba(0,0,0,0.24)',
  boxSizing: 'border-box',
};

const controlStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: '9px 11px',
  border: '1px solid #d1d1d6',
  borderRadius: 8,
  backgroundColor: APP_COLORS.white,
  color: APP_COLORS.black,
  fontSize: 14,
  fontFamily: 'inherit',
};

function getTodayInputValue(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function formatPaymentDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}

export function RegisterPaymentPopup({
  opened,
  clients,
  onClose,
  onRegister,
}: RegisterPaymentPopupProps) {
  const [clientId, setClientId] = useState('');
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayInputValue);
  const [status, setStatus] = useState<Payment['status']>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!opened) return;
    setClientId(clients[0] ? String(clients[0].id) : '');
    setConcept('');
    setAmount('');
    setDate(getTodayInputValue());
    setStatus('pending');
    setErrorMessage('');
  }, [opened, clients]);

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

    onRegister({
      client: client.name,
      concept: concept.trim(),
      amount: numericAmount,
      date: formatPaymentDate(date),
      status,
    });
    onClose();
  };

  return (
    <Popup opened={opened} style={popupStyle} closeByBackdropClick={false}>
      <div style={contentStyle}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}
        >
          <div style={{ padding: '20px 24px 12px' }}>
            <h2 style={{ margin: 0, color: APP_COLORS.sidebarText, fontSize: 21, fontWeight: 700 }}>
              Registrar pago
            </h2>
            <p style={{ margin: '6px 0 0', color: APP_COLORS.neutral, fontSize: 13 }}>
              Agrega una nueva transacción sin modificar los pagos existentes.
            </p>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 24px 16px' }}>
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
                <option value="completed">Pagado</option>
                <option value="overdue">Vencido</option>
              </select>
            </div>

            {errorMessage && (
              <p role="alert" style={{ color: APP_COLORS.danger, fontSize: 13, margin: '14px 0 0' }}>
                {errorMessage}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              padding: '12px 24px 20px',
              borderTop: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <Button type="button" onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              fill
              disabled={clients.length === 0}
              style={{ backgroundColor: APP_COLORS.primary, borderRadius: 7 }}
            >
              <Icon f7="plus" size="14px" className="margin-right-half" />
              Guardar pago
            </Button>
          </div>
        </form>
      </div>
    </Popup>
  );
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
  marginBottom: 16,
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: APP_COLORS.sidebarText,
};
