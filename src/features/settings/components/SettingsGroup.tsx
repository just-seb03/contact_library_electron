import React, { type CSSProperties, type ReactNode } from 'react';

export interface SettingsGroupProps {
  title?: string;
  footerText?: string;
  children: ReactNode;
  darkMode?: boolean;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  footerText,
  children,
  darkMode = false,
}) => {
  const containerStyle: CSSProperties = {
    marginBottom: 24,
  };

  const headerStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: darkMode ? 'rgba(235, 235, 245, 0.45)' : 'rgba(60, 60, 67, 0.55)',
    marginBottom: 8,
    paddingLeft: 14,
    userSelect: 'none',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: darkMode ? 'rgba(38, 38, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
    overflow: 'hidden',
    boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  const footerStyle: CSSProperties = {
    fontSize: 11.5,
    color: darkMode ? 'rgba(235, 235, 245, 0.4)' : '#8e8e93',
    marginTop: 6,
    paddingLeft: 14,
    lineHeight: 1.4,
  };

  return (
    <div style={containerStyle}>
      {title && <div style={headerStyle}>{title}</div>}
      <div style={cardStyle}>{children}</div>
      {footerText && <div style={footerStyle}>{footerText}</div>}
    </div>
  );
};

export default SettingsGroup;
