/**
 * Motor de Ciencia del Color basado en HCT (Hue, Chroma, Tone) de Material 3
 * (James O'Leary — "The Science of Color & Design", Google Platforms & Ecosystems).
 *
 * Combina:
 * - Matiz (Hue) y Croma (Chroma) del modelo de apariencia perceptual CAM16.
 * - Tono (Tone = L* de CIELAB, escala perceptual 0–100 ligada a la luminancia relativa Y).
 *
 * Garantía matemática de contraste:
 * - |ToneA - ToneB| >= 40  =>  contraste WCAG >= 3.0:1 (elementos UI / texto grande)
 * - |ToneA - ToneB| >= 50  =>  contraste WCAG >= 4.5:1 (texto normal / cuerpo)
 */

export interface HctColor {
  /** Matiz perceptual CAM16 en grados [0, 360) */
  hue: number;
  /** Croma (viveza perceptual) CAM16 >= 0 */
  chroma: number;
  /** Luminosidad perceptual CIELAB L* en [0, 100] */
  tone: number;
}

type RgbTuple = [number, number, number];
type XyzTuple = [number, number, number];

// Punto blanco estándar D65 (escala Y = 100) y matrices sRGB <-> XYZ
const WHITE_D65: XyzTuple = [95.047, 100.0, 108.883];

const SRGB_TO_XYZ = [
  [0.41233895, 0.35762064, 0.18051042],
  [0.2126, 0.7152, 0.0722],
  [0.01932141, 0.11916382, 0.95034478],
] as const;

const XYZ_TO_SRGB = [
  [3.2413774792388685, -1.5376652402851851, -0.49885366846268053],
  [-0.9691452513005321, 1.8758853451067872, 0.04156585616912061],
  [0.05562093689691305, -0.20395524564742123, 1.0571799111220335],
] as const;

// Matriz CAT16 para adaptación cromática CAM16
const XYZ_TO_CAM16 = [
  [0.401288, 0.650173, -0.051461],
  [-0.250268, 1.204414, 0.045854],
  [-0.002079, 0.048952, 0.953127],
] as const;

const CAM16_TO_XYZ = [
  [1.8620678, -1.0112547, 0.14918678],
  [0.38752654, 0.62144744, -0.00897398],
  [-0.0158415, -0.03412294, 1.0499644],
] as const;

function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}

function sanitizeHue(degrees: number): number {
  const mod = degrees % 360;
  return mod < 0 ? mod + 360 : mod;
}

function srgbChannelToLinear(channel255: number): number {
  const normalized = channel255 / 255;
  return normalized <= 0.040449936
    ? (normalized / 12.92) * 100
    : Math.pow((normalized + 0.055) / 1.055, 2.4) * 100;
}

function linearToSrgbChannel(linear100: number): number {
  const normalized = linear100 / 100;
  const delinearized =
    normalized <= 0.0031308
      ? normalized * 12.92
      : 1.055 * Math.pow(normalized, 1 / 2.4) - 0.055;
  return clamp(0, 255, Math.round(delinearized * 255));
}

