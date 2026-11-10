import path from 'node:path'
import fs from 'node:fs'
import { shell } from 'electron'
import { getDocumentsStoragePath } from '../database/connection'

export interface StoredDocumentMetadata {
  id: string
  clientId: number
  name: string
  fileName: string
  relativePath: string
  size: number
  mimeType: string
  uploadedAt: string
}

function sanitizeFileName(fileName: string): string {
  // Elimina caracteres ilegales en nombres de archivo de macOS / POSIX / Windows
  return fileName
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .trim()
}

/**
 * Servicio de almacenamiento local de documentos para escritorio (macOS / Windows / Linux).
 * Los archivos se guardan físicamente en la carpeta userData de la aplicación
 * (en macOS: ~/Library/Application Support/contact_library_electron/documents/)
 */
export const documentStorage = {
  getStorageDir(): string {
    return getDocumentsStoragePath()
  },

  getAbsolutePath(relativePath: string): string {
    return path.join(this.getStorageDir(), relativePath)
  },

  async saveDocumentFile(
    clientId: number,
    originalName: string,
    fileBuffer: Buffer
  ): Promise<StoredDocumentMetadata> {
    const storageDir = this.getStorageDir()
    const clientDir = path.join(storageDir, String(clientId))

    if (!fs.existsSync(clientDir)) {
      await fs.promises.mkdir(clientDir, { recursive: true })
    }

    const safeName = sanitizeFileName(originalName) || 'documento.pdf'
    const id = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const fileName = `${id}_${safeName}`
    const fullPath = path.join(clientDir, fileName)
    const relativePath = `${clientId}/${fileName}`

    await fs.promises.writeFile(fullPath, fileBuffer)

    const stats = await fs.promises.stat(fullPath)

    return {
      id,
      clientId,
      name: originalName,
      fileName,
      relativePath,
      size: stats.size,
      mimeType: originalName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    }
  },

  async deleteDocumentFile(relativePath: string): Promise<boolean> {
    try {
      const fullPath = this.getAbsolutePath(relativePath)
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath)
        return true
      }
      return false
    } catch (error) {
      console.error('[DocumentStorage] Error al eliminar archivo físico:', error)
      return false
    }
  },

  /**
   * Abre el documento con la aplicación predeterminada del sistema operativo.
   * En macOS abre Vista Previa (Preview).
   */
  async openDocumentWithSystem(relativePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const fullPath = this.getAbsolutePath(relativePath)
      if (!fs.existsSync(fullPath)) {
        return { success: false, error: 'El archivo no existe en el disco.' }
      }
      const errorMessage = await shell.openPath(fullPath)
      if (errorMessage) {
        return { success: false, error: errorMessage }
      }
      return { success: true }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido al abrir documento'
      return { success: false, error: message }
    }
  },

  /**
   * Revela y resalta el archivo directamente en el Finder de macOS (o Explorador de archivos).
   */
  async showInFinder(relativePath: string): Promise<boolean> {
    try {
      const fullPath = this.getAbsolutePath(relativePath)
      if (fs.existsSync(fullPath)) {
        shell.showItemInFolder(fullPath)
        return true
      }
      return false
    } catch (error) {
      console.error('[DocumentStorage] Error al mostrar archivo en Finder:', error)
      return false
    }
  },

  /**
   * Lee el archivo y lo devuelve como dataUrl base64 si el visor web lo requiere.
   */
  async readAsBase64(relativePath: string): Promise<string | null> {
    try {
      const fullPath = this.getAbsolutePath(relativePath)
      if (!fs.existsSync(fullPath)) return null
      const buffer = await fs.promises.readFile(fullPath)
      return `data:application/pdf;base64,${buffer.toString('base64')}`
    } catch (error) {
      console.error('[DocumentStorage] Error al leer archivo en base64:', error)
      return null
    }
  },
}
