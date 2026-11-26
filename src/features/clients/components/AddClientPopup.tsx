import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from 'framework7-react';
import type { Client } from '../types';
import { triggerSlideMode } from '../../../core/slide/slideCache';

interface AddClientPopupProps {
  opened: boolean;
  clients: Client[];
  client?: Client | null;
  onClose: () => void;
  onAdd: (client: Omit<Client, 'id'>) => void;
  onUpdate: (id: number, data: Partial<Client>) => void;
}

const CLOSE_ANIMATION_MS = 190;

const contentStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: 480,
  maxHeight: 'min(620px, calc(100vh - 40px))',
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

function generateExpediente(clients: Client[]): string {
  const year = new Date().getFullYear();
  const nextNumber = clients.reduce((highest, item) => {
    const match = item.caso?.expediente.match(/(\d+)(?!.*\d)/);
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0) + 1;
  return `EXP-${year}-${String(nextNumber).padStart(4, '0')}`;
}

export function AddClientPopup({
  opened,
  clients,
  client = null,
  onClose,
  onAdd,
  onUpdate,
}: AddClientPopupProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [caseType, setCaseType] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'phone' | 'email' | 'caseType', string>>>({});
  const [isVisible, setIsVisible] = useState(opened);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOpenedRef = useRef(opened);

  useEffect(() => {
    const wasOpened = prevOpenedRef.current;
    prevOpenedRef.current = opened;

    if (opened && !wasOpened) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsClosing(false);
      setIsVisible(true);
      setName(client?.name ?? '');
      setPhone(client?.phone ?? '');
      setEmail(client?.email ?? '');
      setCaseType(client?.caso?.materia ?? '');
      setFieldErrors({});
    } else if (!opened && wasOpened && isVisible) {
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimerRef.current = null;
      }, CLOSE_ANIMATION_MS);
    }
  }, [opened, client, isVisible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      closeTimerRef.current = null;
      onClose();
    }, CLOSE_ANIMATION_MS);
  }, [isClosing, onClose]);

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
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedCaseType = caseType.trim();

    const nextErrors: Partial<Record<'name' | 'phone' | 'email' | 'caseType', string>> = {};
    if (!trimmedName) nextErrors.name = 'Ingresa el nombre del cliente.';
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'El formato del correo no es válido.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});

    if (client) {
      onUpdate(client.id, {
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail || undefined,
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
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
        status: 'activo',
        ...(trimmedCaseType
          ? {
              caso: {
                expediente: generateExpediente(clients),
                juzgado: 'Por asignar',
                materia: trimmedCaseType,
                estado: 'Caso registrado',
              },
            }
          : {}),
      });
    }
    requestClose();
  };

  if (!isVisible) return null;

  return createPortal(
    <div
      className={isClosing ? 'glass-modal-backdrop-out' : 'glass-modal-backdrop-in'}
      onClick={requestClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'rgba(14, 14, 18, 0.42)',
        backdropFilter: 'blur(18px) saturate(140%)',
        WebkitBackdropFilter: 'blur(18px) saturate(140%)',
      }}
    >
      <style>{`
        @keyframes glassModalIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glassModalOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.97); }
        }
        @keyframes glassBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glassBackdropOut { from { opacity: 1; } to { opacity: 0; } }
        .glass-modal-backdrop-in { animation: glassBackdropIn 0.2s ease forwards; }
        .glass-modal-backdrop-out { animation: glassBackdropOut 0.19s ease forwards; pointer-events: none; }
        .glass-modal-in { animation: glassModalIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass-modal-out { animation: glassModalOut 0.19s cubic-bezier(0.4, 0, 1, 1) forwards; }
      `}</style>
      <div
        style={contentStyle}
        className={isClosing ? 'glass-modal-out' : 'glass-modal-in'}
        onClick={(e) => e.stopPropagation()}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'min(620px, calc(100vh - 40px))', minHeight: 0, overflow: 'hidden' }}
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
              {client ? 'Editar cliente' : 'Nuevo cliente'}
            </h2>
            <button
              type="button"
              onClick={requestClose}
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
            <div style={fieldStyle}>
              <label htmlFor="new-client-name" style={labelStyle}>Nombre</label>
              <input
                id="new-client-name"
                maxLength={120}
                value={name}
                onChange={(event) => {
                  const val = event.target.value;
                  setName(val);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  if (!client && val.trim().toLowerCase() === 'kagurabachi') {
                    triggerSlideMode();
                    requestClose();
                  }
                }}
                placeholder="Nombre del cliente"
                style={{
                  ...controlStyle,
                  borderColor: fieldErrors.name ? 'rgba(255, 69, 58, 0.6)' : undefined,
                }}
              />
              {fieldErrors.name && (
                <span role="alert" style={{ color: '#ff6961', fontSize: 11.5 }}>{fieldErrors.name}</span>
              )}
            </div>

            <div style={fieldStyle}>
              <label htmlFor="new-client-phone" style={labelStyle}>Teléfono</label>
              <input
                id="new-client-phone"
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="Teléfono de contacto"
                style={{
                  ...controlStyle,
                  borderColor: fieldErrors.phone ? 'rgba(255, 69, 58, 0.6)' : undefined,
                }}
              />
              {fieldErrors.phone && (
                <span role="alert" style={{ color: '#ff6961', fontSize: 11.5 }}>{fieldErrors.phone}</span>
              )}
            </div>

            <div style={fieldStyle}>
              <label htmlFor="new-client-email" style={labelStyle}>Correo</label>
              <input
                id="new-client-email"
                type="email"
                maxLength={254}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="correo@ejemplo.cl"
                style={{
                  ...controlStyle,
                  borderColor: fieldErrors.email ? 'rgba(255, 69, 58, 0.6)' : undefined,
                }}
              />
              {fieldErrors.email && (
                <span role="alert" style={{ color: '#ff6961', fontSize: 11.5 }}>{fieldErrors.email}</span>
              )}
            </div>

            <div style={{ ...fieldStyle, marginBottom: 0 }}>
              <label htmlFor="new-client-case-type" style={labelStyle}>Tipo de caso</label>
              <input
                id="new-client-case-type"
                maxLength={120}
                value={caseType}
                onChange={(event) => {
                  setCaseType(event.target.value);
                  if (fieldErrors.caseType) setFieldErrors((prev) => ({ ...prev, caseType: undefined }));
                }}
                placeholder="Ej.: Asesoría jurídica"
                style={{
                  ...controlStyle,
                  borderColor: fieldErrors.caseType ? 'rgba(255, 69, 58, 0.6)' : undefined,
                }}
              />
              {fieldErrors.caseType && (
                <span role="alert" style={{ color: '#ff6961', fontSize: 11.5 }}>{fieldErrors.caseType}</span>
              )}
            </div>
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
              onClick={requestClose}
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
                cursor: 'pointer',
              }}
            >
              {client ? 'Guardar cambios' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
