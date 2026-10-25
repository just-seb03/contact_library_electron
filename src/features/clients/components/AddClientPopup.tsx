import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Button, Icon, Popup } from 'framework7-react';
import { APP_COLORS } from '../../../core/theme/style';
import type { Client } from '../types';

interface AddClientPopupProps {
  opened: boolean;
  clients: Client[];
  client?: Client | null;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id'>) => void;
  onUpdate: (id: number, data: Partial<Client>) => void;
}

const popupStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  maxWidth: 'none',
  maxHeight: 'none',
  position: 'fixed',
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  overflow: 'hidden',
  zIndex: 10500,
};

const popupCenterStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  boxSizing: 'border-box',
};

const contentStyle: CSSProperties = {
  position: 'relative',
  margin: 'auto',
  width: '100%',
  maxWidth: 500,
  maxHeight: 'min(640px, calc(100vh - 40px))',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 14,
  backgroundColor: APP_COLORS.white,
  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(0, 0, 0, 0.08)',
  boxSizing: 'border-box',
};

const controlStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: '9px 11px',
  border: `1px solid ${APP_COLORS.border}`,
  borderRadius: 8,
  backgroundColor: APP_COLORS.white,
  color: APP_COLORS.black,
  fontSize: 14,
  fontFamily: 'inherit',
};

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

function generateExpediente(clients: Client[]): string {
  const year = new Date().getFullYear();
  const prefix = `EXP-${year}-`;
  const highestNumber = clients.reduce((highest, client) => {
    const expediente = client.caso?.expediente;
    if (!expediente?.startsWith(prefix)) return highest;
    const number = Number(expediente.slice(prefix.length));
    return Number.isSafeInteger(number) ? Math.max(highest, number) : highest;
  }, 0);

  return `${prefix}${String(highestNumber + 1).padStart(3, '0')}`;
}

export function AddClientPopup({
  opened,
  clients,
  client,
  onClose,
  onAdd,
  onUpdate,
}: AddClientPopupProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [caseType, setCaseType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [contentMounted, setContentMounted] = useState(opened);

  useEffect(() => {
    if (opened) setContentMounted(true);
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    setName(client?.name ?? '');
    setPhone(client?.phone ?? '');
    setEmail(client?.email ?? '');
    setCaseType(client?.caso?.materia ?? '');
    setErrorMessage('');
  }, [opened, client]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedCaseType = caseType.trim();

    if (
      !trimmedName
      || !trimmedPhone
      || !trimmedEmail
      || (!client && !trimmedCaseType)
      || (client?.caso && !trimmedCaseType)
    ) {
      setErrorMessage('Completa todos los campos antes de guardar el cliente.');
      return;
    }

    if (client) {
      onUpdate(client.id, {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        ...(trimmedCaseType
          ? {
              caso: client.caso
                ? { ...client.caso, materia: trimmedCaseType }
                : {
                    expediente: generateExpediente(clients),
                    juzgado: 'Por asignar',
                    materia: trimmedCaseType,
                    estado: 'Caso registrado',
                  },
            }
          : {}),
      });
    } else {
      onAdd({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        status: 'activo',
        caso: {
          expediente: generateExpediente(clients),
          juzgado: 'Por asignar',
          materia: trimmedCaseType,
          estado: 'Caso registrado',
        },
      });
    }
    onClose();
  };

  return (
    <Popup
      opened={opened}
      className="popup-tablet-fullscreen"
      style={popupStyle}
      closeByBackdropClick={false}
      onPopupClosed={() => setContentMounted(false)}
    >
      {contentMounted && (
      <div style={popupCenterStyle}>
      <div style={contentStyle}>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'min(640px, calc(100vh - 40px))', minHeight: 0, overflow: 'hidden' }}
        >
          <div style={{ padding: '20px 24px 12px', flexShrink: 0 }}>
            <h2 style={{ margin: 0, color: APP_COLORS.sidebarText, fontSize: 21, fontWeight: 700 }}>
              {client ? 'Editar cliente' : 'Añadir cliente'}
            </h2>
            <p style={{ margin: '6px 0 0', color: APP_COLORS.neutral, fontSize: 13 }}>
              {client
                ? 'Actualiza los datos que quieras cambiar.'
                : 'Completa todos los datos para agregarlo a la lista.'}
            </p>
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 24px 16px' }}>
            <div style={fieldStyle}>
              <label htmlFor="new-client-name" style={labelStyle}>Nombre</label>
              <input
                id="new-client-name"
                required
                maxLength={120}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nombre del cliente"
                style={controlStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="new-client-phone" style={labelStyle}>Teléfono</label>
              <input
                id="new-client-phone"
                required
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Teléfono de contacto"
                style={controlStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="new-client-email" style={labelStyle}>Correo</label>
              <input
                id="new-client-email"
                required
                type="email"
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@ejemplo.cl"
                style={controlStyle}
              />
            </div>

            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label htmlFor="new-client-case-type" style={labelStyle}>Tipo de caso</label>
              <input
                id="new-client-case-type"
                required={!client || Boolean(client.caso)}
                maxLength={120}
                value={caseType}
                onChange={(event) => setCaseType(event.target.value)}
                placeholder="Ej.: Asesoría jurídica"
                style={controlStyle}
              />
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
              alignItems: 'center',
              gap: 10,
              padding: '14px 24px',
              borderTop: `1px solid ${APP_COLORS.borderSubtle}`,
              backgroundColor: APP_COLORS.white,
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              flexShrink: 0,
            }}
          >
            <Button
              type="button"
              onClick={onClose}
              style={{
                borderRadius: 7,
                border: '1px solid #d1d1d6',
                color: '#1c1c1e',
                fontSize: 13,
                fontWeight: 500,
                padding: '0 16px',
                height: 34,
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              fill
              style={{
                backgroundColor: '#007aff',
                borderRadius: 7,
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 600,
                padding: '0 18px',
                height: 34,
                boxShadow: '0 2px 6px rgba(0, 122, 255, 0.35)',
              }}
            >
              <Icon f7={client ? 'checkmark_alt' : 'plus'} size="14px" className="margin-right-half" />
              {client ? 'Guardar cambios' : 'Guardar cliente'}
            </Button>
          </div>
        </form>
      </div>
      </div>
      )}
    </Popup>
  );
}
