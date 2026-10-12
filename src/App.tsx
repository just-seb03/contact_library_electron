import { App as Framework7App, View } from 'framework7-react';
import routes from './routes';
import { AppProvider, useApp } from './context/AppContext';
import 'framework7/css/bundle';
import 'framework7-icons/css/framework7-icons.css';
import './App.css';

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

function MainApp() {
  const { darkMode } = useApp();

  const f7params = {
    name: 'Contact Library',
    theme: 'ios',
    dark: darkMode,
    routes,
    // 1. AGREGADO: Configuración global de transiciones
    view: {
      animate: true,
      transition: 'f7-fade', // Opciones: 'f7-fade', 'f7-push', 'f7-cover', 'f7-circle-crop'
      iosSwipeBack: true,
    },
  };

  return (
    <Framework7App {...f7params} dark={darkMode}>
      <div className="titlebar">
        <div className="titlebar-buttons">
          <button className="titlebar-button close" onClick={() => window.electronAPI.close()}></button>
          <button className="titlebar-button minimize" onClick={() => window.electronAPI.minimize()}></button>
          <button className="titlebar-button maximize" onClick={() => window.electronAPI.maximize()}></button>
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