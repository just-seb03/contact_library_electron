import { SLIDE_CIPHER_B64, SLIDE_IV_B64, SLIDE_KEY_B64 } from './asset.enc';
import bgmUrl from './bgm.mp3';

let cachedImageUrl: string | null = null;
let inflightPromise: Promise<string | null> | null = null;
let preloadedAudio: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Desencripta la imagen al iniciar la app y la mantiene en caché de memoria (Blob URL).
 */
export function preloadSlideAsset(): Promise<string | null> {
  if (cachedImageUrl) return Promise.resolve(cachedImageUrl);
  if (inflightPromise) return inflightPromise;

  inflightPromise = (async () => {
    try {
      if (!preloadedAudio && typeof Audio !== 'undefined') {
        preloadedAudio = new Audio(bgmUrl);
        preloadedAudio.preload = 'auto';
        preloadedAudio.loop = true;
      }

      const keyBytes = base64ToBytes(SLIDE_KEY_B64);
      const ivBytes = base64ToBytes(SLIDE_IV_B64);
      const cipherBytes = base64ToBytes(SLIDE_CIPHER_B64);

      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const plainBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBytes },
        cryptoKey,
        cipherBytes
      );

      const blob = new Blob([plainBuffer], { type: 'image/png' });
      cachedImageUrl = URL.createObjectURL(blob);
      return cachedImageUrl;
    } catch (err) {
      console.error('No se pudo desencriptar el asset en caché:', err);
      return null;
    }
  })();

  return inflightPromise;
}

export function getCachedSlideUrl(): string | null {
  return cachedImageUrl;
}

export function getPreloadedSlideAudio(): HTMLAudioElement {
  if (!preloadedAudio) {
    preloadedAudio = new Audio(bgmUrl);
    preloadedAudio.preload = 'auto';
    preloadedAudio.loop = true;
  }
  return preloadedAudio;
}

export function triggerSlideMode(): void {
  listeners.forEach((cb) => cb());
}

export function subscribeSlideMode(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
