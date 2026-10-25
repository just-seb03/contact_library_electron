import type { CSSProperties } from 'react';
import {
  APP_SHADOWS,
  APP_SPACING,
} from '../../core/theme/style';

export const PAYMENT_SURFACE_STYLE: CSSProperties = {
  backgroundColor: 'var(--macos-card-bg, #ffffff)',
  color: 'var(--macos-text, #1c1c1e)',
  border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))',
  borderRadius: APP_SPACING.itemRadius,
  boxShadow: APP_SHADOWS.section,
};

export const PAYMENT_CONTROL_STYLE: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: 40,
  padding: '9px 12px',
  border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.15))',
  borderRadius: APP_SPACING.controlRadius,
  backgroundColor: 'var(--macos-input-bg, #ffffff)',
  color: 'var(--macos-text, #1c1c1e)',
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
