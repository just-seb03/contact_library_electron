import { useState, useEffect, useCallback } from 'react';
import { Page, Panel, View, f7, f7ready } from 'framework7-react';
import routes from '../navigation/routes';
import { LeftBar } from '../navigation/LeftBar';
import { UnifiedToolbar } from './components/UnifiedToolbar';
import { SpotlightModal } from './components/SpotlightModal';
import { SIDEBAR_SURFACE_STYLE, CONTENT_VIEW_STYLE, APP_SPACING } from './theme/style';

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    f7ready(() => {
      try {
        f7.panel.toggle('left');
        setIsSidebarOpen((prev) => !prev);
      } catch {
        setIsSidebarOpen((prev) => !prev);
      }
    });
  }, []);

  // Atajos de teclado estilo macOS (⌘K para Spotlight, ⌘B para barra lateral)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebar]);

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

      {/* ── Barra Lateral estilo Source List de macOS ── */}
      <Panel
        left
        visibleBreakpoint={0}
        backdrop={false}
        style={{
          ...SIDEBAR_SURFACE_STYLE,
          display: isSidebarOpen ? 'block' : 'none',
        }}
      >
        <View style={SIDEBAR_SURFACE_STYLE}>
          <Page
            pageContent={false}
            noNavbar
            noToolbar
            style={SIDEBAR_SURFACE_STYLE}
          >
            <LeftBar />
          </Page>
        </View>
      </Panel>

      {/* ── Área Principal de Contenido con Unified Toolbar (al lado, sin superponerse) ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          marginLeft: isSidebarOpen ? `${APP_SPACING.sidebarWidth}px` : '0px',
          width: isSidebarOpen ? `calc(100% - ${APP_SPACING.sidebarWidth}px)` : '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          transition: 'margin-left 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <UnifiedToolbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
        />

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

      {/* ── Buscador Rápido Spotlight (⌘K) ── */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />
    </>
  );
}

export default AppShell;
