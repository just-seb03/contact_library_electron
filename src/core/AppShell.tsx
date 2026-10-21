import { Page, Panel, View } from 'framework7-react';
import type { CSSProperties } from 'react';
import routes from '../navigation/routes';
import { LeftBar } from '../features/home/components/LeftBar';
import { SIDEBAR_SURFACE_STYLE, CONTENT_VIEW_STYLE } from './theme/style';

interface ElectronRegionStyle extends CSSProperties {
  WebkitAppRegion: 'drag' | 'no-drag';
}

export function AppShell() {
  const dragRegionStyle: ElectronRegionStyle = { WebkitAppRegion: 'drag' };

  return (
    <>
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
