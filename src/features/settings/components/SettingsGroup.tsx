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
    backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.06))',
    borderRadius: 16,
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
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
