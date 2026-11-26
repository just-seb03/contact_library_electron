import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  getCachedSlideUrl,
  getPreloadedSlideAudio,
  preloadSlideAsset,
  subscribeSlideMode,
} from './slideCache';

export function SlideFullscreenOverlay() {
  const [active, setActive] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(() => getCachedSlideUrl());

  useEffect(() => {
    let mounted = true;
    preloadSlideAsset().then((url) => {
      if (mounted && url) setImageUrl(url);
    });

    const unsubscribe = subscribeSlideMode(() => {
      setActive(true);
      preloadSlideAsset().then((url) => {
        if (mounted && url) setImageUrl(url);
      });
      const audio = getPreloadedSlideAudio();
      audio.loop = true;
      audio.currentTime = 0;
      void audio.play().catch(() => {
        // Ignorar si el autoplay requiere interacción previa
      });
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (!active || !imageUrl) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: '#000000',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <img
        src={imageUrl}
        alt=""
        draggable={false}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>,
    document.body
  );
}
