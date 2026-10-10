// src/App.tsx
import { App as Framework7App, View, Page, Navbar } from 'framework7-react';
import 'framework7/css';
import { LeftBar } from './components/Home/LeftBar';
import './App.css';

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    }
  }
}

function App() {
  return (
    <Framework7App theme="ios">
      <View main>
        <Page>
          <Navbar title="Contactos" />
          <div className="home-layout">
            <LeftBar />
            <main className="home-content" aria-label="Contenido principal" />
          </div>
        </Page>
      </View>
    </Framework7App>
  );
}

export default App;