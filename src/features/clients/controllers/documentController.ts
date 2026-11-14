import { ipcMain } from 'electron'
import { documentRepository } from '../repositories/DocumentRepository'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
  type UploadDocumentDTO,
  type OpenDocumentDTO,
} from '../../../shared/types/ipc'
import type { ClientDocument } from '../../../core/context/types'

/**
 * Convierte un DataURL (base64) a Buffer de Node.js
 */
function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64Index = dataUrl.indexOf(';base64,')
  if (base64Index !== -1) {
    const base64Data = dataUrl.substring(base64Index + 8)
    return Buffer.from(base64Data, 'base64')
  }
  return Buffer.from(dataUrl)
}

export function registerDocumentController(): void {
  // 1. Obtener documentos de un cliente
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_GET_BY_CLIENT_ID,
    async (_event, clientId: number): Promise<IpcResponse<ClientDocument[]>> => {
      try {
        if (typeof clientId !== 'number' || isNaN(clientId)) {
          return createIpcError('El ID del cliente debe ser un número válido.')
        }
        const docs = await documentRepository.getByClientId(clientId)
        const mapped: ClientDocument[] = docs.map((d) => ({
          id: d.id,
          name: d.name,
          dataUrl: '',
          size: d.size,
          uploadedAt: d.uploadedAt,
        }))
        return createIpcSuccess(mapped)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 2. Subir y almacenar documento (soporta Buffer nativo o DataURL de FileReader)
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_UPLOAD,
    async (_event, dto: UploadDocumentDTO): Promise<IpcResponse<ClientDocument>> => {
      try {
        if (!dto || typeof dto.clientId !== 'number' || isNaN(dto.clientId)) {
          return createIpcError('ID de cliente inválido para la subida de documento.')
        }
        if (!dto.name || typeof dto.name !== 'string' || dto.name.trim() === '') {
          return createIpcError('El nombre del documento es obligatorio.')
        }

        let buffer: Buffer
        if (dto.fileBuffer) {
          buffer = Buffer.from(dto.fileBuffer as Uint8Array)
        } else if (dto.dataUrl) {
          buffer = dataUrlToBuffer(dto.dataUrl)
        } else {
          return createIpcError('Se debe proporcionar fileBuffer o dataUrl para el documento.')
        }

        const saved = await documentRepository.saveDocument(dto.clientId, dto.name.trim(), buffer)
        const clientDoc: ClientDocument = {
          id: saved.id,
          name: saved.name,
          dataUrl: dto.dataUrl || '',
          size: saved.size,
          uploadedAt: saved.uploadedAt,
        }
        return createIpcSuccess(clientDoc)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 3. Eliminar documento del almacenamiento y base de datos
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_DELETE,
    async (_event, id: string): Promise<IpcResponse<boolean>> => {
      try {
        if (!id || typeof id !== 'string') {
          return createIpcError('ID de documento no válido.')
        }
        const success = await documentRepository.deleteDocument(id)
        return createIpcSuccess(success)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 4. Abrir documento con visor nativo del SO
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_OPEN,
    async (_event, param: string | OpenDocumentDTO): Promise<IpcResponse<boolean>> => {
      try {
        const id = typeof param === 'string' ? param : param?.id
        if (!id) {
          return createIpcError('ID de documento requerido para abrirlo.')
        }
        const result = await documentRepository.openDocument(id)
        if (!result.success) {
          return createIpcError(result.error ?? 'No se pudo abrir el documento.')
        }
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 5. Revelar documento en Finder / Explorador de archivos
  ipcMain.handle(
    IPC_CHANNELS.DOCUMENTS_SHOW_IN_FINDER,
    async (_event, id: string): Promise<IpcResponse<boolean>> => {
      try {
        if (!id || typeof id !== 'string') {
          return createIpcError('ID de documento requerido.')
        }
        const success = await documentRepository.showInFinder(id)
        return createIpcSuccess(success)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // Canales heredados para compatibilidad
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
