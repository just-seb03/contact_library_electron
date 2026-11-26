import React, { type CSSProperties, type ReactNode } from 'react';
import { Icon } from 'framework7-react';

export interface SettingsRowProps {
  icon: string;
  iconBgColor?: string;
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
  iconColor,
  title,
  subtitle,
  control,
  isLast = false,
  onClick,
}) => {
  const rowStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    minHeight: 52,
    cursor: onClick ? 'pointer' : 'default',
    boxSizing: 'border-box',
    userSelect: 'none',
    transition: 'background-color 0.1s ease',
  };

  const iconContainerStyle: CSSProperties = {
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
    color: iconColor ?? 'var(--macos-text-secondary, #a4a4ab)',
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
    color: 'var(--macos-text, #1c1c1e)',
    lineHeight: 1.3,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 11.5,
    color: 'var(--macos-text-secondary, #8e8e93)',
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
          e.currentTarget.style.backgroundColor = 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.02))';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div style={iconContainerStyle}>
        <Icon f7={icon} size="17px" style={{ color: 'currentColor' }} />
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
            backgroundColor: 'var(--macos-divider, rgba(0, 0, 0, 0.05))',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default SettingsRow;
