import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Button, Icon, Popup } from 'framework7-react';
import type { Client } from '../../clients/types';
import { APP_COLORS } from '../../../core/theme/style';
import { CALENDAR_EVENT_COLORS } from '../data/eventColors';
import type { CalendarEvent, CalendarEventColorId } from '../types';

interface CreateEventPopupProps {
  opened: boolean;
  selectedDate: Date;
  clients: Client[];
  onClose: () => void;
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void;
}

const popupStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: 'transparent',
};

const contentStyle: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(560px, calc(100vw - 32px))',
  height: 'min(820px, 90vh)',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 16,
  backgroundColor: APP_COLORS.white,
  boxShadow: '0 12px 40px rgba(0,0,0,0.24)',
  boxSizing: 'border-box',
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexShrink: 0,
  padding: '16px 24px 12px',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 21,
  fontWeight: 700,
  color: APP_COLORS.black,
  flexShrink: 0,
  whiteSpace: 'nowrap',
};

const formBodyStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '8px 24px 12px',
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
  color: APP_COLORS.black,
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

const timeFieldsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const colorOptionsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: 10,
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  flexShrink: 0,
  padding: '12px 24px 20px',
  borderTop: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: APP_COLORS.white,
};

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CreateEventPopup({
  opened,
  selectedDate,
  clients,
  onClose,
  onCreate,
}: CreateEventPopupProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(toDateInputValue(selectedDate));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [colorId, setColorId] = useState<CalendarEventColorId>('lavender');
  const [alarmMinutes, setAlarmMinutes] = useState(10);
  const [clientId, setClientId] = useState('');
  const [details, setDetails] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!opened) return;
    setTitle('');
    setDate(toDateInputValue(selectedDate));
    setStartTime('09:00');
    setEndTime('10:00');
    setColorId('lavender');
    setAlarmMinutes(10);
    setClientId('');
    setDetails('');
    setErrorMessage('');
  }, [opened, selectedDate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Escribe un título para el evento.');
      return;
    }
    if (!date) {
      setErrorMessage('Selecciona el día del evento.');
      return;
    }
    if (endTime <= startTime) {
      setErrorMessage('La hora de término debe ser posterior a la hora de inicio.');
      return;
    }

    onCreate({
      title: title.trim(),
      date,
      startTime,
      endTime,
      colorId,
      alarmMinutes,
      clientId: clientId ? Number(clientId) : null,
      details: details.trim(),
    });
    onClose();
  };

  return (
    <Popup
      opened={opened}
      style={popupStyle}
      closeByBackdropClick
      closeOnEscape
      onPopupClosed={onClose}
    >
      <div style={contentStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>Nuevo evento</h2>
            <Button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              style={{
                color: APP_COLORS.neutral,
                width: 36,
                height: 36,
                minWidth: 36,
                padding: 0,
                margin: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
              }}
            >
              <Icon f7="xmark" />
            </Button>
          </div>

          <div style={formBodyStyle}>
          <div style={fieldStyle}>
            <label htmlFor="calendar-event-title" style={labelStyle}>Título</label>
            <input
              id="calendar-event-title"
              autoFocus
              required
              maxLength={80}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ej.: Reunión con cliente"
              style={controlStyle}
            />
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>Color del evento</span>
            <div style={colorOptionsStyle} role="radiogroup" aria-label="Color del evento">
              {CALENDAR_EVENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  role="radio"
                  aria-checked={colorId === color.id}
                  aria-label={color.label}
                  title={color.label}
                  onClick={() => setColorId(color.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    width: '100%',
                    minWidth: 0,
                    minHeight: 52,
                    padding: 5,
                    borderRadius: 9,
                    backgroundColor: color.background,
                    border: colorId === color.id ? `2px solid ${color.border}` : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      backgroundColor: color.border,
                    }}
                  />
                  <span style={{ fontSize: 11, color: APP_COLORS.black }}>{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="calendar-event-date" style={labelStyle}>Día</label>
            <input
              id="calendar-event-date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
              style={controlStyle}
            />
          </div>

          <div style={{ ...fieldStyle, ...timeFieldsStyle }}>
            <div style={fieldStyle}>
              <label htmlFor="calendar-event-start" style={labelStyle}>Desde</label>
              <input
                id="calendar-event-start"
                type="time"
                required
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                style={controlStyle}
              />
            </div>
            <div style={fieldStyle}>
              <label htmlFor="calendar-event-end" style={labelStyle}>Hasta</label>
              <input
                id="calendar-event-end"
                type="time"
                required
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                style={controlStyle}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="calendar-event-alarm" style={labelStyle}>Aviso previo (no funcional)</label>
            <select
              id="calendar-event-alarm"
              value={alarmMinutes}
              onChange={(event) => setAlarmMinutes(Number(event.target.value))}
              style={controlStyle}
            >
              <option value={0}>Sin aviso</option>
              <option value={5}>5 minutos antes</option>
              <option value={10}>10 minutos antes</option>
              <option value={15}>15 minutos antes</option>
              <option value={30}>30 minutos antes</option>
              <option value={60}>1 hora antes</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="calendar-event-client" style={labelStyle}>Cliente (opcional)</label>
            <select
              id="calendar-event-client"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              style={controlStyle}
            >
              <option value="">Sin cliente asociado</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="calendar-event-details" style={labelStyle}>Detalles (opcional)</label>
            <textarea
              id="calendar-event-details"
              rows={4}
              maxLength={1000}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Añade información útil para este evento"
              style={{ ...controlStyle, resize: 'vertical', minHeight: 88 }}
            />
          </div>

          {errorMessage && (
            <p role="alert" style={{ color: APP_COLORS.danger, fontSize: 13, margin: '0 0 14px' }}>
              {errorMessage}
            </p>
          )}
          </div>

          <div style={actionsStyle}>
            <Button type="button" onClick={onClose}>Cancelar</Button>
            <Button type="submit" fill round style={{ backgroundColor: APP_COLORS.black }}>
              Guardar evento
            </Button>
          </div>
        </form>
      </div>
    </Popup>
  );
}
