import { App as Framework7App, View } from 'framework7-react';
import routes from './routes';
import 'framework7/css';
import { LeftBar } from './components/Home/LeftBar';
import './App.css';
import './index.css';

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
  const f7params = {
    theme: 'ios',
    routes,
  };

  return (
    <Framework7App {...f7params}>
      <div className="home-layout liquid-container">
        <LeftBar />
        <View main className="home-content liquid-view" url="/" />
      </div>
    </Framework7App>
  );
}

export default App;