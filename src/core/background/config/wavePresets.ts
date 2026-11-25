import type { XmbWavePalette, XmbWaveRibbon } from '../types';

/**
 * Ondas estilo XMB (PS3) calibradas con velocidades suaves (rad/s)
 * para fluir de manera continua a cualquier tasa de refresco (60–240 Hz).
 */
export const XMB_WAVE_RIBBONS: readonly XmbWaveRibbon[] = [
  {
    yRatio: 0.56,
    amplitude: 46,
    frequency: 1.15,
    secondaryFrequency: 2.35,
    speed: 0.24,
    phase: 0.2,
    strokeOpacity: 0.16,
    fillOpacity: 0.055,
    lineWidth: 1.4,
  },
  {
    yRatio: 0.62,
    amplitude: 58,
    frequency: 0.9,
    secondaryFrequency: 1.85,
    speed: -0.19,
    phase: 1.7,
    strokeOpacity: 0.12,
    fillOpacity: 0.045,
    lineWidth: 1.2,
  },
  {
    yRatio: 0.68,
    amplitude: 40,
    frequency: 1.38,
    secondaryFrequency: 2.6,
    speed: 0.15,
    phase: 3.1,
    strokeOpacity: 0.1,
    fillOpacity: 0.04,
    lineWidth: 1.1,
  },
  {
    yRatio: 0.74,
    amplitude: 52,
    frequency: 0.75,
    secondaryFrequency: 1.6,
    speed: -0.13,
    phase: 4.5,
    strokeOpacity: 0.08,
    fillOpacity: 0.035,
    lineWidth: 1.0,
  },
];

/** Paleta grafito mate para modo oscuro y claro. */
export function getXmbWavePalette(darkMode: boolean): XmbWavePalette {
  return darkMode
    ? {
        strokeRgb: '214, 214, 222',
        fillRgb: '150, 150, 162',
        glowRgb: '196, 196, 208',
      }
    : {
        strokeRgb: '92, 92, 100',
        fillRgb: '110, 110, 120',
        glowRgb: '120, 120, 130',
      };
}
