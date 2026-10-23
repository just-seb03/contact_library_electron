import type { FC, CSSProperties } from 'react';
import { Block, Button, Icon } from 'framework7-react';
import { APP_COLORS } from '../../../core/theme/style';

interface AgendaHeaderProps {
  day: number;
  monthShort: string;
  fullDateLabel: string;
  weekdayLabel: string;
}

const badgeContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: APP_COLORS.white,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  flexShrink: 0,
};

const badgeMonthStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: APP_COLORS.danger,
  lineHeight: 1,
  letterSpacing: 0.5,
};

const badgeDayStyle: CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: APP_COLORS.black,
  lineHeight: 1.1,
};

const headerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
};

const dateTextContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const fullDateStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: APP_COLORS.black,
  lineHeight: 1.2,
};

const weekdayStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: APP_COLORS.neutral,
  lineHeight: 1.4,
};

const addButtonStyle: CSSProperties = {
  ['--f7-button-bg-color' as string]: APP_COLORS.black,
  ['--f7-button-text-color' as string]: APP_COLORS.white,
  ['--f7-button-hover-bg-color' as string]: '#333',
  ['--f7-button-pressed-bg-color' as string]: '#222',
  borderRadius: 20,
  fontWeight: 600,
  fontSize: 13,
  paddingLeft: 16,
  paddingRight: 20,
  height: 36,
};

export const AgendaHeader: FC<AgendaHeaderProps> = ({
  day,
  monthShort,
  fullDateLabel,
  weekdayLabel,
}) => (
  <Block className="no-margin-top no-margin-bottom padding-top-half padding-bottom-half">
    <div style={headerRowStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={badgeContainerStyle}>
          <span style={badgeMonthStyle}>{monthShort}</span>
          <span style={badgeDayStyle}>{day}</span>
        </div>
        <div style={dateTextContainerStyle}>
          <span style={fullDateStyle}>{fullDateLabel}</span>
          <span style={weekdayStyle}>{weekdayLabel}</span>
        </div>
      </div>
      <Button fill round style={addButtonStyle}>
        <Icon f7="plus" size="14px" style={{ marginRight: 4 }} />
        Añadir evento
      </Button>
    </div>
  </Block>
);
