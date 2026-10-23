import type { FC, CSSProperties } from 'react';
import { APP_COLORS } from '../../../core/theme/style';

const containerStyle: CSSProperties = {
  padding: '16px 12px',
  borderTop: '1px solid rgba(0,0,0,0.06)',
};

const titleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: APP_COLORS.black,
  marginBottom: 12,
};

const emptyTextStyle: CSSProperties = {
  fontSize: 13,
  color: APP_COLORS.neutral,
  textAlign: 'center',
  padding: '24px 0',
};

export const AgendaEventDetail: FC = () => (
  <div style={containerStyle}>
    <div style={titleStyle}>Detalle del evento</div>
    <div style={emptyTextStyle}>
      Selecciona un evento para ver sus detalles
    </div>
  </div>
);
