import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Button, f7, Icon, Input, Popup } from 'framework7-react';
import type { Client } from '../../clients/types';
import { APP_COLORS } from '../../../core/theme/style';
import { CALENDAR_EVENT_COLORS } from '../data/eventColors';
import type { CalendarEvent, CalendarEventColorId } from '../types';
import type { HearingEvent } from '../../../core/context/types';

interface CreateEventPopupProps {
  opened: boolean;
  selectedDate: Date;
  clients: Client[];
  existingEvents: CalendarEvent[];
  existingHearings: HearingEvent[];
  editingEvent: CalendarEvent | null;
  onClose: () => void;
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (event: CalendarEvent) => void;
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
  width: 'min(560px, calc(100vw - 32px))',
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
  height: '100%',
  minHeight: 0,
  boxSizing: 'border-box',
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
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
  padding: '12px 24px 20px',
  borderTop: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: APP_COLORS.white,
};

interface TimePickerFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

function getTimePickerValues(value: string, uses12HourClock: boolean): string[] {
  const [hours, minutes] = value.split(':').map(Number);
  if (!uses12HourClock) return [String(hours), String(minutes).padStart(2, '0')];

  const period = hours < 12 ? 'AM' : 'PM';
  return [String(hours % 12 || 12), String(minutes).padStart(2, '0'), period];
}

