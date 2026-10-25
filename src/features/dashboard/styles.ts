import type { CSSProperties } from 'react';
import {
  APP_COLORS,
  APP_SHADOWS,
  APP_SPACING,
  MACOS_THEME,
} from '../../core/theme/style';

export const DASHBOARD_PAGE_STYLE: CSSProperties = {
  minHeight: '100%',
  padding: '24px clamp(18px, 4vw, 40px) 32px',
  boxSizing: 'border-box',
  background: `linear-gradient(145deg, ${APP_COLORS.background} 0%, #eef3fa 100%)`,
};

export const DASHBOARD_WIDGET_STYLE: CSSProperties = {
  backgroundColor: MACOS_THEME.sidebarGlass,
  backdropFilter: 'blur(24px) saturate(150%)',
  WebkitBackdropFilter: 'blur(24px) saturate(150%)',
  border: `1px solid ${MACOS_THEME.hairlineBorder}`,
  borderRadius: APP_SPACING.sectionRadius,
  boxShadow: APP_SHADOWS.glass,
};

export const DASHBOARD_INNER_SURFACE_STYLE: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.58)',
  border: `1px solid ${APP_COLORS.glassBorder}`,
  borderRadius: APP_SPACING.itemRadius,
};

export const DASHBOARD_LABEL_STYLE: CSSProperties = {
  color: APP_COLORS.secondaryText,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
};
