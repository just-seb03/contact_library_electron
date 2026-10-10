import { App as Framework7App, Views, View, Panel } from 'framework7-react';
import routes from './routes';
import 'framework7/css/bundle';
import 'framework7-icons/css/framework7-icons.css';
import { LeftBar } from './components/Home/LeftBar';
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

export default function App() {
  const f7params = {
    name: 'Contact Library',
    theme: 'ios',
    dark: false,
    routes,
  };

  return (
    <Framework7App {...f7params}>
      {/* Controles de la ventana de macOS */}
      <div className="titlebar">
        <div className="titlebar-buttons">
          <button className="titlebar-button close" onClick={() => window.electronAPI.close()}></button>
          <button className="titlebar-button minimize" onClick={() => window.electronAPI.minimize()}></button>
          <button className="titlebar-button maximize" onClick={() => window.electronAPI.maximize()}></button>
        </div>
      </div>

      {/* Panel lateral nativo de Framework7 */}
      <Panel left cover resizable visibleBreakpoint={960} className="bg-color-white">
        <View name="left-menu" init={false}>
          <LeftBar />
        </View>
      </Panel>

      {/* Vistas principales basadas en Tabs */}
      <Views tabs className="safe-areas">
        <View id="view-home" main tab tabActive url="/" />
        <View id="view-summary" tab url="/summary/" />
        <View id="view-calendar" tab url="/calendar/" />
        <View id="view-settings" tab url="/settings/" />
      </Views>
    </Framework7App>
  );
}