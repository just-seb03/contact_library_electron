import { Page, Panel, View } from 'framework7-react';
import type { CSSProperties } from 'react';
import routes from '../navigation/routes';
import { LeftBar } from '../navigation/LeftBar';
import { SIDEBAR_SURFACE_STYLE, CONTENT_VIEW_STYLE } from './theme/style';

interface ElectronRegionStyle extends CSSProperties {
  WebkitAppRegion: 'drag' | 'no-drag';
}

export function AppShell() {
  const dragRegionStyle: ElectronRegionStyle = { WebkitAppRegion: 'drag' };

  return (
    <>
      <style>{`
        button,
        .button,
        select {
          transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        button:hover:not(:disabled),
        .button:hover:not(.disabled),
        select:hover {
          transform: scale(1.01);
          filter: brightness(0.95);
        }

        button:active:not(:disabled),
        .button:active:not(.disabled),
        select:active {
          transform: scale(0.97);
          filter: brightness(0.95);
        }

        @media (prefers-reduced-motion: reduce) {
          button,
          .button,
          select {
            transition: none !important;
            will-change: auto;
          }

          button:hover,
          button:active,
          .button:hover,
          .button:active,
          select:hover,
          select:active {
            transform: none;
            filter: none;
          }
        }
      `}</style>
      <Panel
        left
        visibleBreakpoint={0}
        backdrop={false}
        style={SIDEBAR_SURFACE_STYLE}
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

      <div
        style={{
          ...dragRegionStyle,
          position: 'absolute',
          top: 0,
          right: 0,
          left: 250,
          height: 24,
          zIndex: 500,
          pointerEvents: 'auto',
        }}
      />

      <View
        id="content-view"
        main
        url="/"
        routes={routes}
        style={CONTENT_VIEW_STYLE}
      />
    </>
  );
}
