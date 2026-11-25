import { ipcRenderer, contextBridge } from 'electron'
import {
  IPC_CHANNELS,
  type CreateClientDTO,
  type UpdateClientDTO,
  type ClientFiltersDTO,
  type UploadDocumentDTO,
  type OpenDocumentDTO,
  type UpsertCaseDTO,
  type SaveSettingsDTO,
  type SetThemeDTO,
  type IpcResponse,
  type ElectronAPIContract,
} from './shared/types/ipc'
import type { Client, Payment, CalendarEvent, ClientDocument } from './core/context/types'

/**
 * Exposición estrictamente tipada y segura al Renderer Process.
 * Erradica el uso de 'any' y evita la exposición de módulos de Node o ipcRenderer genérico.
 */
const electronAPI: ElectronAPIContract = {
  // Controles de ventana
  minimize: (): void => {
    ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE)
  },
  maximize: (): void => {
    ipcRenderer.send(IPC_CHANNELS.WINDOW_MAXIMIZE)
  },
  close: (): void => {
    ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE)
  },
  getPlatform: async (): Promise<string> => {
    const res: IpcResponse<string> = await ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM)
    return res.data ?? process.platform
  },
  setTheme: (dto: SetThemeDTO): void => {
    ipcRenderer.send(IPC_CHANNELS.APP_SET_THEME, dto)
  },
  onNavigate: (callback: (route: string) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, route: string) => callback(route)
    ipcRenderer.on('app:navigate', handler)
    return () => {
      ipcRenderer.removeListener('app:navigate', handler)
    }
  },

  // Namespace: Ventana
  window: {
    minimize: (): void => {
      ipcRenderer.send(IPC_CHANNELS.WINDOW_MINIMIZE)
    },
    maximize: (): void => {
      ipcRenderer.send(IPC_CHANNELS.WINDOW_MAXIMIZE)
    },
    close: (): void => {
      ipcRenderer.send(IPC_CHANNELS.WINDOW_CLOSE)
    },
    getPlatform: (): Promise<IpcResponse<string>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.APP_GET_PLATFORM)
    },
  },

  // Namespace: Clientes
  clients: {
    list: (filters?: ClientFiltersDTO): Promise<IpcResponse<Client[]>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_LIST, filters)
    },
    getById: (id: number): Promise<IpcResponse<Client | null>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_GET_BY_ID, id)
    },
    create: (client: CreateClientDTO): Promise<IpcResponse<Client>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_CREATE, client)
    },
    update: (id: number, data: UpdateClientDTO): Promise<IpcResponse<Client>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_UPDATE, id, data)
    },
    delete: (id: number): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_DELETE, id)
    },
    saveAll: (clients: Client[]): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_SAVE_ALL, clients)
    },
  },

  // Namespace: Casos Judiciales
  cases: {
    getByClientId: (clientId: number): Promise<IpcResponse<unknown>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CASES_GET_BY_CLIENT_ID, clientId)
    },
    upsert: (clientId: number, data: UpsertCaseDTO): Promise<IpcResponse<unknown>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CASES_UPSERT, clientId, data)
    },
  },

  // Namespace: Documentos
  documents: {
    getByClientId: (clientId: number): Promise<IpcResponse<ClientDocument[]>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_GET_BY_CLIENT_ID, clientId)
    },
    upload: (dto: UploadDocumentDTO): Promise<IpcResponse<ClientDocument>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_UPLOAD, dto)
    },
    delete: (id: string): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_DELETE, id)
    },
    open: (param: string | OpenDocumentDTO): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_OPEN, param)
    },
    showInFinder: (id: string): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_SHOW_IN_FINDER, id)
    },
  },

  // Namespace: Pagos
  payments: {
    list: (): Promise<IpcResponse<Payment[]>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_LIST)
    },
    saveAll: (payments: Payment[]): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_SAVE_ALL, payments)
    },
  },

  // Namespace: Calendario
  calendar: {
    list: (): Promise<IpcResponse<CalendarEvent[]>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_LIST)
    },
    saveAll: (events: CalendarEvent[]): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_SAVE_ALL, events)
    },
  },

  // Namespace: Configuración
  settings: {
    get: (): Promise<IpcResponse<Record<string, unknown>>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET)
    },
    saveAll: (settings: SaveSettingsDTO): Promise<IpcResponse<boolean>> => {
      return ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_ALL, settings)
    },
  },

  // Namespace: Base de Datos (Compatibilidad de transición con databaseService)
  db: {
    getClients: async (): Promise<Client[]> => {
      const res: IpcResponse<Client[]> = await ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_LIST)
      if (!res.success) throw new Error(res.error ?? 'Error al obtener clientes')
      return res.data ?? []
    },
    createClient: async (client: CreateClientDTO): Promise<Client> => {
      const res: IpcResponse<Client> = await ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_CREATE, client)
      if (!res.success || !res.data) throw new Error(res.error ?? 'Error al crear cliente')
      return res.data
    },
    updateClient: async (id: number, data: UpdateClientDTO): Promise<Client> => {
      const res: IpcResponse<Client> = await ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_UPDATE, id, data)
      if (!res.success || !res.data) throw new Error(res.error ?? 'Error al actualizar cliente')
      return res.data
    },
    deleteClient: async (id: number): Promise<boolean> => {
      const res: IpcResponse<boolean> = await ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_DELETE, id)
      if (!res.success) throw new Error(res.error ?? 'Error al eliminar cliente')
      return res.data ?? true
    },
    saveAllClients: async (clients: Client[]): Promise<boolean> => {
      const res: IpcResponse<boolean> = await ipcRenderer.invoke(IPC_CHANNELS.CLIENTS_SAVE_ALL, clients)
      if (!res.success) throw new Error(res.error ?? 'Error al guardar clientes')
      return res.data ?? true
    },
    getPayments: async (): Promise<Payment[]> => {
      const res: IpcResponse<Payment[]> = await ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_LIST)
      if (!res.success) throw new Error(res.error ?? 'Error al obtener pagos')
      return res.data ?? []
    },
    savePayments: async (payments: Payment[]): Promise<boolean> => {
      const res: IpcResponse<boolean> = await ipcRenderer.invoke(IPC_CHANNELS.PAYMENTS_SAVE_ALL, payments)
      if (!res.success) throw new Error(res.error ?? 'Error al guardar pagos')
      return res.data ?? true
    },
    getCalendarEvents: async (): Promise<CalendarEvent[]> => {
      const res: IpcResponse<CalendarEvent[]> = await ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_LIST)
      if (!res.success) throw new Error(res.error ?? 'Error al obtener eventos de calendario')
      return res.data ?? []
    },
    saveCalendarEvents: async (events: CalendarEvent[]): Promise<boolean> => {
      const res: IpcResponse<boolean> = await ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_SAVE_ALL, events)
      if (!res.success) throw new Error(res.error ?? 'Error al guardar eventos de calendario')
      return res.data ?? true
    },
    getSettings: async (): Promise<Record<string, unknown>> => {
      const res: IpcResponse<Record<string, unknown>> = await ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET)
      if (!res.success) throw new Error(res.error ?? 'Error al obtener configuraciones')
      return res.data ?? {}
    },
    saveSettings: async (settings: SaveSettingsDTO): Promise<boolean> => {
      const res: IpcResponse<boolean> = await ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE_ALL, settings)
      if (!res.success) throw new Error(res.error ?? 'Error al guardar configuraciones')
      return res.data ?? true
    },
  },
}

// Única exposición segura al frontend: sin ipcRenderer genérico ni APIs de Node
contextBridge.exposeInMainWorld('electronAPI', electronAPI)
