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
}) => {
  const containerStyle: CSSProperties = {
    marginBottom: 24,
  };

  const headerStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--macos-text-muted, rgba(60, 60, 67, 0.55))',
    marginBottom: 8,
    paddingLeft: 14,
    userSelect: 'none',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'var(--macos-card-bg, rgba(255, 255, 255, 0.85))',
    borderRadius: 12,
    border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.07))',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  };

  const footerStyle: CSSProperties = {
    fontSize: 11.5,
    color: 'var(--macos-text-secondary, #8e8e93)',
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
