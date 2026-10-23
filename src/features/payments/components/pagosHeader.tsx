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
      paddingBottom: '16px',
      borderBottom: '1px solid rgba(60, 60, 67, 0.16)',
    }}
  >
    <h1 className="no-margin font-weight-bold" style={{ fontSize: '26px', color: '#1c1c1e' }}>
      Pagos
    </h1>
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
      <Button
        fill
        onClick={onRegisterPayment}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          borderRadius: '7px',
          padding: '0 14px',
          backgroundColor: APP_COLORS.primary,
          boxShadow: '0 1px 3px rgba(35, 83, 137, 0.18)',
        }}
      >
        <Icon f7="plus" size="15px" />
        Registrar Pago
      </Button>
    </div>
  </header>
);
