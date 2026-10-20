import { Button, Icon } from 'framework7-react';
import type { CSSProperties } from 'react';

interface ElectronRegionStyle extends CSSProperties {
  WebkitAppRegion: 'drag' | 'no-drag';
}

const noDragStyle: ElectronRegionStyle = { WebkitAppRegion: 'no-drag' };

/**
 * Botones de control de ventana estilo Windows (minimizar, maximizar, cerrar)
 * implementados con componentes Framework7.
 */
export function WindowsControls() {
  const containerStyle: CSSProperties = {
    ...noDragStyle,
    display: 'inline-flex',
    alignItems: 'center',
  };

  return (
    <div style={containerStyle}>
      <Button onClick={() => window.electronAPI?.minimize()} aria-label="Minimizar ventana">
        <Icon f7="minus" />
      </Button>
      <Button onClick={() => window.electronAPI?.maximize()} aria-label="Maximizar ventana">
        <Icon f7="square" />
      </Button>
      <Button onClick={() => window.electronAPI?.close()} aria-label="Cerrar ventana">
        <Icon f7="xmark" />
      </Button>
    </div>
  );
}

export default WindowsControls;
