import fs from 'node:fs'
import path from 'node:path'
import { getDatabase } from '../../../core/database/connection'
import { documentStorage } from '../../../core/storage/documentStorage'

export interface DocumentRow {
  id: string
  client_id: number
  name: string
  file_name: string
  relative_path: string
  size: number
  mime_type: string
  uploaded_at: string
}

export interface DocumentEntity {
  id: string
  clientId: number
  name: string
  fileName: string
  relativePath: string
  size: number
  mimeType: string
  uploadedAt: string
}

export class DocumentRepository {
  private toEntity(row: DocumentRow): DocumentEntity {
    return {
      id: row.id,
      clientId: row.client_id,
      name: row.name,
      fileName: row.file_name,
      relativePath: row.relative_path,
      size: row.size,
      mimeType: row.mime_type,
      uploadedAt: row.uploaded_at,
    }
  }

  async getByClientId(clientId: number): Promise<DocumentEntity[]> {
    const db = getDatabase()
    const rows = await db
      .prepare('SELECT * FROM documents WHERE client_id = ? ORDER BY uploaded_at DESC')
      .all<DocumentRow>(clientId)
    return rows.map((r) => this.toEntity(r))
  }

  async getById(id: string): Promise<DocumentEntity | null> {
    const db = getDatabase()
    const row = await db.prepare('SELECT * FROM documents WHERE id = ?').get<DocumentRow>(id)
    return row ? this.toEntity(row) : null
  }

  /**
   * Guarda físicamente el archivo en disco (userData/documents/{clientId}) y registra sus metadatos en SQLite.
   * Si la inserción en la base de datos falla, elimina el archivo físico para evitar residuos.
   */
  async saveDocument(
    clientId: number,
    originalName: string,
    fileBuffer: Buffer
  ): Promise<DocumentEntity> {
    const db = getDatabase()

    // 1. Guardar físicamente en disco usando documentStorage
    const stored = await documentStorage.saveDocumentFile(clientId, originalName, fileBuffer)

    try {
      // 2. Registrar metadatos en SQLite
      await db.prepare(`
        INSERT INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        stored.id,
        clientId,
        stored.name,
        stored.fileName,
        stored.relativePath,
        stored.size,
        stored.mimeType,
        stored.uploadedAt
      )

      return {
        id: stored.id,
        clientId,
        name: stored.name,
        fileName: stored.fileName,
        relativePath: stored.relativePath,
        size: stored.size,
        mimeType: stored.mimeType,
        uploadedAt: stored.uploadedAt,
      }
    } catch (dbError) {
      // Compensating action: revertir guardado físico si la base de datos rechaza la inserción
      await documentStorage.deleteDocumentFile(stored.relativePath)
      throw dbError
    }
  }

  /**
   * Registra metadata de un documento que ya fue guardado o importado físicamente
   */
  async registerDocumentMetadata(
    id: string,
    clientId: number,
    name: string,
    fileName: string,
    relativePath: string,
    size: number,
    mimeType = 'application/pdf',
    uploadedAt = new Date().toISOString()
  ): Promise<DocumentEntity> {
    const db = getDatabase()
    await db.prepare(`
      INSERT OR REPLACE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, clientId, name, fileName, relativePath, size, mimeType, uploadedAt)

    return {
      id,
      clientId,
      name,
      fileName,
      relativePath,
      size,
      mimeType,
      uploadedAt,
    }
  }

  /**
   * Elimina el documento de la base de datos y borra físicamente el archivo del disco.
   */
  async deleteDocument(id: string): Promise<boolean> {
    const db = getDatabase()
    const doc = await this.getById(id)
    if (!doc) return false

    // Eliminar de base de datos
    await db.prepare('DELETE FROM documents WHERE id = ?').run(id)

    // Eliminar archivo físico
    await documentStorage.deleteDocumentFile(doc.relativePath)
    return true
  }

  /**
   * Limpia todos los archivos físicos de un cliente en disco.
   * Utilizado cuando se elimina un cliente o su carpeta.
   */
  async cleanClientStorageFolder(clientId: number): Promise<void> {
    try {
      const storageDir = documentStorage.getStorageDir()
      const clientDir = path.join(storageDir, String(clientId))
      if (fs.existsSync(clientDir)) {
        await fs.promises.rm(clientDir, { recursive: true, force: true })
      }
    } catch (error) {
      console.error(`[DocumentRepository] Error al limpiar directorio del cliente ${clientId}:`, error)
    }
  }

  /**
   * Abre el archivo con Vista Previa (o la app predeterminada en macOS).
   */
  async openDocument(id: string): Promise<{ success: boolean; error?: string }> {
    const doc = await this.getById(id)
    if (!doc) {
      return { success: false, error: 'Documento no encontrado' }
    }
    return documentStorage.openDocumentWithSystem(doc.relativePath)
  }

  /**
   * Revela el archivo en Finder.
   */
  async showInFinder(id: string): Promise<boolean> {
    const doc = await this.getById(id)
    if (!doc) return false
    return documentStorage.showInFinder(doc.relativePath)
  }

  /**
   * Obtiene contenido en base64 para previsualización web.
   */
  async getBase64(id: string): Promise<string | null> {
    const doc = await this.getById(id)
    if (!doc) return null
    return documentStorage.readAsBase64(doc.relativePath)
  }
}

export const documentRepository = new DocumentRepository()

