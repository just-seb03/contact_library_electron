import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from 'framework7-react';
import { GlassConfirmDialog } from '../../../core/components/GlassConfirmDialog';
import type { Client } from '../../clients/types';
import { APP_COLORS } from '../../../core/theme/style';
import { CALENDAR_EVENT_COLORS } from '../data/eventColors';
import type { CalendarEvent, CalendarEventColorId } from '../types';
import type { HearingEvent } from '../../../core/context/types';
import { EventDatePicker, EventTimePicker } from './EventDateTimePickers';

interface CreateEventPopupProps {
  opened: boolean;
  selectedDate: Date;
  initialStartTime?: string;
  initialEndTime?: string;
  clients: Client[];
  existingEvents: CalendarEvent[];
  existingHearings: HearingEvent[];
  editingEvent: CalendarEvent | null;
  onClose: () => void;
  onCreate: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (event: CalendarEvent) => void;
}

const CLOSE_ANIMATION_MS = 190;

const contentStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: 520,
  maxHeight: 'min(660px, calc(100vh - 40px))',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 18,
  backgroundColor: 'var(--macos-modal-bg, #242428)',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  color: 'var(--macos-text, #ececef)',
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
  boxSizing: 'border-box',
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: 'min(660px, calc(100vh - 40px))',
  minHeight: 0,
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexShrink: 0,
  padding: '18px 24px 12px',
  borderBottom: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.12))',
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: 'var(--macos-text, #ececef)',
};

const formBodyStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '14px 24px 12px',
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 14,
};

const labelStyle: CSSProperties = {
  fontSize: 11.5,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--macos-text-secondary, #a4a4ab)',
};

const controlStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: '9px 12px',
  border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
  borderRadius: 10,
  backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.08))',
  color: 'var(--macos-text, #ececef)',
  fontSize: 13.5,
  fontFamily: 'inherit',
  outline: 'none',
};

const timeFieldsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const colorOptionsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: 8,
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 10,
  flexShrink: 0,
  padding: '14px 24px',
  borderTop: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.12))',
  backgroundColor: 'var(--macos-modal-bg, #242428)',
};

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  initialStartTime = '09:00',
  initialEndTime = '10:00',
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
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(opened);
  const [isClosing, setIsClosing] = useState(false);

  const initialValues = useRef('');
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedTime = selectedDate.getTime();

  useEffect(() => {
    if (opened) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsClosing(false);
      setIsVisible(true);
      return;
    }

    setIsVisible((prevVisible) => {
      if (!prevVisible) return false;
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimerRef.current = null;
      }, CLOSE_ANIMATION_MS);
      return true;
    });
  }, [opened]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const getFormValues = useCallback(() => ({
    title,
    date,
    startTime,
    endTime,
    colorId,
    alarmMinutes,
    clientId,
    details,
  }), [title, date, startTime, endTime, colorId, alarmMinutes, clientId, details]);

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
          startTime: initialStartTime,
          endTime: initialEndTime,
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
  }, [opened, selectedTime, editingEvent, selectedDate, initialStartTime, initialEndTime]);

  const animateAndClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [isClosing, onClose]);

  const requestClose = useCallback(() => {
    if (JSON.stringify(getFormValues()) === initialValues.current) {
      animateAndClose();
      return;
    }
    setConfirmDiscardOpen(true);
  }, [animateAndClose, getFormValues]);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, requestClose]);

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
    animateAndClose();
  };

  if (!isVisible) return null;

  const modalNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      className={isClosing ? 'event-backdrop-out' : 'event-backdrop-in'}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.48)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxSizing: 'border-box',
      }}
    >
      <style>{`
        @keyframes eventBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes eventBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes eventCardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes eventCardOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.97); }
        }
        @keyframes pickerReveal {
          from { opacity: 0; transform: translateY(-6px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .event-backdrop-in {
          animation: eventBackdropIn 0.22s ease forwards;
        }
        .event-backdrop-out {
          animation: eventBackdropOut ${CLOSE_ANIMATION_MS}ms ease forwards;
        }
        .event-card-in {
          animation: eventCardIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .event-card-out {
          animation: eventCardOut ${CLOSE_ANIMATION_MS}ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .event-backdrop-in,
          .event-backdrop-out,
          .event-card-in,
          .event-card-out {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        style={contentStyle}
        className={isClosing ? 'event-card-out' : 'event-card-in'}
      >
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={headerStyle}>
            <h2 id="event-modal-title" style={titleStyle}>
              {editingEvent ? 'Editar evento' : 'Nuevo evento'}
            </h2>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={requestClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                padding: 0,
                border: 'none',
                borderRadius: 8,
                backgroundColor: 'transparent',
                color: 'var(--macos-text-secondary, #a4a4ab)',
                cursor: 'pointer',
              }}
            >
              <Icon f7="xmark" size="16px" />
            </button>
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
                      minHeight: 50,
                      padding: 5,
                      borderRadius: 10,
                      backgroundColor: color.background,
                      border: colorId === color.id
                        ? `2px solid ${color.border}`
                        : '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: color.border,
                      }}
                    />
                    <span style={{ fontSize: 11, color: 'var(--macos-text, #ececef)' }}>
                      {color.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={fieldStyle}>
              <label htmlFor="calendar-event-date" style={labelStyle}>Día</label>
              <EventDatePicker
                id="calendar-event-date"
                value={date}
                onChange={setDate}
              />
            </div>

            <div style={{ ...fieldStyle, ...timeFieldsStyle }}>
              <div>
                <label htmlFor="calendar-event-start" style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>
                  Desde
                </label>
                <EventTimePicker
                  id="calendar-event-start"
                  value={startTime}
                  onChange={setStartTime}
                />
              </div>
              <div>
                <label htmlFor="calendar-event-end" style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>
                  Hasta
                </label>
                <EventTimePicker
                  id="calendar-event-end"
                  value={endTime}
                  onChange={setEndTime}
                />
              </div>
            </div>

            <div style={fieldStyle}>
              <label htmlFor="calendar-event-alarm" style={labelStyle}>Aviso previo</label>
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
                rows={3}
                maxLength={1000}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="Añade información útil para este evento"
                style={{ ...controlStyle, resize: 'vertical', minHeight: 76 }}
              />
            </div>

            {errorMessage && (
              <p role="alert" style={{ color: APP_COLORS.danger, fontSize: 12.5, margin: '0 0 8px' }}>
                {errorMessage}
              </p>
            )}
          </div>

          <div style={actionsStyle}>
            <button
              type="button"
              onClick={requestClose}
              style={{
                borderRadius: 999,
                border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
                backgroundColor: 'transparent',
                color: 'var(--macos-text, #ececef)',
                fontSize: 12.5,
                fontWeight: 500,
                padding: '0 16px',
                height: 34,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'var(--macos-active-bg, #323237)',
                border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.28))',
                borderRadius: 999,
                color: 'var(--macos-text, #ececef)',
                fontSize: 12.5,
                fontWeight: 600,
                padding: '0 18px',
                height: 34,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
              }}
            >
              <Icon f7="checkmark" size="13px" />
              <span>{editingEvent ? 'Guardar cambios' : 'Guardar evento'}</span>
            </button>
          </div>
        </form>
      </div>
      <GlassConfirmDialog
        opened={confirmDiscardOpen}
        title="¿Descartar cambios?"
        message="Se perderán los cambios que no hayas guardado."
        confirmLabel="Descartar"
        onCancel={() => setConfirmDiscardOpen(false)}
        onConfirm={() => {
          setConfirmDiscardOpen(false);
          animateAndClose();
        }}
      />
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
}
