import { useState, useEffect, type CSSProperties } from 'react';
import { MACOS_THEME } from '../theme/style';

interface TrafficLightsProps {
  className?: string;
  style?: CSSProperties;
}

export function TrafficLights({ className, style }: TrafficLightsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isNativeMac, setIsNativeMac] = useState(false);

  useEffect(() => {
    // Detectar si estamos en macOS para respetar los semáforos del SO si existen
    if (typeof window !== 'undefined') {
      const isPlatformMac =
        /Mac|iPhone|iPod|iPad/.test(navigator.platform) ||
        /Mac OS X/.test(navigator.userAgent);

      if (window.electronAPI?.getPlatform) {
        window.electronAPI.getPlatform().then((platform) => {
          setIsNativeMac(platform === 'darwin');
        }).catch(() => {
          setIsNativeMac(isPlatformMac);
        });
      } else {
        setIsNativeMac(isPlatformMac);
      }
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.electronAPI?.close();
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.electronAPI?.minimize();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.electronAPI?.maximize();
  };

  // En macOS nativo dentro de Electron con titleBarStyle: 'hidden',
  // Electron ya pinta los semáforos reales en las coordenadas {x: 18, y: 18}.
  // Dejamos el espacio reservado para que no se superpongan con otros elementos.
  if (isNativeMac) {
    return (
      <div
        className={className}
        style={{
          width: 72,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          ...style,
        }}
        aria-hidden="true"
      />
    );
  }

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 2px',
    cursor: 'default',
    ...style,
  };

  const baseDotStyle: CSSProperties = {
    width: 12,
    height: 12,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    padding: 0,
    outline: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'transform 0.1s ease, filter 0.1s ease',
  };

  const glyphStyle = (color: string): CSSProperties => ({
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.12s ease',
    color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  });

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="group"
      aria-label="Controles de ventana"
    >
      {/* Botón Cerrar */}
      <button
        type="button"
        onClick={handleClose}
        aria-label="Cerrar ventana"
        style={{
          ...baseDotStyle,
          backgroundColor: MACOS_THEME.trafficLights.close,
          boxShadow: `inset 0 0 0 1px ${MACOS_THEME.trafficLights.closeBorder}`,
        }}
      >
        <span style={glyphStyle('#4d0000')}>
          <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
            <path
              d="M1 1L6 6M6 1L1 6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Botón Minimizar */}
      <button
        type="button"
        onClick={handleMinimize}
        aria-label="Minimizar ventana"
        style={{
          ...baseDotStyle,
          backgroundColor: MACOS_THEME.trafficLights.minimize,
          boxShadow: `inset 0 0 0 1px ${MACOS_THEME.trafficLights.minimizeBorder}`,
        }}
      >
        <span style={glyphStyle('#995700')}>
          <svg width="7" height="2" viewBox="0 0 7 2" fill="none">
            <path
              d="M1 1H6"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {/* Botón Maximizar / Zoom */}
      <button
        type="button"
        onClick={handleMaximize}
        aria-label="Maximizar ventana"
        style={{
          ...baseDotStyle,
          backgroundColor: MACOS_THEME.trafficLights.maximize,
          boxShadow: `inset 0 0 0 1px ${MACOS_THEME.trafficLights.maximizeBorder}`,
        }}
      >
        <span style={glyphStyle('#006500')}>
          <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
            <path
              d="M1 1L5 5M1 1H4M1 1V4M5 5V2M5 5H2"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default TrafficLights;
