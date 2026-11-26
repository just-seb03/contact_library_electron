import { useCallback, useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import { Icon } from 'framework7-react';

interface PaymentActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

const CLOSE_ANIMATION_MS = 150;

export const PaymentActionsMenu: FC<PaymentActionsMenuProps> = ({ onEdit, onDelete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMenu = useCallback(() => {
    if (!isVisible || isClosing) return;
    setIsClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, [isVisible, isClosing]);

  const toggleMenu = () => {
    if (isVisible && !isClosing) {
      closeMenu();
    } else {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setIsClosing(false);
      setIsVisible(true);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, closeMenu]);

  const menuStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    zIndex: 30,
    minWidth: 132,
    padding: 4,
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
    borderRadius: 12,
    backgroundColor: 'var(--macos-modal-bg, #242428)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
    transformOrigin: 'top right',
  };

  const actionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: 'var(--macos-text, #ececef)',
    fontSize: 12.5,
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.12s ease',
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', flexShrink: 0 }}>
      <style>{`
        @keyframes payMenuOpen {
          from { opacity: 0; transform: translateY(-6px) scale(0.94); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes payMenuClose {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-5px) scale(0.94); }
        }
        .pay-menu-in { animation: payMenuOpen 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .pay-menu-out { animation: payMenuClose 0.15s cubic-bezier(0.4, 0, 1, 1) forwards; pointer-events: none; }
        .pay-menu-item:hover { background-color: var(--macos-hover-bg, rgba(255, 255, 255, 0.08)) !important; }
      `}</style>
      <button
        type="button"
        aria-label="Acciones del pago"
        aria-expanded={isVisible && !isClosing}
        onClick={toggleMenu}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          border: 'none',
          borderRadius: 999,
          backgroundColor: isVisible && !isClosing ? 'var(--macos-active-bg, rgba(255, 255, 255, 0.1))' : 'transparent',
          color: 'var(--macos-text-secondary, #a4a4ab)',
          cursor: 'pointer',
          transition: 'background-color 0.12s ease',
        }}
      >
        <Icon f7="ellipsis_vertical" size="16px" />
      </button>
      {isVisible && (
        <div
          style={menuStyle}
          className={isClosing ? 'pay-menu-out' : 'pay-menu-in'}
        >
          <button
            type="button"
            className="pay-menu-item"
            style={actionStyle}
            onClick={() => {
              closeMenu();
              onEdit();
            }}
          >
            <Icon f7="pencil" size="13px" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            className="pay-menu-item"
            style={{ ...actionStyle, color: '#ff6961' }}
            onClick={() => {
              closeMenu();
              onDelete();
            }}
          >
            <Icon f7="trash" size="13px" />
            <span>Eliminar</span>
          </button>
        </div>
      )}
    </div>
  );
};
