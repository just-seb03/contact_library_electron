import type { XmbWavePalette, XmbWaveRibbon } from '../types';

/**
 * Ondas estilo XMB (PS3) calibradas con velocidades visibles (rad/s)
 * para fluir de manera continua a cualquier tasa de refresco (60–240 Hz).
 */
export const XMB_WAVE_RIBBONS: readonly XmbWaveRibbon[] = [
  {
    yRatio: 0.54,
    amplitude: 58,
    frequency: 1.1,
    secondaryFrequency: 2.25,
    speed: 0.45,
    phase: 0.2,
    strokeOpacity: 0.42,
    fillOpacity: 0.16,
    lineWidth: 2.0,
  },
  {
    yRatio: 0.61,
    amplitude: 72,
    frequency: 0.85,
    secondaryFrequency: 1.75,
    speed: -0.36,
    phase: 1.7,
    strokeOpacity: 0.34,
    fillOpacity: 0.13,
    lineWidth: 1.8,
  },
  {
    yRatio: 0.68,
    amplitude: 52,
    frequency: 1.32,
    secondaryFrequency: 2.5,
    speed: 0.3,
    phase: 3.1,
    strokeOpacity: 0.28,
    fillOpacity: 0.11,
    lineWidth: 1.5,
  },
  {
    yRatio: 0.75,
    amplitude: 64,
    frequency: 0.72,
    secondaryFrequency: 1.55,
    speed: -0.24,
    phase: 4.5,
    strokeOpacity: 0.22,
    fillOpacity: 0.09,
    lineWidth: 1.3,
  },
];

/** Paleta de ondas contrastadas sobre el color del fondo del tema. */
export function getXmbWavePalette(darkMode: boolean): XmbWavePalette {
  return darkMode
    ? {
        strokeRgb: '188, 194, 210',
        fillRgb: '122, 128, 146',
        glowRgb: '220, 224, 236',
      }
    : {
        strokeRgb: '96, 102, 118',
        fillRgb: '118, 124, 140',
        glowRgb: '72, 78, 92',
      };
}
