import type { FC, CSSProperties } from 'react';
import { MAC_ACCENT_COLORS, type AppleAccentColor } from '../data/settingsData';

interface SettingsAppearanceSelectorProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  accentColor: AppleAccentColor;
  onChangeAccentColor: (color: AppleAccentColor) => void;
}

export const SettingsAppearanceSelector: FC<SettingsAppearanceSelectorProps> = ({
  darkMode,
  onToggleDarkMode,
  accentColor,
  onChangeAccentColor,
}) => {
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
      ? '2px solid #007aff'
      : darkMode
      ? '1px solid rgba(255, 255, 255, 0.12)'
      : '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: isDarkPreview ? '#1e1e20' : '#f5f5f7',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: selected
      ? '0 0 0 3px rgba(0, 122, 255, 0.25)'
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
            color: darkMode ? '#ffffff' : '#1c1c1e',
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
                  backgroundColor: '#e5e5ea',
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
                <div style={{ width: '80%', height: 4, borderRadius: 2, backgroundColor: '#007aff' }} />
                <div style={{ width: '60%', height: 3, borderRadius: 2, backgroundColor: '#c7c7cc' }} />
              </div>
              {/* Mini contenido claro */}
              <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '40%', height: 5, borderRadius: 2, backgroundColor: '#8e8e93' }} />
                <div style={{ width: '100%', height: 18, borderRadius: 4, backgroundColor: '#ffffff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }} />
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: !darkMode ? 600 : 450,
                color: !darkMode ? '#007aff' : darkMode ? '#a1a1aa' : '#636366',
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
                  backgroundColor: '#2c2c2e',
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
                <div style={{ width: '80%', height: 4, borderRadius: 2, backgroundColor: '#007aff' }} />
                <div style={{ width: '60%', height: 3, borderRadius: 2, backgroundColor: '#48484a' }} />
              </div>
              {/* Mini contenido oscuro */}
              <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '40%', height: 5, borderRadius: 2, backgroundColor: '#636366' }} />
                <div style={{ width: '100%', height: 18, borderRadius: 4, backgroundColor: '#2c2c2e' }} />
              </div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: darkMode ? 600 : 450,
                color: darkMode ? '#007aff' : '#636366',
              }}
            >
              Oscuro {darkMode && '✓'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Selector de Color de Acento de macOS ── */}
      <div style={{ borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)', paddingTop: 14 }}>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: darkMode ? '#ffffff' : '#1c1c1e',
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
                    ? `0 0 0 2px ${darkMode ? '#1c1c1e' : '#ffffff'}, 0 0 0 4px ${item.hex}`
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
