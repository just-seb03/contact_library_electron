import { App as Framework7App, Panel, View, Page } from 'framework7-react';
import type { CSSProperties } from 'react';
import routes from './routes';
import { AppProvider, useApp } from './context/AppContext';
import { LeftBar } from './components/Home/LeftBar';
import 'framework7/css/bundle';
import 'framework7/components/grid/css';
import 'framework7-icons/css/framework7-icons.css';

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      getPlatform: () => Promise<string>;
    };
  }
}

interface ElectronRegionStyle extends CSSProperties {
  WebkitAppRegion: 'drag' | 'no-drag';
}

function MainApp() {
  const { darkMode } = useApp();
  const dragRegionStyle: ElectronRegionStyle = { WebkitAppRegion: 'drag' };

  return (
    <Framework7App
      name="Contact Library"
      theme="ios"
      dark={darkMode}
      routes={routes}
      view={{ animate: true, transition: 'f7-fade', iosSwipeBack: true }}
    >
      {/* Barra lateral permanente estilo macOS: FULL BLANCA */}
      <Panel
        left
        visibleBreakpoint={0}
        resizable
        backdrop={false}
        style={{
          backgroundColor: '#ffffff',
          '--f7-panel-bg-color': '#ffffff',
          '--f7-page-bg-color': '#ffffff',
          '--f7-list-strong-bg-color': '#ffffff',
          '--f7-list-bg-color': '#ffffff',
        } as CSSProperties}
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            '--f7-page-bg-color': '#ffffff',
          } as CSSProperties}
        >
          <Page
            pageContent={false}
            noNavbar
            noToolbar
            style={{
              backgroundColor: '#ffffff',
              '--f7-page-bg-color': '#ffffff',
            } as CSSProperties}
          >
            <LeftBar />
          </Page>
        </View>
      </Panel>

      {/* Región de arrastre de ventana para Electron (absoluta para no añadir espacio ni empujar las vistas) */}
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

      {/* Lado derecho: UN SOLO COLOR (GRIS UNIFICADO), sin espacios superiores artificiales */}
      <View
        id="content-view"
        main
        url="/"
        routes={routes}
        style={{
          backgroundColor: '#f5f5f7',
          '--f7-page-bg-color': '#f5f5f7',
          '--f7-bars-bg-color': '#f5f5f7',
          '--f7-navbar-bg-color': '#f5f5f7',
          '--f7-toolbar-bg-color': '#f5f5f7',
          '--f7-card-bg-color': '#f5f5f7',
          '--f7-list-strong-bg-color': '#f5f5f7',
          '--f7-list-bg-color': '#f5f5f7',
          '--f7-page-navbar-offset': '0px',
          '--f7-page-toolbar-top-offset': '0px',
          '--f7-page-content-extra-padding-top': '0px',
        } as CSSProperties}
      />
    </Framework7App>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
