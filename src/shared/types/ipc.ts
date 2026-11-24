import type { Client, Payment, CalendarEvent, ClientDocument } from '../../core/context/types'
import type { AppSettings } from '../../features/settings/data/settingsData'

/**
 * Estándar de respuesta estricta para todos los canales IPC.
 * Todas las llamadas entre Frontend y Backend devuelven esta firma.
 */
export interface IpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Catálogo unificado y estandarizado de canales IPC.
 * Nombres estructurados por dominio:acción.
 */
export const IPC_CHANNELS = {
  // Clientes
  CLIENTS_LIST: 'clients:list',
  CLIENTS_GET_BY_ID: 'clients:getById',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',
  CLIENTS_SAVE_ALL: 'clients:saveAll',

  // Casos judiciales
  CASES_GET_BY_CLIENT_ID: 'cases:getByClientId',
  CASES_UPSERT: 'cases:upsert',

  // Documentos
  DOCUMENTS_GET_BY_CLIENT_ID: 'documents:getByClientId',
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_DELETE: 'documents:delete',
  DOCUMENTS_OPEN: 'documents:open',
  DOCUMENTS_SHOW_IN_FINDER: 'documents:showInFinder',

  // Pagos
  PAYMENTS_LIST: 'payments:list',
  PAYMENTS_SAVE_ALL: 'payments:saveAll',

  // Calendario
  CALENDAR_LIST: 'calendar:list',
  CALENDAR_SAVE_ALL: 'calendar:saveAll',

  // Configuración
  SETTINGS_GET: 'settings:get',
  SETTINGS_SAVE_ALL: 'settings:saveAll',

  // Ventana y Sistema
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  APP_GET_PLATFORM: 'app:getPlatform',
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

/**
 * Tipos de entrada para operaciones de clientes
 */
export type CreateClientDTO = Omit<Client, 'id'>
export type UpdateClientDTO = Partial<Omit<Client, 'id'>>
export interface ClientFiltersDTO {
  search?: string
  status?: Client['status']
  limit?: number
  offset?: number
}

/**
 * Tipos de entrada para operaciones de documentos
 */
export interface UploadDocumentDTO {
  clientId: number
  name: string
  fileBuffer?: Uint8Array | number[] | ArrayBuffer
  dataUrl?: string
  size?: number
}

export interface OpenDocumentDTO {
  id?: string
  filePath?: string
  relativePath?: string
}

/**
 * Tipos de entrada para casos judiciales
 */
export interface UpsertCaseDTO {
  expediente: string
  juzgado: string
  materia: string
  estado: string
  proximaAudiencia?: string
}

/**
 * Tipos de entrada para pagos, calendario y configuración
 */
export type SavePaymentsDTO = Payment[]
export type SaveCalendarEventsDTO = CalendarEvent[]
export type SaveSettingsDTO = Partial<AppSettings> | Record<string, unknown>

/**
 * Contrato riguroso de la API expuesta por Preload en window.electronAPI
 */
export interface ElectronAPIContract {
  minimize: () => void
  maximize: () => void
  close: () => void
  getPlatform: () => Promise<string>
  onNavigate?: (callback: (route: string) => void) => () => void
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
    getPlatform: () => Promise<IpcResponse<string>>
  }
  clients: {
    list: (filters?: ClientFiltersDTO) => Promise<IpcResponse<Client[]>>
    getById: (id: number) => Promise<IpcResponse<Client | null>>
    create: (client: CreateClientDTO) => Promise<IpcResponse<Client>>
    update: (id: number, data: UpdateClientDTO) => Promise<IpcResponse<Client>>
    delete: (id: number) => Promise<IpcResponse<boolean>>
    saveAll: (clients: Client[]) => Promise<IpcResponse<boolean>>
  }
  cases: {
    getByClientId: (clientId: number) => Promise<IpcResponse<unknown>>
    upsert: (clientId: number, data: UpsertCaseDTO) => Promise<IpcResponse<unknown>>
  }
  documents: {
    getByClientId: (clientId: number) => Promise<IpcResponse<ClientDocument[]>>
    upload: (dto: UploadDocumentDTO) => Promise<IpcResponse<ClientDocument>>
    delete: (id: string) => Promise<IpcResponse<boolean>>
    open: (param: string | OpenDocumentDTO) => Promise<IpcResponse<boolean>>
    showInFinder: (id: string) => Promise<IpcResponse<boolean>>
  }
  payments: {
    list: () => Promise<IpcResponse<Payment[]>>
    saveAll: (payments: Payment[]) => Promise<IpcResponse<boolean>>
  }
  calendar: {
    list: () => Promise<IpcResponse<CalendarEvent[]>>
    saveAll: (events: CalendarEvent[]) => Promise<IpcResponse<boolean>>
  }
  settings: {
    get: () => Promise<IpcResponse<Record<string, unknown>>>
    saveAll: (settings: SaveSettingsDTO) => Promise<IpcResponse<boolean>>
  }
  db?: {
    getClients: () => Promise<Client[]>
    createClient: (client: CreateClientDTO) => Promise<Client>
    updateClient: (id: number, data: UpdateClientDTO) => Promise<Client>
    deleteClient: (id: number) => Promise<boolean>
    saveAllClients: (clients: Client[]) => Promise<boolean>
    getPayments: () => Promise<Payment[]>
    savePayments: (payments: Payment[]) => Promise<boolean>
    getCalendarEvents: () => Promise<CalendarEvent[]>
    saveCalendarEvents: (events: CalendarEvent[]) => Promise<boolean>
    getSettings: () => Promise<Record<string, unknown>>
    saveSettings: (settings: SaveSettingsDTO) => Promise<boolean>
  }
}

/**
 * Helper para construir respuestas IPC exitosas
 */
export function createIpcSuccess<T>(data: T): IpcResponse<T> {
  return { success: true, data }
}

/**
 * Helper para construir respuestas IPC con error
 */
export function createIpcError<T = never>(error: unknown): IpcResponse<T> {
  const message = error instanceof Error ? error.message : String(error)
  return { success: false, error: message }
}
