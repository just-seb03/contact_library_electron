import { App as Framework7App, View } from 'framework7-react';
import routes from './routes';
import 'framework7/css/bundle';
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

function App() {
  const f7params = {
    name: 'Contact Library',
    theme: 'ios',
    dark: false,
    routes,
  };

  return (
    <Framework7App {...f7params}>
      <div className="titlebar">
        <div className="titlebar-buttons">
          <button className="titlebar-button close" onClick={() => window.electronAPI.close()}></button>
          <button className="titlebar-button minimize" onClick={() => window.electronAPI.minimize()}></button>
          <button className="titlebar-button maximize" onClick={() => window.electronAPI.maximize()}></button>
        </div>
      </div>
      <div className="app-shell">
        <LeftBar />
        <View main className="home-content" url="/" />
      </div>
    </Framework7App>
  );
}

export default App;