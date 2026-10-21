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
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#8E8E93',
    marginBottom: 8,
    paddingLeft: 12,
    userSelect: 'none',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: darkMode ? '#1C1C1E' : '#FFFFFF',
    borderRadius: 12,
    border: darkMode ? '1px solid #2C2C2E' : '1px solid #E5E5EA',
    overflow: 'hidden',
    boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
  };

  const footerStyle: CSSProperties = {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 6,
    paddingLeft: 12,
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
