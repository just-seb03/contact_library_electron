import type { FC, CSSProperties } from 'react';
import { MAC_ACCENT_COLORS, type AppleAccentColor } from '../data/settingsData';
import { APP_THEMES, THEME_LIST, type AppThemeId } from '../../../core/theme/themes';

interface SettingsAppearanceSelectorProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  themeId: AppThemeId;
  onChangeTheme: (themeId: AppThemeId) => void;
  accentColor: AppleAccentColor;
  onChangeAccentColor: (color: AppleAccentColor) => void;
}

export const SettingsAppearanceSelector: FC<SettingsAppearanceSelectorProps> = ({
  darkMode,
  onToggleDarkMode,
  themeId,
  onChangeTheme,
  accentColor,
  onChangeAccentColor,
}) => {
  const activeTheme = APP_THEMES[themeId] ?? APP_THEMES.default;
  const lightPreview = activeTheme.light.preview;
  const darkPreview = activeTheme.dark.preview;
  const containerStyle: CSSProperties = {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    userSelect: 'none',
  };

  const previewCardWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    flex: 1,
  };

  const previewWindowStyle = (isDarkPreview: boolean, selected: boolean): CSSProperties => ({
    width: '100%',
    height: 72,
    borderRadius: 8,
    border: selected
      ? '2px solid var(--macos-accent-color, #007aff)'
      : '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.12))',
    backgroundColor: isDarkPreview ? darkPreview.canvas : lightPreview.canvas,
    display: 'flex',
    overflow: 'hidden',
    boxShadow: selected
      ? '0 0 0 3px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.25))'
      : '0 2px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={containerStyle}>
      {/* ── Selector de Modo Claro / Modo Oscuro con vistas previas de ventana ── */}
      <div>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--macos-text, #1c1c1e)',
            marginBottom: 10,
          }}
        >
          Apariencia
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          {/* Tarjeta Modo Claro */}
          <div
            style={previewCardWrapperStyle}
            onClick={() => {
              if (darkMode) onToggleDarkMode();
            }}
          >
            <div style={previewWindowStyle(false, !darkMode)}>
              {/* Mini sidebar clara */}
              <div
                style={{
                  width: '32%',
                  height: '100%',
                  backgroundColor: lightPreview.sidebar,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>
                <div style={{ width: '80%', height: 4, borderRadius: 2, backgroundColor: 'var(--macos-accent-color, #007aff)' }} />
                <div style={{ width: '60%', height: 3, borderRadius: 2, backgroundColor: lightPreview.muted }} />
              </div>
              {/* Mini contenido claro */}
              <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '40%', height: 5, borderRadius: 2, backgroundColor: lightPreview.muted }} />
                <div style={{ width: '100%', height: 18, borderRadius: 4, backgroundColor: lightPreview.card, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: !darkMode ? 600 : 450,
                color: !darkMode
                  ? 'var(--macos-accent-color, #007aff)'
                  : 'var(--macos-text-muted, #636366)',
              }}
            >
              Claro {!darkMode && '✓'}
            </span>
          </div>

          {/* Tarjeta Modo Oscuro */}
          <div
            style={previewCardWrapperStyle}
            onClick={() => {
              if (!darkMode) onToggleDarkMode();
            }}
          >
            <div style={previewWindowStyle(true, darkMode)}>
              {/* Mini sidebar oscura */}
              <div
                style={{
                  width: '32%',
                  height: '100%',
                  backgroundColor: darkPreview.sidebar,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                  <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>
                <div style={{ width: '80%', height: 4, borderRadius: 2, backgroundColor: 'var(--macos-accent-color, #007aff)' }} />
                <div style={{ width: '60%', height: 3, borderRadius: 2, backgroundColor: darkPreview.muted }} />
              </div>
              {/* Mini contenido oscuro */}
              <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '40%', height: 5, borderRadius: 2, backgroundColor: darkPreview.muted }} />
                <div style={{ width: '100%', height: 18, borderRadius: 4, backgroundColor: darkPreview.card }} />
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: darkMode ? 600 : 450,
                color: darkMode
                  ? 'var(--macos-accent-color, #007aff)'
                  : 'var(--macos-text-muted, #636366)',
              }}
            >
              Oscuro {darkMode && '✓'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Selector de Tema del Sistema (extensible desde APP_THEMES) ── */}
      <div style={{ borderTop: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.06))', paddingTop: 14 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--macos-text, #1c1c1e)',
            marginBottom: 10,
          }}
        >
          Tema de color
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {THEME_LIST.map((theme) => {
            const isSelected = themeId === theme.id;
            const currentModePreview = darkMode ? theme.dark.preview : theme.light.preview;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChangeTheme(theme.id)}
                aria-pressed={isSelected}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 11px',
                  borderRadius: 10,
                  border: isSelected
                    ? '2px solid var(--macos-accent-color, #007aff)'
                    : '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.1))',
                  backgroundColor: isSelected
                    ? 'var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.08))'
                    : 'var(--macos-subtle-bg, rgba(0, 0, 0, 0.03))',
                  cursor: 'pointer',
                  textAlign: 'left',
                  outline: 'none',
                  transition: 'all 0.14s ease',
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    overflow: 'hidden',
                    display: 'flex',
                    flexShrink: 0,
                    border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.12))',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <span style={{ flex: 1, backgroundColor: currentModePreview.sidebar }} />
                  <span style={{ flex: 1, backgroundColor: currentModePreview.canvas }} />
                  <span style={{ width: 7, backgroundColor: theme.swatchHex }} />
                </span>

                <span style={{ minWidth: 0, flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 12.5,
                      fontWeight: isSelected ? 650 : 550,
                      color: isSelected
                        ? 'var(--macos-accent-color, #007aff)'
                        : 'var(--macos-text, #1c1c1e)',
                    }}
                  >
                    {theme.label} {isSelected && '✓'}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      color: 'var(--macos-text-secondary, #8e8e93)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {theme.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selector de Color de Acento de macOS ── */}
      <div style={{ borderTop: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.06))', paddingTop: 14 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: 'var(--macos-text, #1c1c1e)',
            marginBottom: 10,
          }}
        >
          Color de realce
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {MAC_ACCENT_COLORS.map((item) => {
            const isSelected = accentColor === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeAccentColor(item.id)}
                title={`Acento ${item.label}`}
                aria-label={`Color de realce ${item.label}`}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  backgroundColor: item.hex,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                  boxShadow: isSelected
                    ? `0 0 0 2px var(--macos-card-bg, #ffffff), 0 0 0 4px ${item.hex}`
                    : 'none',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsAppearanceSelector;
