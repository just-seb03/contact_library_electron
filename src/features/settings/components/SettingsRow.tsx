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
    padding: '11px 16px',
    minHeight: 52,
    cursor: onClick ? 'pointer' : 'default',
    boxSizing: 'border-box',
    userSelect: 'none',
    transition: 'background-color 0.1s ease',
  };

  const iconContainerStyle: CSSProperties = {
    width: 28,
    height: 28,
    minWidth: 28,
    borderRadius: 7,
    backgroundColor: iconBgColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
    boxShadow: `0 2px 5px ${iconBgColor}40`,
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
    fontSize: 13.5,
    fontWeight: 550,
    color: darkMode ? '#f2f2f7' : '#1c1c1e',
    lineHeight: 1.3,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 11.5,
    color: darkMode ? 'rgba(235, 235, 245, 0.45)' : '#8e8e93',
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
    <div
      style={rowStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = darkMode
            ? 'rgba(255, 255, 255, 0.04)'
            : 'rgba(0, 0, 0, 0.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div style={iconContainerStyle}>
        <Icon f7={icon} size="15px" style={{ color: iconColor }} />
      </div>

      <div style={textContainerStyle}>
        <span style={titleStyle}>{title}</span>
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </div>

      {control && <div style={controlContainerStyle}>{control}</div>}

      {/* Separador interior estilo Apple HIG (no cruza bajo el icono) */}
      {!isLast && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 58,
            height: 1,
            backgroundColor: darkMode
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.05)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default SettingsRow;