export function hexToRgb(hex: string): RgbTuple {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((c) => clamp(0, 255, Math.round(c)).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function rgbToXyz([r, g, b]: RgbTuple): XyzTuple {
  const lr = srgbChannelToLinear(r);
  const lg = srgbChannelToLinear(g);
  const lb = srgbChannelToLinear(b);
  return [
    SRGB_TO_XYZ[0][0] * lr + SRGB_TO_XYZ[0][1] * lg + SRGB_TO_XYZ[0][2] * lb,
    SRGB_TO_XYZ[1][0] * lr + SRGB_TO_XYZ[1][1] * lg + SRGB_TO_XYZ[1][2] * lb,
    SRGB_TO_XYZ[2][0] * lr + SRGB_TO_XYZ[2][1] * lg + SRGB_TO_XYZ[2][2] * lb,
  ];
}

/**
 * Convierte XYZ a sRGB si cae dentro del gamut estándar; devuelve null si queda fuera.
 */
function xyzToRgbInGamut([x, y, z]: XyzTuple): RgbTuple | null {
  const lr = XYZ_TO_SRGB[0][0] * x + XYZ_TO_SRGB[0][1] * y + XYZ_TO_SRGB[0][2] * z;
  const lg = XYZ_TO_SRGB[1][0] * x + XYZ_TO_SRGB[1][1] * y + XYZ_TO_SRGB[1][2] * z;
  const lb = XYZ_TO_SRGB[2][0] * x + XYZ_TO_SRGB[2][1] * y + XYZ_TO_SRGB[2][2] * z;
  const eps = 0.05;
  if (
    lr < -eps || lr > 100 + eps ||
    lg < -eps || lg > 100 + eps ||
    lb < -eps || lb > 100 + eps
  ) {
    return null;
  }
  return [
    linearToSrgbChannel(clamp(0, 100, lr)),
    linearToSrgbChannel(clamp(0, 100, lg)),
    linearToSrgbChannel(clamp(0, 100, lb)),
  ];
}

/** Luminancia relativa Y (escala 0–1) compatible con WCAG 2.1 */
export function relativeLuminance(hex: string): number {
  const [, y] = rgbToXyz(hexToRgb(hex));
  return y / 100;
}

/** Relación de contraste WCAG 2.1 entre dos colores hexadecimales */
export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = relativeLuminance(foregroundHex);
  const l2 = relativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** CIELAB L* (Tone de HCT, 0–100) a partir de Y (0–100) */
export function lstarFromY(y100: number): number {
  const fy = y100 / 100;
  const e = 216 / 24389;
  const k = 24389 / 27;
  return fy <= e ? fy * k : 116 * Math.cbrt(fy) - 16;
}

/** Luminancia Y (0–100) a partir de CIELAB L* (Tone 0–100) */
export function yFromLstar(lstar: number): number {
  const ft = (lstar + 16) / 116;
  const e = 216 / 24389;
  const k = 24389 / 27;
  const fy = lstar > k * e ? ft * ft * ft : lstar / k;
  return fy * 100;
}

// Condiciones de visualización estándar sRGB para CAM16 (Material 3 defaults)
interface ViewingConditions {
  n: number;
  aw: number;
  nbb: number;
  ncb: number;
  c: number;
  nc: number;
  rgbD: [number, number, number];
  fl: number;
  flRoot: number;
  z: number;
}

const VIEWING_CONDITIONS: ViewingConditions = (() => {
  const [wx, wy, wz] = WHITE_D65;
  const rW = XYZ_TO_CAM16[0][0] * wx + XYZ_TO_CAM16[0][1] * wy + XYZ_TO_CAM16[0][2] * wz;
  const gW = XYZ_TO_CAM16[1][0] * wx + XYZ_TO_CAM16[1][1] * wy + XYZ_TO_CAM16[1][2] * wz;
  const bW = XYZ_TO_CAM16[2][0] * wx + XYZ_TO_CAM16[2][1] * wy + XYZ_TO_CAM16[2][2] * wz;

  const backgroundLstar = 50;
  const adaptingLuminance = ((200 / Math.PI) * yFromLstar(backgroundLstar)) / 100;
  const f = 1.0; // surround = 2.0 (average)
  const c = 0.69;
  const nc = 1.0;

  const d = clamp(0, 1, f * (1 - (1 / 3.6) * Math.exp((-adaptingLuminance - 42) / 92)));
  const rgbD: [number, number, number] = [
    d * (100 / rW) + 1 - d,
    d * (100 / gW) + 1 - d,
    d * (100 / bW) + 1 - d,
  ];

  const k = 1 / (5 * adaptingLuminance + 1);
  const k4 = k * k * k * k;
  const k4F = 1 - k4;
  const fl = k4 * adaptingLuminance + 0.1 * k4F * k4F * Math.cbrt(5 * adaptingLuminance);
  const n = yFromLstar(backgroundLstar) / wy;
  const z = 1.48 + Math.sqrt(n);
  const nbb = 0.725 / Math.pow(n, 0.2);
  const ncb = nbb;

  const rgbAFactors = [
    Math.pow((fl * rgbD[0] * rW) / 100, 0.42),
    Math.pow((fl * rgbD[1] * gW) / 100, 0.42),
    Math.pow((fl * rgbD[2] * bW) / 100, 0.42),
  ];
  const rgbA = rgbAFactors.map((val) => (400 * val) / (val + 27.13));
  const aw = (2 * rgbA[0] + rgbA[1] + 0.05 * rgbA[2]) * nbb;

  return {
    n,
    aw,
    nbb,
    ncb,
    c,
    nc,
    rgbD,
    fl,
    flRoot: Math.pow(fl, 0.25),
    z,
  };
})();

function cam16FromXyz([x, y, z]: XyzTuple): { hue: number; chroma: number; j: number } {
  const vc = VIEWING_CONDITIONS;
  const rT = XYZ_TO_CAM16[0][0] * x + XYZ_TO_CAM16[0][1] * y + XYZ_TO_CAM16[0][2] * z;
  const gT = XYZ_TO_CAM16[1][0] * x + XYZ_TO_CAM16[1][1] * y + XYZ_TO_CAM16[1][2] * z;
  const bT = XYZ_TO_CAM16[2][0] * x + XYZ_TO_CAM16[2][1] * y + XYZ_TO_CAM16[2][2] * z;

  const rD = vc.rgbD[0] * rT;
  const gD = vc.rgbD[1] * gT;
  const bD = vc.rgbD[2] * bT;

  const rAF = Math.pow((vc.fl * Math.abs(rD)) / 100, 0.42);
  const gAF = Math.pow((vc.fl * Math.abs(gD)) / 100, 0.42);
  const bAF = Math.pow((vc.fl * Math.abs(bD)) / 100, 0.42);

  const rA = (Math.sign(rD) * 400 * rAF) / (rAF + 27.13);
  const gA = (Math.sign(gD) * 400 * gAF) / (gAF + 27.13);
  const bA = (Math.sign(bD) * 400 * bAF) / (bAF + 27.13);

  const a = (11 * rA + -12 * gA + bA) / 11;
  const b = (rA + gA - 2 * bA) / 9;
  const u = (20 * rA + 20 * gA + 21 * bA) / 20;
  const p2 = (40 * rA + 20 * gA + bA) / 20;

  const atanRadians = Math.atan2(b, a);
  const hue = sanitizeHue((atanRadians * 180) / Math.PI);

  const ac = p2 * vc.nbb;
  const j = 100 * Math.pow(ac / vc.aw, vc.c * vc.z);

  const huePrime = hue < 20.14 ? hue + 360 : hue;
  const eHue = 0.25 * (Math.cos((huePrime * Math.PI) / 180 + 2) + 3.8);
  const p1 = (50000 / 13) * eHue * vc.nc * vc.ncb;
  const t = (p1 * Math.hypot(a, b)) / (u + 0.305);
  const alpha = Math.pow(t, 0.9) * Math.pow(1.64 - Math.pow(0.29, vc.n), 0.73);
  const chroma = alpha * Math.sqrt(j / 100);

  return { hue, chroma, j };
}

function xyzFromCam16Jch(j: number, chroma: number, hueDegrees: number): XyzTuple {
  const vc = VIEWING_CONDITIONS;
  if (j <= 0 || chroma <= 0) {
    const y = yFromLstar(j); // aproximación acromática cuando chroma = 0
    return [
      (y * WHITE_D65[0]) / 100,
      y,
      (y * WHITE_D65[2]) / 100,
    ];
  }

  const alpha = chroma / Math.sqrt(j / 100);
  const t = Math.pow(alpha / Math.pow(1.64 - Math.pow(0.29, vc.n), 0.73), 1 / 0.9);
  const hRad = (hueDegrees * Math.PI) / 180;
  const eHue = 0.25 * (Math.cos(hRad + 2) + 3.8);
  const ac = vc.aw * Math.pow(j / 100, 1 / (vc.c * vc.z));
  const p1 = eHue * (50000 / 13) * vc.nc * vc.ncb;
  const p2 = ac / vc.nbb;

  const hSin = Math.sin(hRad);
  const hCos = Math.cos(hRad);
  const gamma = (23 * (p2 + 0.305) * t) / (23 * p1 + 11 * t * hCos + 108 * t * hSin);
  const a = gamma * hCos;
  const b = gamma * hSin;

  const rA = (460 * p2 + 451 * a + 288 * b) / 1403;
  const gA = (460 * p2 - 891 * a - 261 * b) / 1403;
  const bA = (460 * p2 - 220 * a - 6300 * b) / 1403;

  const invComponent = (valA: number, dFactor: number): number => {
    const absA = Math.abs(valA);
    const base = Math.max(0, (27.13 * absA) / (400 - absA));
    return Math.sign(valA) * (100 / vc.fl) * Math.pow(base, 1 / 0.42) / dFactor;
  };

  const rT = invComponent(rA, vc.rgbD[0]);
  const gT = invComponent(gA, vc.rgbD[1]);
  const bT = invComponent(bA, vc.rgbD[2]);

  return [
    CAM16_TO_XYZ[0][0] * rT + CAM16_TO_XYZ[0][1] * gT + CAM16_TO_XYZ[0][2] * bT,
    CAM16_TO_XYZ[1][0] * rT + CAM16_TO_XYZ[1][1] * gT + CAM16_TO_XYZ[1][2] * bT,
    CAM16_TO_XYZ[2][0] * rT + CAM16_TO_XYZ[2][1] * gT + CAM16_TO_XYZ[2][2] * bT,
  ];
}

/**
 * Convierte un color hexadecimal a coordenadas HCT (CAM16 Hue/Chroma + CIELAB L* Tone).
 */
export function hexToHct(hex: string): HctColor {
  const xyz = rgbToXyz(hexToRgb(hex));
  const { hue, chroma } = cam16FromXyz(xyz);
  const tone = lstarFromY(xyz[1]);
  return { hue, chroma, tone };
}

/**
 * Encuentra el RGB dentro del gamut sRGB que coincide con (hue, chroma, tone),
 * reduciendo el croma de forma suave si el croma solicitado excede el gamut físico
 * a ese nivel de luminosidad perceptual (exactamente como hace HctSolver de Material 3).
 */
export function hctToHex(hueInput: number, chromaInput: number, toneInput: number): string {
  const tone = clamp(0, 100, toneInput);
  if (tone <= 0.01) return '#000000';
  if (tone >= 99.99) return '#ffffff';

  const hue = sanitizeHue(hueInput);
  const targetChroma = Math.max(0, chromaInput);

  // Para una combinación (hue, chroma) fija, busca el J de CAM16 cuyo XYZ tenga L* == tone
  const findRgbForJAtTone = (c: number): RgbTuple | null => {
    let lowJ = 0;
    let highJ = 100;
    for (let i = 0; i < 24; i++) {
      const midJ = (lowJ + highJ) / 2;
      const xyz = xyzFromCam16Jch(midJ, c, hue);
      const midTone = lstarFromY(xyz[1]);
      if (midTone < tone) {
        lowJ = midJ;
      } else {
        highJ = midJ;
      }
    }
    const finalXyz = xyzFromCam16Jch((lowJ + highJ) / 2, c, hue);
    return xyzToRgbInGamut(finalXyz);
  };

  if (targetChroma < 0.5) {
    const neutralRgb = findRgbForJAtTone(0);
    return neutralRgb ? rgbToHex(...neutralRgb) : rgbToHex(...(xyzToRgbInGamut([
      (yFromLstar(tone) * WHITE_D65[0]) / 100,
      yFromLstar(tone),
      (yFromLstar(tone) * WHITE_D65[2]) / 100,
    ]) ?? [128, 128, 128]));
  }

  const direct = findRgbForJAtTone(targetChroma);
  if (direct) {
    return rgbToHex(...direct);
  }

  // Búsqueda binaria del máximo croma físico reproducible dentro de sRGB para este (hue, tone)
  let lowC = 0;
  let highC = targetChroma;
  let bestRgb: RgbTuple | null = null;
  for (let i = 0; i < 20; i++) {
    const midC = (lowC + highC) / 2;
    const candidate = findRgbForJAtTone(midC);
    if (candidate) {
      bestRgb = candidate;
      lowC = midC;
    } else {
      highC = midC;
    }
  }

  if (bestRgb) {
    return rgbToHex(...bestRgb);
  }

  // Respaldo acromático exacto al L* objetivo
  const y = yFromLstar(tone);
  const gray = linearToSrgbChannel(y);
  return rgbToHex(gray, gray, gray);
}

/**
 * Ajusta únicamente el Tone (luminosidad perceptual 0–100) de un color semilla,
 * preservando su Hue y Chroma CAM16 dentro del gamut sRGB.
 */
export function setHctTone(seedHex: string, targetTone: number, chromaScale = 1): string {
  const { hue, chroma } = hexToHct(seedHex);
  return hctToHex(hue, chroma * chromaScale, targetTone);
}

/**
 * Calcula un color "onColor" (texto/icono encima de un fondo) garantizando al menos
 * `minDeltaTone` (por defecto 55 => contraste WCAG >= 5:1) preservando sutilmente el matiz.
 */
export function deriveOnColor(surfaceHex: string, minDeltaTone = 58): string {
  const { hue, chroma, tone } = hexToHct(surfaceHex);
  const preferDarkText = tone >= 58;
  const targetTone = preferDarkText
    ? Math.max(8, tone - minDeltaTone)
    : Math.min(99, tone + minDeltaTone);
  // Mantiene tinta muy limpia y legible (croma bajo)
  const onChroma = preferDarkText ? Math.min(12, chroma * 0.25) : Math.min(6, chroma * 0.15);
  return targetTone >= 98 ? '#ffffff' : hctToHex(hue, onChroma, targetTone);
}

