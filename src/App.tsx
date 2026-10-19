import { App as Framework7App, View, Button } from 'framework7-react';
import routes from './routes';
import { AppProvider, useApp } from './context/AppContext';
import 'framework7/css/bundle';
import 'framework7-icons/css/framework7-icons.css';

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

interface CustomCSSProperties extends React.CSSProperties {
  '--f7-theme-color'?: string;
  '--f7-safe-area-top'?: string;
  '--f7-card-box-shadow'?: string;
  '--f7-card-outline-border-color'?: string;
  '--f7-page-bg-color'?: string;
  WebkitAppRegion?: 'drag' | 'no-drag';
}

function MainApp() {
  const { darkMode } = useApp();

  const f7params = {
    name: 'Contact Library',
    theme: 'ios',
    dark: darkMode,
    routes,
    view: {
      animate: true,
      transition: 'f7-fade',
      iosSwipeBack: true,
    },
  };

  const appStyle: CustomCSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: darkMode ? '#0e0f13' : '#eeeff0',
    color: darkMode ? '#f5f5f7' : '#1c1c1e',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    '--f7-theme-color': '#007aff',
    '--f7-safe-area-top': '38px',
    '--f7-card-box-shadow': 'none',
    '--f7-card-outline-border-color': 'transparent',
    '--f7-page-bg-color': darkMode ? '#0e0f13' : '#eeeff0',
  };

  const titlebarStyle: CustomCSSProperties = {
    height: 38,
    backgroundColor: darkMode ? '#16171d' : '#fcf9f9',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    WebkitAppRegion: 'drag',
    width: '100%',
    userSelect: 'none',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10000,
    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.1)',
  };

  const titlebarButtonsStyle: CustomCSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: '100%',
    padding: '0 12px',
    WebkitAppRegion: 'no-drag',
  };

  const trafficLightButtonStyle = (bgColor: string): React.CSSProperties => ({
    width: 12,
    height: 12,
    minWidth: 12,
    padding: 0,
    backgroundColor: bgColor,
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'filter 0.15s ease',
  });

  return (
    <Framework7App {...f7params} dark={darkMode} style={appStyle}>
      {/* Scrollbar estilizada liquid sin archivos css */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.14)'};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(255, 255, 255, 0.32)' : 'rgba(0, 0, 0, 0.28)'};
        }
      `}</style>

      {/* Barra de título Electron integrada con Framework7 Button */}
      <div style={titlebarStyle}>
        <div style={titlebarButtonsStyle}>
          <Button
            round
            style={trafficLightButtonStyle('#ff5f57')}
            onClick={() => window.electronAPI?.close()}
          />
          <Button
            round
            style={trafficLightButtonStyle('#febc2e')}
            onClick={() => window.electronAPI?.minimize()}
          />
          <Button
            round
            style={trafficLightButtonStyle('#28c840')}
            onClick={() => window.electronAPI?.maximize()}
          />
        </div>
      </div>

      {/* Se mantiene la vista principal con animación habilitada */}
      <View id="main-view" main url="/" style={{ height: '100vh' }} transition="f7-fade" />
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