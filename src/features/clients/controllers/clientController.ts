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

export function registerClientController(): void {
  // 1. Obtener todos los clientes (con sus relaciones de casos y documentos)
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

  // 2. Obtener cliente por ID
  ipcMain.handle(
    IPC_CHANNELS.CLIENTS_GET_BY_ID,
    async (_event, id: number): Promise<IpcResponse<Client | null>> => {
      try {
        if (typeof id !== 'number' || isNaN(id)) {
          return createIpcError('ID de cliente inválido.')
        }
        const client = await clientRepository.getById(id)
        return createIpcSuccess(client)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 3. Crear cliente atómicamente con validación rigurosa
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

        const created = await clientRepository.create({
          name: clientData.name.trim(),
          phone: clientData.phone.trim(),
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

  // 4. Actualizar cliente con validación
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

        const updated = await clientRepository.update(id, clientData)
        return createIpcSuccess(updated)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 5. Eliminar cliente y limpiar archivos
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

  // 6. Guardar lote de clientes
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

  // 7. Gestión de casos judiciales
  ipcMain.handle(
    IPC_CHANNELS.CASES_GET_BY_CLIENT_ID,
    async (_event, clientId: number): Promise<IpcResponse<CaseEntity | null>> => {
      try {
        if (typeof clientId !== 'number' || isNaN(clientId)) {
          return createIpcError('ID de cliente inválido.')
        }
        const caseData = await caseRepository.getByClientId(clientId)
        return createIpcSuccess(caseData)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  ipcMain.handle(
    IPC_CHANNELS.CASES_UPSERT,
    async (_event, clientId: number, caseData: UpsertCaseDTO): Promise<IpcResponse<CaseEntity>> => {
      try {
        if (typeof clientId !== 'number' || isNaN(clientId)) {
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

  // --- Handlers heredados para compatibilidad ---
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
