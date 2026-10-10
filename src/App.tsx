// src/App.tsx
import { App as Framework7App, View, Page, Navbar } from 'framework7-react';
import 'framework7/css';
import { TitleBar } from './components/TitleBar';
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
          <TitleBar />
          <Navbar title="Contactos" />
        </Page>
      </View>
    </Framework7App>
  );
}

export default App;