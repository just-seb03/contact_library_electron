import type { CSSProperties } from 'react';
import {
  APP_SHADOWS,
  APP_SPACING,
} from '../../core/theme/style';

export const DASHBOARD_PAGE_STYLE: CSSProperties = {
  minHeight: '100%',
  padding: '24px clamp(18px, 4vw, 40px) 32px',
  boxSizing: 'border-box',
  backgroundColor: 'var(--macos-canvas-bg, #f5f5f7)',
};

export const DASHBOARD_WIDGET_STYLE: CSSProperties = {
  backgroundColor: 'var(--macos-card-bg, rgba(255, 255, 255, 0.85))',
  backdropFilter: 'blur(24px) saturate(150%)',
  WebkitBackdropFilter: 'blur(24px) saturate(150%)',
  border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))',
  borderRadius: APP_SPACING.sectionRadius,
  boxShadow: APP_SHADOWS.glass,
};

export const DASHBOARD_INNER_SURFACE_STYLE: CSSProperties = {
  backgroundColor: 'var(--macos-input-bg, rgba(255, 255, 255, 0.58))',
  border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.06))',
  borderRadius: APP_SPACING.itemRadius,
};

export const DASHBOARD_LABEL_STYLE: CSSProperties = {
  color: 'var(--macos-text-secondary, #8e8e93)',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
};
