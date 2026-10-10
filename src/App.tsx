import { useState } from 'react';
import { App as Framework7App, View } from 'framework7-react';
import routes from './routes';
import { LeftBar } from './components/Home/LeftBar';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
  };

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

      <div style={{ display: 'flex', height: '100vh'}}>
        <LeftBar activeTab={activeTab} onSelectTab={handleSelectTab} />
        <View id="main-view" main url="/" style={{ flex: 1 }} />
      </div>
    </Framework7App>
  );
}