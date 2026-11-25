export interface XmbWaveRibbon {
  /** Posición vertical base normalizada (0 = arriba, 1 = abajo). */
  yRatio: number;
  /** Amplitud vertical base en píxeles CSS. */
  amplitude: number;
  /** Frecuencia espacial primaria (ciclos por ancho de ventana). */
  frequency: number;
  /** Frecuencia armónica secundaria para dar fluidez orgánica tipo XMB. */
  secondaryFrequency: number;
  /** Velocidad angular en radianes por segundo (independiente del refresco). */
  speed: number;
  /** Desfase inicial en radianes. */
  phase: number;
  /** Opacidad del trazo superior luminoso. */
  strokeOpacity: number;
  /** Opacidad superior del relleno degradado hacia abajo. */
  fillOpacity: number;
  /** Grosor de la cresta luminosa en píxeles CSS. */
  lineWidth: number;
}

export interface XmbWavePalette {
  strokeRgb: string;
  fillRgb: string;
  glowRgb: string;
}
