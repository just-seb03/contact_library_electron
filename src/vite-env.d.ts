/// <reference types="vite/client" />

interface Window {
  electronAPI?: import('./shared/types/ipc').ElectronAPIContract;
}
