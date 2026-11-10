import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Popup } from 'framework7-react';
import type { Client } from '../../clients/types';
import type { Payment } from '../types';
import { PaymentForm } from './PaymentForm';

interface RegisterPaymentPopupProps {
  opened: boolean;
  clients: Client[];
  payment?: Payment | null;
  onClose: () => void;
  onRegister: (payment: Omit<Payment, 'id'>) => void;
  onUpdate?: (payment: Payment, data: Omit<Payment, 'id' | 'client' | 'clientId'>) => void;
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
  backgroundColor: 'rgba(28, 28, 30, 0.32)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
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
  maxWidth: 520,
  maxHeight: 'min(640px, calc(100vh - 40px))',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 16,
  backgroundColor: 'var(--macos-modal-bg, #ffffff)',
  color: 'var(--macos-text, #1c1c1e)',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--macos-card-border, rgba(0, 0, 0, 0.08))',
  boxSizing: 'border-box',
};

// Framework7 anima los popups con las clases `modal-in` / `modal-out` (no
// `popup-in` / `popup-out`) y con `transform`. Aquí se anula el desplazamiento
// y se anima solo la opacidad. Se usa la clase `popup-tablet-fullscreen` en el
// selector para ganar en especificidad a las reglas de F7.
//
// Con `prefers-reduced-motion` la duración es 1ms (no `none`): F7 espera el
// evento `transitionend` para disparar `onPopupClosed`, y sin transición ese
// evento nunca llegaría y el popup se quedaría "abierto" a medias.
const FADE_CSS = `
  .popup.popup-tablet-fullscreen.f7-fade {
    transform: none !important;
    opacity: 0;
    transition-property: opacity;
    transition-duration: 220ms;
    transition-timing-function: ease;
  }

  .popup.popup-tablet-fullscreen.f7-fade.modal-in {
    opacity: 1;
  }

  .popup.popup-tablet-fullscreen.f7-fade.modal-out {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .popup.popup-tablet-fullscreen.f7-fade {
      transition-duration: 1ms;
    }
  }
`;

export function RegisterPaymentPopup({
  opened,
  clients,
  payment = null,
  onClose,
  onRegister,
  onUpdate,
}: RegisterPaymentPopupProps) {
  const [contentMounted, setContentMounted] = useState(opened);
  const lastPayment = useRef<Payment | null>(payment);
  if (opened) lastPayment.current = payment;
  const viewPayment = opened ? payment : lastPayment.current;

  useEffect(() => {
    if (opened) setContentMounted(true);
  }, [opened]);

  return (
    <Popup
      opened={opened}
      className="popup-tablet-fullscreen f7-fade"
      style={popupStyle}
      // El popup ya trae su propio fondo difuminado; el backdrop de F7 se
      // oscurecería encima y con otra duración de animación.
      backdrop={false}
      closeByBackdropClick={false}
      onPopupClosed={() => setContentMounted(false)}
    >
      <style>{FADE_CSS}</style>
      {contentMounted && (
        <div style={popupCenterStyle}>
          <div style={contentStyle}>
            <PaymentForm
              clients={clients}
              payment={viewPayment}
              onClose={onClose}
              onRegister={onRegister}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      )}
    </Popup>
  );
}
