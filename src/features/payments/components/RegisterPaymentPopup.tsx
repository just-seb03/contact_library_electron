import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
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

export function RegisterPaymentPopup({
  opened,
  clients,
  payment = null,
  onClose,
  onRegister,
  onUpdate,
}: RegisterPaymentPopupProps) {
  const [isVisible, setIsVisible] = useState(opened);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPayment = useRef<Payment | null>(payment);
  if (opened) lastPayment.current = payment;
  const viewPayment = opened ? payment : lastPayment.current;

  useEffect(() => {
    if (opened) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsClosing(false);
      setIsVisible(true);
    } else if (isVisible && !isClosing) {
      setIsClosing(true);
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimerRef.current = null;
      }, CLOSE_ANIMATION_MS);
    }
  }, [opened, isVisible, isClosing]);

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

  if (!isVisible) return null;

  return createPortal(
    <div
      className={isClosing ? 'glass-pay-backdrop-out' : 'glass-pay-backdrop-in'}
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
        @keyframes glassPayModalIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glassPayModalOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.97); }
        }
        @keyframes glassPayBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes glassPayBackdropOut { from { opacity: 1; } to { opacity: 0; } }
        .glass-pay-backdrop-in { animation: glassPayBackdropIn 0.2s ease forwards; }
        .glass-pay-backdrop-out { animation: glassPayBackdropOut 0.19s ease forwards; pointer-events: none; }
        .glass-pay-modal-in { animation: glassPayModalIn 0.24s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass-pay-modal-out { animation: glassPayModalOut 0.19s cubic-bezier(0.4, 0, 1, 1) forwards; }
      `}</style>
      <div
        style={contentStyle}
        className={isClosing ? 'glass-pay-modal-out' : 'glass-pay-modal-in'}
        onClick={(e) => e.stopPropagation()}
      >
        <PaymentForm
          clients={clients}
          payment={viewPayment}
          onClose={requestClose}
          onRegister={onRegister}
          onUpdate={onUpdate}
        />
      </div>
    </div>,
    document.body
  );
}
