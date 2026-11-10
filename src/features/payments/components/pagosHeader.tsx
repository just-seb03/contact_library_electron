import { Button, Icon } from 'framework7-react';
import { APP_COLORS } from '../../../core/theme/style';

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
      gap: '16px',
      padding: '4px 0 18px',
      borderBottom: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))',
    }}
  >
    <div>
      <h1 className="no-margin font-weight-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--macos-text, #1c1c1e)' }}>
      Pagos
      </h1>
      <p style={{ margin: '5px 0 0', color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 13 }}>
        Control y seguimiento de tus transacciones
      </p>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
      <Button
        fill
        onClick={onRegisterPayment}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          borderRadius: '9px',
          padding: '0 14px',
          backgroundColor: APP_COLORS.primary,
          boxShadow: '0 1px 3px rgba(0, 122, 255, 0.22)',
        }}
      >
        <Icon f7="plus" size="15px" />
        Registrar Pago
      </Button>
    </div>
  </header>
);
