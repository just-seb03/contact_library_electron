/**
 * @file clientController.ts
 * @description Controlador IPC para la gestión integral de clientes y expedientes judiciales.
 * Incluye validación de esquemas de entrada, operaciones atómicas en SQLite y respuestas tipadas.
 */

import { ipcMain } from 'electron'
import { clientRepository } from '../repositories/ClientRepository'
import { caseRepository, type CaseEntity } from '../repositories/CaseRepository'
import type { Client } from '../../../core/context/types'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
  type CreateClientDTO,
  type UpdateClientDTO,
  type ClientFiltersDTO,
  type UpsertCaseDTO,
} from '../../../shared/types/ipc'
import { formatPhone, isValidPhone } from '../../../shared/utils/phone'

/**
 * Registra todos los handlers IPC correspondientes al dominio de clientes y casos.
 */
export function registerClientController(): void {
  // [clients:list] - Recupera clientes con filtros opcionales (búsqueda, estado, paginación)
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_LIST,
    async (_event, filters?: ClientFiltersDTO): Promise<IpcResponse<Client[]>> => {
      try {
        const clients = await clientRepository.getAll(filters)
        return createIpcSuccess(clients)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [clients:getById] - Recupera un cliente por su ID numérico
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_GET_BY_ID,
    async (_event, id: number): Promise<IpcResponse<Client | null>> => {
      try {
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
          return createIpcError('ID de cliente inválido.')
        }
        const client = await clientRepository.getById(id)
        return createIpcSuccess(client)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [clients:create] - Inserción atómica en SQLite con validación estricta de campos obligatorios
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_CREATE,
    async (_event, clientData: CreateClientDTO): Promise<IpcResponse<Client>> => {
      try {
        if (!clientData || typeof clientData !== 'object') {
          return createIpcError('Los datos del cliente son requeridos.')
        }
        if (!clientData.name || typeof clientData.name !== 'string' || clientData.name.trim() === '') {
          return createIpcError('El nombre del cliente es obligatorio.')
        }
        if (!clientData.phone || typeof clientData.phone !== 'string' || clientData.phone.trim() === '') {
          return createIpcError('El teléfono del cliente es obligatorio.')
        }
        const normalizedPhone = formatPhone(clientData.phone)
        if (!normalizedPhone || !isValidPhone(clientData.phone)) {
          return createIpcError('El teléfono del cliente debe tener entre 7 y 15 dígitos.')
        }

        const created = await clientRepository.create({
          name: clientData.name.trim(),
          phone: normalizedPhone,
          email: clientData.email?.trim() || undefined,
          rut: clientData.rut?.trim() || undefined,
          status: clientData.status || 'activo',
          caso: clientData.caso,
        })
        return createIpcSuccess(created)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [clients:update] - Actualización parcial o total de datos del cliente
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_UPDATE,
    async (_event, id: number, clientData: UpdateClientDTO): Promise<IpcResponse<Client>> => {
      try {
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
          return createIpcError('ID de cliente inválido para actualización.')
        }
        if (!clientData || typeof clientData !== 'object') {
          return createIpcError('Datos de actualización no proporcionados.')
        }

        const sanitizedUpdate: UpdateClientDTO = { ...clientData }
        if (clientData.phone !== undefined) {
          if (typeof clientData.phone !== 'string') {
            return createIpcError('El teléfono del cliente no es válido.')
          }
          const normalizedPhone = formatPhone(clientData.phone)
          if (normalizedPhone && !isValidPhone(clientData.phone)) {
            return createIpcError('El teléfono del cliente debe tener entre 7 y 15 dígitos.')
          }
          sanitizedUpdate.phone = normalizedPhone
        }

        const updated = await clientRepository.update(id, sanitizedUpdate)
        return createIpcSuccess(updated)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [clients:delete] - Elimina el cliente en SQLite y purga sus archivos físicos de almacenamiento
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_DELETE,
    async (_event, id: number): Promise<IpcResponse<boolean>> => {
      try {
        if (typeof id !== 'number' || isNaN(id) || id <= 0) {
          return createIpcError('ID de cliente inválido para eliminación.')
        }
        const success = await clientRepository.delete(id)
        return createIpcSuccess(success)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [clients:saveAll] - Sincronización masiva de clientes en SQLite
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_SAVE_ALL,
    async (_event, clients: Client[]): Promise<IpcResponse<boolean>> => {
      try {
        if (!Array.isArray(clients)) {
          return createIpcError('Se esperaba una lista de clientes.')
        }
        for (const client of clients) {
          if (client.id) {
            const existing = await clientRepository.getById(client.id)
            if (existing) {
              await clientRepository.update(client.id, client)
            } else {
              await clientRepository.create(client)
            }
          } else {
            await clientRepository.create(client)
          }
        }
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [cases:getByClientId] - Consulta expediente judicial asociado al cliente
  ipcMain.handle(
    IPC_CHANNELS.CASES_GET_BY_CLIENT_ID,
    async (_event, clientId: number): Promise<IpcResponse<CaseEntity | null>> => {
      try {
        if (typeof clientId !== 'number' || isNaN(clientId) || clientId <= 0) {
          return createIpcError('ID de cliente inválido.')
        }
        const caseData = await caseRepository.getByClientId(clientId)
        return createIpcSuccess(caseData)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // [cases:upsert] - Inserta o actualiza expediente judicial para un cliente
  ipcMain.handle(
    IPC_CHANNELS.CASES_UPSERT,
    async (_event, clientId: number, caseData: UpsertCaseDTO): Promise<IpcResponse<CaseEntity>> => {
      try {
        if (typeof clientId !== 'number' || isNaN(clientId) || clientId <= 0) {
          return createIpcError('ID de cliente inválido.')
        }
        if (!caseData || typeof caseData !== 'object') {
          return createIpcError('Datos de expediente requeridos.')
        }
        const result = await caseRepository.upsert(clientId, caseData)
        return createIpcSuccess(result)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // --- Handlers de retrocompatibilidad transitoria ---
  ipcMain.handle('db:clients:getAll', async (_event, filters?: ClientFiltersDTO) => {
    return clientRepository.getAll(filters)
  })

  ipcMain.handle('db:clients:getById', async (_event, id: number) => {
    return clientRepository.getById(id)
  })

  ipcMain.handle('db:clients:create', async (_event, clientData: CreateClientDTO) => {
    return clientRepository.create({
      name: clientData.name,
      phone: clientData.phone,
      email: clientData.email,
      rut: clientData.rut,
      status: clientData.status,
      caso: clientData.caso,
    })
  })

  ipcMain.handle('db:clients:update', async (_event, id: number, clientData: UpdateClientDTO) => {
    return clientRepository.update(id, clientData)
  })

  ipcMain.handle('db:clients:delete', async (_event, id: number) => {
    return clientRepository.delete(id)
  })

  ipcMain.handle('db:clients:saveAll', async (_event, clients: Client[]) => {
    for (const client of clients) {
      if (client.id) {
        const existing = await clientRepository.getById(client.id)
        if (existing) {
          await clientRepository.update(client.id, client)
        } else {
          await clientRepository.create(client)
        }
      } else {
        await clientRepository.create(client)
      }
    }
    return true
  })

  ipcMain.handle('db:cases:getByClientId', async (_event, clientId: number) => {
    return caseRepository.getByClientId(clientId)
  })

  ipcMain.handle('db:cases:upsert', async (_event, clientId: number, caseData: UpsertCaseDTO) => {
    return caseRepository.upsert(clientId, caseData)
  })
}
