import React, { type CSSProperties, type ReactNode } from 'react';
import { Icon } from 'framework7-react';

export interface SettingsRowProps {
  icon: string;
  iconBgColor: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  control?: ReactNode;
  isLast?: boolean;
  darkMode?: boolean;
  onClick?: () => void;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  iconBgColor,
  iconColor = '#FFFFFF',
  title,
  subtitle,
  control,
  isLast = false,
  darkMode = false,
  onClick,
}) => {
  const rowStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    minHeight: 54,
    borderBottom: isLast ? 'none' : (darkMode ? '1px solid #2C2C2E' : '1px solid #F2F2F7'),
    cursor: onClick ? 'pointer' : 'default',
    boxSizing: 'border-box',
  };

  const iconContainerStyle: CSSProperties = {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: 7,
    backgroundColor: iconBgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  };

  const textContainerStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: 12,
  };

  const titleStyle: CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: darkMode ? '#F2F2F7' : '#1C1C1E',
    lineHeight: 1.3,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 1.35,
  };

  const controlContainerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 'auto',
  };

  return (
    <div style={rowStyle} onClick={onClick}>
      <div style={iconContainerStyle}>
        <Icon f7={icon} size="17px" style={{ color: iconColor }} />
      </div>

      <div style={textContainerStyle}>
        <span style={titleStyle}>{title}</span>
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>

      {control && <div style={controlContainerStyle}>{control}</div>}
    </div>
  );
};
