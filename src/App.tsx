// src/App.tsx
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
    <div className="app-container">
      <TitleBar />
      {/* El lienzo está listo para tu nuevo diseño */}
    </div>
  );
}

export default App;