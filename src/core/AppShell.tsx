import { useState, useEffect } from 'react';
import { View, f7ready } from 'framework7-react';
import routes from '../navigation/routes';
import { LeftBar } from '../navigation/LeftBar';
import { UnifiedToolbar } from './components/UnifiedToolbar';
import { SpotlightModal } from './components/SpotlightModal';
import { CONTENT_VIEW_STYLE } from './theme/style';
import { navigateToTab } from '../navigation/navigation';
import { useSystemNavigation } from '../navigation/useSystemNavigation';
import { useApp } from './context/AppContext';

export function AppShell() {
  const { setActiveTab } = useApp();
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Navegación disparada por el sistema operativo (Cmd+, en macOS, clic en notificaciones...)
  useSystemNavigation();

  // Atajos de teclado estilo macOS (⌘K para Spotlight, ⌘, para Ajustes)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setActiveTab('config');
        f7ready(() => {
          try {
            navigateToTab('config');
          } catch (err) {
            console.warn('Error navegando a Ajustes:', err);
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <>
      <style>{`
        /* Micro-interacciones suaves estilo macOS */
        button,
        .button,
        select {
          transition: all 0.12s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        button:active:not(:disabled),
        .button:active:not(.disabled) {
          transform: scale(0.97);
        }

        @media (prefers-reduced-motion: reduce) {
          button,
          .button,
          select {
            transition: none !important;
            will-change: auto;
          }
          button:active,
          .button:active {
            transform: none;
          }
        }
      `}</style>

      {/* ── Área Principal de Contenido a ancho completo con Unified Toolbar ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <UnifiedToolbar onOpenSpotlight={() => setIsSpotlightOpen(true)} />

        <View
          id="content-view"
          main
          url="/"
          routes={routes}
          style={{
            ...CONTENT_VIEW_STYLE,
            flex: 1,
            height: 'calc(100% - 52px)',
          }}
        />
      </div>

      {/* ── Navegación flotante monocroma en esquina inferior izquierda ── */}
      <LeftBar />

      {/* ── Buscador Rápido Spotlight (⌘K) ── */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />
    </>
  );
}

export default AppShell;
