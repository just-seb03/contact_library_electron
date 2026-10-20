import { Page, Panel, View } from 'framework7-react';
import type { CSSProperties } from 'react';
import routes from '../navigation/routes';
import { LeftBar } from '../features/home/components/LeftBar';

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
        resizable
        backdrop={false}
        className="app-sidebar-surface"
      >
        <View className="app-sidebar-surface">
          <Page
            pageContent={false}
            noNavbar
            noToolbar
            className="app-sidebar-surface"
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
          left: 288,
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
        className="app-content-view"
      />
    </>
  );
}
