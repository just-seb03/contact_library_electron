import type { Client, Payment, CalendarEvent } from '../context/types'

/**
 * Servicio de base de datos para el renderer (React).
 * Se comunica exclusivamente a través de window.electronAPI (IPC),
 * evitando cualquier dependencia circular o importación de Node.js en el cliente.
 */
export const databaseService = {
  isElectronDbAvailable(): boolean {
    return typeof window !== 'undefined' && Boolean(window.electronAPI?.db)
  },

  async getClients(): Promise<Client[] | null> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.getClients()
      } catch (err) {
        console.error('Error al obtener clientes desde SQLite:', err)
      }
    }
    return null
  },

  async createClient(client: Omit<Client, 'id'>): Promise<Client | null> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.createClient(client)
      } catch (err) {
        console.error('Error al crear cliente en SQLite:', err)
      }
    }
    return null
  },

  async updateClient(id: number, data: Partial<Client>): Promise<Client | null> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.updateClient(id, data)
      } catch (err) {
        console.error('Error al actualizar cliente en SQLite:', err)
      }
    }
    return null
  },

  async deleteClient(id: number): Promise<boolean> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.deleteClient(id)
      } catch (err) {
        console.error('Error al eliminar cliente en SQLite:', err)
      }
    }
    return false
  },

  async saveAllClients(clients: Client[]): Promise<boolean> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.saveAllClients(clients)
      } catch (err) {
        console.error('Error al sincronizar clientes en SQLite:', err)
      }
    }
    return false
  },

  async getPayments(): Promise<Payment[] | null> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.getPayments()
      } catch (err) {
        console.error('Error al obtener pagos desde SQLite:', err)
      }
    }
    return null
  },

  async savePayments(payments: Payment[]): Promise<boolean> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.savePayments(payments)
      } catch (err) {
        console.error('Error al guardar pagos en SQLite:', err)
      }
    }
    return false
  },

  async getCalendarEvents(): Promise<CalendarEvent[] | null> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.getCalendarEvents()
      } catch (err) {
        console.error('Error al obtener eventos desde SQLite:', err)
      }
    }
    return null
  },

  async saveCalendarEvents(events: CalendarEvent[]): Promise<boolean> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.saveCalendarEvents(events)
      } catch (err) {
        console.error('Error al guardar eventos en SQLite:', err)
      }
    }
    return false
  },

  async getSettings(): Promise<Record<string, unknown> | null> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.getSettings()
      } catch (err) {
        console.error('Error al obtener configuración desde SQLite:', err)
      }
    }
    return null
  },

  async saveSettings(settings: Record<string, unknown>): Promise<boolean> {
    if (this.isElectronDbAvailable()) {
      try {
        return await window.electronAPI!.db!.saveSettings(settings)
      } catch (err) {
        console.error('Error al guardar configuración en SQLite:', err)
      }
    }
    return false
  },
}