function getTimeFromPickerValues(values: unknown, uses12HourClock: boolean): string | null {
  if (!Array.isArray(values) || values.length < 2) return null;

  let hours = Number(values[0]);
  const minutes = Number(values[1]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  if (uses12HourClock) {
    const period = values[2];
    if (hours < 1 || hours > 12 || (period !== 'AM' && period !== 'PM')) return null;
    hours %= 12;
    if (period === 'PM') hours += 12;
  } else if (hours < 0 || hours > 23) {
    return null;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatTimeForDisplay(value: string, locale: string | undefined): string {
  const [hours, minutes] = value.split(':').map(Number);
  const time = new Date(2000, 0, 1, hours, minutes);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(time);
}

function TimePickerField({ id, value, onChange }: TimePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<ReturnType<typeof f7.picker.create> | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  onChangeRef.current = onChange;
  valueRef.current = value;

  const locale = document.documentElement.lang || undefined;
  const uses12HourClock = new Intl.DateTimeFormat(locale, { hour: 'numeric' })
    .resolvedOptions().hour12 ?? false;

  useEffect(() => {
    if (!inputRef.current) return;

    const hours = uses12HourClock
      ? Array.from({ length: 12 }, (_, index) => String(index + 1))
      : Array.from({ length: 24 }, (_, hour) => String(hour));
    const minutes = Array.from({ length: 60 }, (_, minute) => String(minute).padStart(2, '0'));
    const cols = [
      { values: hours },
      { divider: true, content: ':' },
      { values: minutes },
      ...(uses12HourClock ? [{ values: ['AM', 'PM'] }] : []),
    ];

    const picker = f7.picker.create({
      inputEl: inputRef.current,
      openIn: 'popover',
      toolbar: true,
      toolbarCloseText: 'Seleccionar hora',
      value: getTimePickerValues(valueRef.current, uses12HourClock),
      cols,
      on: {
        change: (_picker, values) => {
          const time = getTimeFromPickerValues(values, uses12HourClock);
          if (time) onChangeRef.current(time);
        },
      },
    });
    pickerRef.current = picker;

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
  }, [uses12HourClock]);

  useEffect(() => {
    pickerRef.current?.setValue(getTimePickerValues(value, uses12HourClock));
  }, [value, uses12HourClock]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      readOnly
      required
      value={formatTimeForDisplay(value, locale)}
      aria-haspopup="dialog"
      style={controlStyle}
    />
  );
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateInputValue(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function hearingTimeToMinutes(value: string): number | null {
  const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(match[2]);
}

export function CreateEventPopup({
  opened,
  selectedDate,
  clients,
  existingEvents,
  existingHearings,
  editingEvent,
  onClose,
  onCreate,
  onUpdate,
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
  const initialValues = useRef('');

  const getFormValues = () => ({
    title,
    date,
    startTime,
    endTime,
    colorId,
    alarmMinutes,
    clientId,
    details,
  });

  useEffect(() => {
    if (!opened) return;
    const values = editingEvent
      ? {
          title: editingEvent.title,
          date: editingEvent.date,
          startTime: editingEvent.startTime,
          endTime: editingEvent.endTime,
          colorId: editingEvent.colorId,
          alarmMinutes: editingEvent.alarmMinutes,
          clientId: editingEvent.clientId === null ? '' : String(editingEvent.clientId),
          details: editingEvent.details,
        }
      : {
          title: '',
          date: toDateInputValue(selectedDate),
          startTime: '09:00',
          endTime: '10:00',
          colorId: 'lavender' as CalendarEventColorId,
          alarmMinutes: 10,
          clientId: '',
          details: '',
        };
    setTitle(values.title);
    setDate(values.date);
    setStartTime(values.startTime);
    setEndTime(values.endTime);
    setColorId(values.colorId);
    setAlarmMinutes(values.alarmMinutes);
    setClientId(values.clientId);
    setDetails(values.details);
    setErrorMessage('');
    initialValues.current = JSON.stringify(values);
  }, [opened, selectedDate, editingEvent]);

  const requestClose = () => {
    if (JSON.stringify(getFormValues()) === initialValues.current) {
      onClose();
      return;
    }
    f7.dialog.confirm(
      'Se perderán los cambios que no hayas guardado.',
      '¿Descartar cambios?',
      onClose
    );
  };

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

    const conflict = existingEvents.find((item) => (
      item.id !== editingEvent?.id
      && item.date === date
      && startTime < item.endTime
      && endTime > item.startTime
    ));
    const eventStart = Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5));
    const eventEnd = Number(endTime.slice(0, 2)) * 60 + Number(endTime.slice(3, 5));
    const hearingConflict = existingHearings.find((hearing) => {
      const hearingDate = `${hearing.year}-${String(hearing.monthIndex + 1).padStart(2, '0')}-${String(hearing.day).padStart(2, '0')}`;
      if (hearingDate !== date) return false;
      const hearingStart = hearingTimeToMinutes(hearing.timeStr);
      return hearingStart !== null
        && eventStart < hearingStart + 60
        && eventEnd > hearingStart;
    });
    if (conflict || hearingConflict) {
      const conflictTitle = conflict?.title ?? hearingConflict?.clientName;
      setErrorMessage(`El horario se superpone con «${conflictTitle}».`);
      return;
    }

    const updatedFields = {
      title: title.trim(),
      date,
      startTime,
      endTime,
      colorId,
      alarmMinutes,
      clientId: clientId ? Number(clientId) : null,
      details: details.trim(),
    };
    if (editingEvent) {
      onUpdate({ ...editingEvent, ...updatedFields });
    } else {
      onCreate(updatedFields);
    }
    onClose();
  };

  return (
    <Popup
      opened={opened}
      style={popupStyle}
      closeByBackdropClick={false}
      closeOnEscape={false}
    >
      <div style={contentStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>{editingEvent ? 'Editar evento' : 'Nuevo evento'}</h2>
            <Button
              type="button"
              aria-label="Cerrar"
              onClick={requestClose}
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
            <Input
              inputId="calendar-event-date"
              type="datepicker"
              required
              value={date ? [fromDateInputValue(date)] : []}
              placeholder="Seleccionar día"
              calendarParams={{
                dateFormat: 'dd M, yyyy',
                locale: 'es-CL',
                openIn: 'popover',
              }}
              onCalendarChange={(value?: Date[]) => {
                if (value?.[0]) setDate(toDateInputValue(value[0]));
              }}
              style={controlStyle}
            />
          </div>

          <div style={{ ...fieldStyle, ...timeFieldsStyle }}>
            <div style={fieldStyle}>
              <label htmlFor="calendar-event-start" style={labelStyle}>Desde</label>
              <TimePickerField
                id="calendar-event-start"
                value={startTime}
                onChange={setStartTime}
              />
            </div>
            <div style={fieldStyle}>
              <label htmlFor="calendar-event-end" style={labelStyle}>Hasta</label>
              <TimePickerField
                id="calendar-event-end"
                value={endTime}
                onChange={setEndTime}
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
            <Button type="button" onClick={requestClose}>Cancelar</Button>
            <Button type="submit" fill round style={{ backgroundColor: APP_COLORS.black }}>
              {editingEvent ? 'Guardar cambios' : 'Guardar evento'}
            </Button>
          </div>
        </form>
      </div>
    </Popup>
  );
}
