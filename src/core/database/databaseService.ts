/**
 * @file databaseService.ts
 * @description Servicio de base de datos e IPC para el frontend (React).
 * Se comunica exclusivamente a través de window.electronAPI usando los contratos tipados
 * y procesa de forma centralizada las respuestas estandarizadas IpcResponse<T>.
 */

import type { Client, Payment, CalendarEvent, ClientDocument } from '../context/types'
import type {
  CreateClientDTO,
  UpdateClientDTO,
  UploadDocumentDTO,
  SaveSettingsDTO,
} from '../../shared/types/ipc'

export const databaseService = {
  /**
   * Determina si la API de Electron está disponible en el entorno de ejecución
   */
  isElectronDbAvailable(): boolean {
    return (
      typeof window !== 'undefined' &&
      Boolean(window.electronAPI?.clients || window.electronAPI?.db)
    )
  },

  // ==========================================
  // CLIENTES
  // ==========================================

  async getClients(): Promise<Client[] | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.clients?.list) {
        const res = await api.clients.list()
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al obtener clientes:', res.error)
      } else if (api?.db?.getClients) {
        return await api.db.getClients()
      }
    } catch (err) {
      console.error('Excepción al obtener clientes desde SQLite:', err)
    }
    return null
  },

  async createClient(client: CreateClientDTO): Promise<Client | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.clients?.create) {
        const res = await api.clients.create(client)
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al crear cliente:', res.error)
      } else if (api?.db?.createClient) {
        return await api.db.createClient(client)
      }
    } catch (err) {
      console.error('Excepción al crear cliente en SQLite:', err)
    }
    return null
  },

  async updateClient(id: number, data: UpdateClientDTO): Promise<Client | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.clients?.update) {
        const res = await api.clients.update(id, data)
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al actualizar cliente:', res.error)
      } else if (api?.db?.updateClient) {
        return await api.db.updateClient(id, data)
      }
    } catch (err) {
      console.error('Excepción al actualizar cliente en SQLite:', err)
    }
    return null
  },

  async deleteClient(id: number): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.clients?.delete) {
        const res = await api.clients.delete(id)
        if (res.success) return res.data ?? true
        if (res.error) console.error('Error al eliminar cliente:', res.error)
      } else if (api?.db?.deleteClient) {
        return await api.db.deleteClient(id)
      }
    } catch (err) {
      console.error('Excepción al eliminar cliente en SQLite:', err)
    }
    return false
  },

  async saveAllClients(clients: Client[]): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.clients?.saveAll) {
        const res = await api.clients.saveAll(clients)
        if (res.success) return res.data ?? true
        if (res.error) console.error('Error al sincronizar clientes:', res.error)
      } else if (api?.db?.saveAllClients) {
        return await api.db.saveAllClients(clients)
      }
    } catch (err) {
      console.error('Excepción al sincronizar clientes en SQLite:', err)
    }
    return false
  },

  // ==========================================
  // DOCUMENTOS
  // ==========================================

  async uploadDocument(dto: UploadDocumentDTO): Promise<ClientDocument | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.documents?.upload) {
        const res = await api.documents.upload(dto)
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al subir documento:', res.error)
      }
    } catch (err) {
      console.error('Excepción al subir documento:', err)
    }
    return null
  },

  async openDocument(id: string): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.documents?.open) {
        const res = await api.documents.open(id)
        if (res.success) return res.data ?? true
        if (!res.success && res.error) console.error('Error al abrir documento:', res.error)
      }
    } catch (err) {
      console.error('Excepción al abrir documento:', err)
    }
    return false
  },

  async deleteDocument(id: string): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.documents?.delete) {
        const res = await api.documents.delete(id)
        if (res.success) return res.data ?? true
        if (!res.success && res.error) console.error('Error al eliminar documento:', res.error)
      }
    } catch (err) {
      console.error('Excepción al eliminar documento:', err)
    }
    return false
  },

  async getClientDocuments(clientId: number): Promise<ClientDocument[] | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.documents?.getByClientId) {
        const res = await api.documents.getByClientId(clientId)
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al obtener documentos:', res.error)
      }
    } catch (err) {
      console.error('Excepción al obtener documentos del cliente:', err)
    }
    return null
  },

  // ==========================================
  // PAGOS
  // ==========================================

  async getPayments(): Promise<Payment[] | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.payments?.list) {
        const res = await api.payments.list()
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al obtener pagos:', res.error)
      } else if (api?.db?.getPayments) {
        return await api.db.getPayments()
      }
    } catch (err) {
      console.error('Excepción al obtener pagos desde SQLite:', err)
    }
    return null
  },

  async savePayments(payments: Payment[]): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.payments?.saveAll) {
        const res = await api.payments.saveAll(payments)
        if (res.success) return res.data ?? true
        if (res.error) console.error('Error al guardar pagos:', res.error)
      } else if (api?.db?.savePayments) {
        return await api.db.savePayments(payments)
      }
    } catch (err) {
      console.error('Excepción al guardar pagos en SQLite:', err)
    }
    return false
  },

  // ==========================================
  // CALENDARIO
  // ==========================================

  async getCalendarEvents(): Promise<CalendarEvent[] | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.calendar?.list) {
        const res = await api.calendar.list()
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al obtener eventos de calendario:', res.error)
      } else if (api?.db?.getCalendarEvents) {
        return await api.db.getCalendarEvents()
      }
    } catch (err) {
      console.error('Excepción al obtener eventos desde SQLite:', err)
    }
    return null
  },

  async saveCalendarEvents(events: CalendarEvent[]): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.calendar?.saveAll) {
        const res = await api.calendar.saveAll(events)
        if (res.success) return res.data ?? true
        if (res.error) console.error('Error al guardar eventos de calendario:', res.error)
      } else if (api?.db?.saveCalendarEvents) {
        return await api.db.saveCalendarEvents(events)
      }
    } catch (err) {
      console.error('Excepción al guardar eventos en SQLite:', err)
    }
    return false
  },

  // ==========================================
  // CONFIGURACIÓN
  // ==========================================

  async getSettings(): Promise<Record<string, unknown> | null> {
    if (!this.isElectronDbAvailable()) return null
    try {
      const api = window.electronAPI
      if (api?.settings?.get) {
        const res = await api.settings.get()
        if (res.success && res.data) return res.data
        if (!res.success && res.error) console.error('Error al obtener configuración:', res.error)
      } else if (api?.db?.getSettings) {
        return await api.db.getSettings()
      }
    } catch (err) {
      console.error('Excepción al obtener configuración desde SQLite:', err)
    }
    return null
  },

  async saveSettings(settings: SaveSettingsDTO): Promise<boolean> {
    if (!this.isElectronDbAvailable()) return false
    try {
      const api = window.electronAPI
      if (api?.settings?.saveAll) {
        const res = await api.settings.saveAll(settings)
        if (res.success) return res.data ?? true
        if (res.error) console.error('Error al guardar configuración:', res.error)
      } else if (api?.db?.saveSettings) {
        return await api.db.saveSettings(settings)
      }
    } catch (err) {
      console.error('Excepción al guardar configuración en SQLite:', err)
    }
    return false
  },
}
