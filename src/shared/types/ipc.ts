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
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',
  CLIENTS_SAVE_ALL: 'clients:saveAll',

  // Documentos
  DOCUMENTS_UPLOAD: 'documents:upload',
  DOCUMENTS_OPEN: 'documents:open',

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
export type UpdateClientDTO = { id: number; data: Partial<Client> }
export type DeleteClientDTO = { id: number }

/**
 * Tipos de entrada para operaciones de documentos
 */
export interface UploadDocumentDTO {
  clientId: number
  document: ClientDocument
}

export interface OpenDocumentDTO {
  dataUrl?: string
  filePath?: string
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
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
    getPlatform: () => Promise<IpcResponse<string>>
  }
  clients: {
    list: () => Promise<IpcResponse<Client[]>>
    create: (client: CreateClientDTO) => Promise<IpcResponse<Client>>
    update: (id: number, data: Partial<Client>) => Promise<IpcResponse<Client>>
    delete: (id: number) => Promise<IpcResponse<boolean>>
    saveAll: (clients: Client[]) => Promise<IpcResponse<boolean>>
  }
  documents: {
    upload: (clientId: number, document: ClientDocument) => Promise<IpcResponse<ClientDocument>>
    open: (document: OpenDocumentDTO) => Promise<IpcResponse<boolean>>
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
