import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),

  // Base de datos (SQLite)
  db: {
    getClients: () => ipcRenderer.invoke('db:clients:getAll'),
    createClient: (client: any) => ipcRenderer.invoke('db:clients:create', client),
    updateClient: (id: number, data: any) => ipcRenderer.invoke('db:clients:update', id, data),
    deleteClient: (id: number) => ipcRenderer.invoke('db:clients:delete', id),
    saveAllClients: (clients: any[]) => ipcRenderer.invoke('db:clients:saveAll', clients),

    getPayments: () => ipcRenderer.invoke('db:payments:getAll'),
    savePayments: (payments: any[]) => ipcRenderer.invoke('db:payments:saveAll', payments),

    getCalendarEvents: () => ipcRenderer.invoke('db:calendar:getAll'),
    saveCalendarEvents: (events: any[]) => ipcRenderer.invoke('db:calendar:saveAll', events),

    getSettings: () => ipcRenderer.invoke('db:settings:getAll'),
    saveSettings: (settings: Record<string, any>) => ipcRenderer.invoke('db:settings:saveAll', settings),
  },
})

// Mantenemos la configuración por defecto que Electron-Vite suele requerir
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})