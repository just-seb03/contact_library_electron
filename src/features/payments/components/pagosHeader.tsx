import { Icon } from 'framework7-react';

interface PaymentsHeaderProps {
  onRegisterPayment: () => void;
}

export const PaymentsHeader = ({ onRegisterPayment }: PaymentsHeaderProps) => (
  <header
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      padding: '2px 0 4px',
    }}
  >
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--macos-text-secondary, #a4a4ab)',
      }}
    >
      Control de transacciones
    </span>
    <button
      type="button"
      onClick={onRegisterPayment}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        height: 32,
        borderRadius: 999,
        padding: '0 14px',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        backgroundColor: 'var(--macos-text, #ececef)',
        color: 'var(--macos-canvas-bg, #18181a)',
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
        transition: 'all 0.12s ease',
      }}
    >
      <Icon f7="plus" size="14px" />
      <span>Registrar Pago</span>
    </button>
  </header>
);
