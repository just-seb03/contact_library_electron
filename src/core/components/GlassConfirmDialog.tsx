import { useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { createPortal } from 'react-dom';

interface GlassConfirmDialogProps {
  opened: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const CLOSE_ANIMATION_MS = 180;

export const GlassConfirmDialog: FC<GlassConfirmDialogProps> = ({
  opened,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  destructive = true,
  onConfirm,
  onCancel,
}) => {
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
    } else if (!opened && wasOpened && isVisible) {
      setIsClosing(true);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      closeTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimerRef.current = null;
      }, CLOSE_ANIMATION_MS);
    }
  }, [opened, isVisible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 12000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(14, 14, 18, 0.44)',
    backdropFilter: 'blur(18px) saturate(140%)',
    WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  };

  const cardStyle: CSSProperties = {
    width: '100%',
    maxWidth: 380,
    borderRadius: 18,
    backgroundColor: 'var(--macos-modal-bg, #242428)',
    backdropFilter: 'blur(28px) saturate(160%)',
    WebkitBackdropFilter: 'blur(28px) saturate(160%)',
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.48)',
    padding: '20px 22px 18px',
    color: 'var(--macos-text, #ececef)',
    boxSizing: 'border-box',
  };

  return createPortal(
    <div
      style={backdropStyle}
      className={isClosing ? 'glass-dlg-backdrop-out' : 'glass-dlg-backdrop-in'}
      onClick={onCancel}
    >
      <style>{`
        @keyframes glassDlgBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glassDlgBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes glassDlgCardIn {
          from { opacity: 0; transform: translateY(10px) scale(0.965); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glassDlgCardOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(8px) scale(0.965); }
        }
        .glass-dlg-backdrop-in { animation: glassDlgBackdropIn 0.18s ease forwards; }
        .glass-dlg-backdrop-out { animation: glassDlgBackdropOut 0.18s ease forwards; pointer-events: none; }
        .glass-dlg-card-in { animation: glassDlgCardIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass-dlg-card-out { animation: glassDlgCardOut 0.18s cubic-bezier(0.4, 0, 1, 1) forwards; }
      `}</style>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="glass-confirm-title"
        aria-describedby="glass-confirm-desc"
        style={cardStyle}
        className={isClosing ? 'glass-dlg-card-out' : 'glass-dlg-card-in'}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="glass-confirm-title"
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--macos-text, #ececef)',
          }}
        >
          {title}
        </h3>
        <p
          id="glass-confirm-desc"
          style={{
            margin: '8px 0 18px',
            fontSize: 13,
            lineHeight: 1.45,
            color: 'var(--macos-text-secondary, #a4a4ab)',
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
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
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              width: 'auto',
              minWidth: 'auto',
              height: 32,
              padding: '0 16px',
              borderRadius: 999,
              border: destructive
                ? '1px solid rgba(255, 69, 58, 0.35)'
                : '1px solid rgba(255, 255, 255, 0.14)',
              backgroundColor: destructive
                ? 'rgba(255, 69, 58, 0.16)'
                : 'var(--macos-text, #ececef)',
              color: destructive
                ? '#ff6961'
                : 'var(--macos-canvas-bg, #18181a)',
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
