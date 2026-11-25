import type { CSSProperties } from 'react';
import { APP_SPACING } from '../../core/theme/style';

export const PAYMENT_SURFACE_STYLE: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  color: 'var(--macos-text, #ececef)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
};

export const PAYMENT_CONTROL_STYLE: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: '9px 12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: 'var(--macos-text, #ececef)',
  fontSize: 14,
  fontFamily: 'inherit',
};

export const PAYMENT_FIELD_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
  marginBottom: 14,
};

export const PAYMENT_LABEL_STYLE: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--macos-text, #1c1c1e)',
};

export const PAYMENT_MODAL_FOOTER_STYLE: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 10,
  padding: '14px 24px',
  borderTop: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))',
  backgroundColor: 'var(--macos-modal-bg, #ffffff)',
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  flexShrink: 0,
};

export const PAYMENT_ACTION_BUTTON_STYLE: CSSProperties = {
  borderRadius: APP_SPACING.controlRadius,
  fontSize: 13,
  fontWeight: 500,
  padding: '0 16px',
  height: 34,
};
