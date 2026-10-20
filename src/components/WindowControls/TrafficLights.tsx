import { Button } from 'framework7-react';
import type { CSSProperties } from 'react';

const dotSize: CSSProperties = {
  width: 12,
  height: 12,
  minWidth: 12,
  padding: 0,
  margin: 0,
};

export function TrafficLights() {
  return (
    <div className="display-flex align-items-center" style={{ gap: 8 }}>
      <Button
        round
        fill
        color="red"
        style={dotSize}
        onClick={() => window.electronAPI?.close()}
        aria-label="Cerrar ventana"
      />
      <Button
        round
        fill
        color="orange"
        style={dotSize}
        onClick={() => window.electronAPI?.minimize()}
        aria-label="Minimizar ventana"
      />
      <Button
        round
        fill
        color="green"
        style={dotSize}
        onClick={() => window.electronAPI?.maximize()}
        aria-label="Maximizar ventana"
      />
    </div>
  );
}

export default TrafficLights;
