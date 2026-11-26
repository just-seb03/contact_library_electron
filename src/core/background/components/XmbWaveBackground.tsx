import { useRef, type CSSProperties } from 'react';
import { useApp } from '../../context/AppContext';
import { useXmbWaves } from '../hooks/useXmbWaves';

const wrapperStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  backgroundColor: 'var(--macos-canvas-bg, #18181a)',
  pointerEvents: 'none',
  overflow: 'hidden',
};

const canvasStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
  filter: 'blur(1.5px)',
  transform: 'scale(1.02)',
};

const glassVeilStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  background:
    'radial-gradient(circle at 72% 38%, rgba(255, 255, 255, 0.03), transparent 65%)',
  pointerEvents: 'none',
};

export function XmbWaveBackground() {
  const { darkMode } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useXmbWaves({ canvasRef, darkMode });

  return (
    <div aria-hidden="true" style={wrapperStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      <div style={glassVeilStyle} />
    </div>
  );
}
