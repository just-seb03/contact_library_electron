import { useRef, type CSSProperties } from 'react';
import { useApp } from '../../context/AppContext';
import { useXmbWaves } from '../hooks/useXmbWaves';

const wrapperStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
};

const canvasStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
  filter: 'blur(10px)',
  transform: 'scale(1.03)',
  opacity: 0.9,
};

const glassVeilStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  background:
    'radial-gradient(circle at 72% 38%, rgba(255, 255, 255, 0.025), transparent 62%)',
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
