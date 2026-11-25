import { useEffect, type RefObject } from 'react';
import { getXmbWavePalette, XMB_WAVE_RIBBONS } from '../config/wavePresets';

interface UseXmbWavesOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  darkMode: boolean;
}

const MAX_DELTA_SECONDS = 0.05;
const SAMPLE_STEP_PX = 12;

export function useXmbWaves({ canvasRef, darkMode }: UseXmbWavesOptions): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const palette = getXmbWavePalette(darkMode);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let width = 0;
    let height = 0;
    let dpr = 1;
    let elapsed = 0;
    let lastTimestamp = performance.now();
    let rafId: number | null = null;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width || window.innerWidth);
      height = Math.max(1, rect.height || window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const computeWaveY = (
      x: number,
      time: number,
      ribbon: (typeof XMB_WAVE_RIBBONS)[number]
    ): number => {
      const nx = x / width;
      const baseY = height * ribbon.yRatio;
      const primary =
        Math.sin(nx * Math.PI * 2 * ribbon.frequency + time * ribbon.speed + ribbon.phase) *
        ribbon.amplitude;
      const secondary =
        Math.sin(
          nx * Math.PI * 2 * ribbon.secondaryFrequency -
            time * ribbon.speed * 0.65 +
            ribbon.phase * 1.4
        ) *
        (ribbon.amplitude * 0.36);
      // Envolvente suave para que los bordes laterales respiren sin cortes bruscos
      const edgeFade = 0.72 + 0.28 * Math.sin(nx * Math.PI);
      return baseY + (primary + secondary) * edgeFade;
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const ribbon of XMB_WAVE_RIBBONS) {
        const startY = computeWaveY(0, time, ribbon);
        const crestPoints: Array<{ x: number; y: number }> = [{ x: 0, y: startY }];

        for (let x = SAMPLE_STEP_PX; x < width; x += SAMPLE_STEP_PX) {
          crestPoints.push({ x, y: computeWaveY(x, time, ribbon) });
        }
        crestPoints.push({ x: width, y: computeWaveY(width, time, ribbon) });

        // 1. Relleno translúcido en degradado hacia abajo (cinta XMB)
        ctx.beginPath();
        ctx.moveTo(crestPoints[0].x, crestPoints[0].y);
        for (let i = 1; i < crestPoints.length; i++) {
          const prev = crestPoints[i - 1];
          const curr = crestPoints[i];
          const midX = (prev.x + curr.x) * 0.5;
          const midY = (prev.y + curr.y) * 0.5;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        const last = crestPoints[crestPoints.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const fillGradient = ctx.createLinearGradient(0, height * (ribbon.yRatio - 0.14), 0, height);
        fillGradient.addColorStop(0, `rgba(${palette.fillRgb}, ${ribbon.fillOpacity})`);
        fillGradient.addColorStop(0.55, `rgba(${palette.fillRgb}, ${ribbon.fillOpacity * 0.35})`);
        fillGradient.addColorStop(1, `rgba(${palette.fillRgb}, 0)`);
        ctx.fillStyle = fillGradient;
        ctx.fill();

        // 2. Cresta superior sutil tipo seda/grafito
        ctx.beginPath();
        ctx.moveTo(crestPoints[0].x, crestPoints[0].y);
        for (let i = 1; i < crestPoints.length; i++) {
          const prev = crestPoints[i - 1];
          const curr = crestPoints[i];
          const midX = (prev.x + curr.x) * 0.5;
          const midY = (prev.y + curr.y) * 0.5;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
        ctx.lineTo(last.x, last.y);

        const strokeGradient = ctx.createLinearGradient(0, 0, width, 0);
        strokeGradient.addColorStop(0, `rgba(${palette.strokeRgb}, 0)`);
        strokeGradient.addColorStop(0.18, `rgba(${palette.strokeRgb}, ${ribbon.strokeOpacity})`);
        strokeGradient.addColorStop(0.5, `rgba(${palette.glowRgb}, ${ribbon.strokeOpacity * 1.15})`);
        strokeGradient.addColorStop(0.82, `rgba(${palette.strokeRgb}, ${ribbon.strokeOpacity})`);
        strokeGradient.addColorStop(1, `rgba(${palette.strokeRgb}, 0)`);

        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = ribbon.lineWidth;
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(MAX_DELTA_SECONDS, Math.max(0, (now - lastTimestamp) / 1000));
      lastTimestamp = now;
      elapsed += dt;

      drawFrame(elapsed);

      if (!reducedMotionQuery.matches && !document.hidden) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (rafId !== null) return;
      lastTimestamp = performance.now();
      if (reducedMotionQuery.matches) {
        drawFrame(elapsed);
        return;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const handleMotionChange = () => {
      stopLoop();
      startLoop();
    };

    updateCanvasSize();
    startLoop();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
      if (reducedMotionQuery.matches) {
        drawFrame(elapsed);
      }
    });
    resizeObserver.observe(canvas);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [canvasRef, darkMode]);
}
