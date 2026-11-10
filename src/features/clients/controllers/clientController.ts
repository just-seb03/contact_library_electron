import { ipcMain } from 'electron'
import { clientRepository } from '../repositories/ClientRepository'
import { caseRepository } from '../repositories/CaseRepository'
import { documentRepository } from '../repositories/DocumentRepository'
import type { Client } from '../../../core/context/types'

export function registerClientController(): void {
  // 1. Obtener todos los clientes (con sus relaciones de casos y documentos)
  ipcMain.handle('db:clients:getAll', async (_event, filters) => {
    return clientRepository.getAll(filters)
  })

  // 2. Obtener cliente por ID
  ipcMain.handle('db:clients:getById', async (_event, id: number) => {
    return clientRepository.getById(id)
  })

  // 3. Crear cliente atómicamente
  ipcMain.handle('db:clients:create', async (_event, clientData: any) => {
    return clientRepository.create({
      name: clientData.name,
      phone: clientData.phone,
      email: clientData.email,
      rut: clientData.rut,
      status: clientData.status,
      caso: clientData.caso,
    })
  })

  // 4. Actualizar cliente atómicamente
  ipcMain.handle('db:clients:update', async (_event, id: number, clientData: any) => {
    return clientRepository.update(id, clientData)
  })

  // 5. Eliminar cliente y limpiar archivos de disco de forma segura
  ipcMain.handle('db:clients:delete', async (_event, id: number) => {
    return clientRepository.delete(id)
  })

  // 6. Compatibilidad no destructiva para migraciones frontend
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

  // 7. Gestión de casos
  ipcMain.handle('db:cases:getByClientId', async (_event, clientId: number) => {
    return caseRepository.getByClientId(clientId)
  })

  ipcMain.handle('db:cases:upsert', async (_event, clientId: number, caseData: any) => {
    return caseRepository.upsert(clientId, caseData)
  })

  // 8. Gestión de documentos
  ipcMain.handle('db:documents:getByClientId', async (_event, clientId: number) => {
    return documentRepository.getByClientId(clientId)
  })

  ipcMain.handle(
    'db:documents:upload',
    async (_event, { clientId, originalName, fileBuffer }: { clientId: number; originalName: string; fileBuffer: Uint8Array }) => {
      const buffer = Buffer.from(fileBuffer)
      return documentRepository.saveDocument(clientId, originalName, buffer)
    }
  )

  ipcMain.handle('db:documents:delete', async (_event, id: string) => {
    return documentRepository.deleteDocument(id)
  })

  ipcMain.handle('db:documents:open', async (_event, id: string) => {
    return documentRepository.openDocument(id)
  })

  ipcMain.handle('db:documents:showInFinder', async (_event, id: string) => {
    return documentRepository.showInFinder(id)
  })
}
