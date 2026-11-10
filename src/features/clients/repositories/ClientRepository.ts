import { getDatabase } from '../../../core/database/connection'
import { caseRepository, type CaseEntity } from './CaseRepository'
import { documentRepository, type DocumentEntity } from './DocumentRepository'
import type { ClientStatus, Client, ClientPaymentInfo } from '../../../core/context/types'

export interface ClientRow {
  id: number
  name: string
  phone: string
  email: string | null
  rut: string | null
  status: ClientStatus
  created_at: string
  updated_at: string
}

export interface ClientFilters {
  search?: string
  status?: ClientStatus
  limit?: number
  offset?: number
}

export interface CreateClientDTO {
  name: string
  phone: string
  email?: string
  rut?: string
  status?: ClientStatus
  caso?: {
    expediente: string
    juzgado: string
    materia: string
    estado: string
    proximaAudiencia?: string
  }
}

export interface UpdateClientDTO {
  name?: string
  phone?: string
  email?: string
  rut?: string
  status?: ClientStatus
  caso?: {
    expediente: string
    juzgado: string
    materia: string
    estado: string
    proximaAudiencia?: string
  }
}

export class ClientRepository {
  private formatClient(
    clientRow: ClientRow,
    caseData?: CaseEntity | null,
    docs?: DocumentEntity[],
    paymentInfo?: ClientPaymentInfo | null
  ): Client {
    return {
      id: clientRow.id,
      name: clientRow.name,
      phone: clientRow.phone,
      email: clientRow.email ?? undefined,
      rut: clientRow.rut ?? undefined,
      status: clientRow.status,
      caso: caseData
        ? {
            expediente: caseData.expediente,
            juzgado: caseData.juzgado,
            materia: caseData.materia,
            estado: caseData.estado,
            proximaAudiencia: caseData.proximaAudiencia,
          }
        : undefined,
      documentos: (docs || []).map((doc) => ({
        id: doc.id,
        name: doc.name,
        dataUrl: '',
        size: doc.size,
        uploadedAt: doc.uploadedAt,
      })),
      pago: paymentInfo ?? undefined,
    }
  }

  async getAll(filters?: ClientFilters): Promise<Client[]> {
    const db = getDatabase()
    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.search && filters.search.trim() !== '') {
      const term = `%${filters.search.trim().toLowerCase()}%`
      conditions.push('(LOWER(name) LIKE ? OR LOWER(rut) LIKE ? OR phone LIKE ?)')
      params.push(term, term, term)
    }

    if (filters?.status) {
      conditions.push('status = ?')
      params.push(filters.status)
    }

    let query = 'SELECT * FROM clients'
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    query += ' ORDER BY id ASC'

    if (filters?.limit) {
      query += ` LIMIT ${Number(filters.limit)}`
      if (filters?.offset) {
        query += ` OFFSET ${Number(filters.offset)}`
      }
    }

    const clientRows = await db.prepare(query).all<ClientRow>(...params)

    // Cargamos casos, documentos y último pago asociado
    const clients: Client[] = []
    for (const row of clientRows) {
      const [caseData, docs, latestPayment] = await Promise.all([
        caseRepository.getByClientId(row.id),
        documentRepository.getByClientId(row.id),
        this.getLatestPaymentInfo(row.id),
      ])

      clients.push(this.formatClient(row, caseData, docs, latestPayment))
    }

    return clients
  }

  async getById(id: number): Promise<Client | null> {
    const db = getDatabase()
    const clientRow = await db.prepare('SELECT * FROM clients WHERE id = ?').get<ClientRow>(id)
    if (!clientRow) return null

    const [caseData, docs, latestPayment] = await Promise.all([
      caseRepository.getByClientId(id),
      documentRepository.getByClientId(id),
      this.getLatestPaymentInfo(id),
    ])

    return this.formatClient(clientRow, caseData, docs, latestPayment)
  }

  async create(data: CreateClientDTO): Promise<Client> {
    const db = getDatabase()

    return db.transaction(async () => {
      const info = await db.prepare(`
        INSERT INTO clients (name, phone, email, rut, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).run(
        data.name,
        data.phone,
        data.email || null,
        data.rut || null,
        data.status || 'activo'
      )

      const clientId = Number(info.lastInsertRowid)

      let createdCase: CaseEntity | null = null
      if (data.caso) {
        createdCase = await caseRepository.upsert(clientId, {
          expediente: data.caso.expediente,
          juzgado: data.caso.juzgado,
          materia: data.caso.materia,
          estado: data.caso.estado,
          proximaAudiencia: data.caso.proximaAudiencia,
        })
      }

      return {
        id: clientId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        rut: data.rut,
        status: data.status || 'activo',
        caso: createdCase
          ? {
              expediente: createdCase.expediente,
              juzgado: createdCase.juzgado,
              materia: createdCase.materia,
              estado: createdCase.estado,
              proximaAudiencia: createdCase.proximaAudiencia,
            }
          : undefined,
        documentos: [],
      }
    })
  }

  async update(id: number, data: UpdateClientDTO): Promise<Client> {
    const db = getDatabase()
    const existing = await db.prepare('SELECT * FROM clients WHERE id = ?').get<ClientRow>(id)
    if (!existing) {
      throw new Error(`Cliente con id ${id} no encontrado`)
    }

    await db.transaction(async () => {
      const updatedName = data.name !== undefined ? data.name : existing.name
      const updatedPhone = data.phone !== undefined ? data.phone : existing.phone
      const updatedEmail = data.email !== undefined ? data.email : existing.email
      const updatedRut = data.rut !== undefined ? data.rut : existing.rut
      const updatedStatus = data.status !== undefined ? data.status : existing.status

      await db.prepare(`
        UPDATE clients
        SET name = ?, phone = ?, email = ?, rut = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        updatedName,
        updatedPhone,
        updatedEmail || null,
        updatedRut || null,
        updatedStatus,
        id
      )

      if (data.caso) {
        await caseRepository.upsert(id, {
          expediente: data.caso.expediente,
          juzgado: data.caso.juzgado,
          materia: data.caso.materia,
          estado: data.caso.estado,
          proximaAudiencia: data.caso.proximaAudiencia,
        })
      }
    })

    const updated = await this.getById(id)
    if (!updated) {
      throw new Error(`Error al recuperar cliente actualizado con id ${id}`)
    }
    return updated
  }

  async delete(id: number): Promise<boolean> {
    const db = getDatabase()

    await db.transaction(async () => {
      // 1. Borrar cliente en SQLite (ON DELETE CASCADE borra casos y documentos en SQLite)
      await db.prepare('DELETE FROM clients WHERE id = ?').run(id)
    })

    // 2. Limpieza segura de archivos en disco (macOS)
    await documentRepository.cleanClientStorageFolder(id)
    return true
  }

  private async getLatestPaymentInfo(clientId: number): Promise<ClientPaymentInfo | null> {
    const db = getDatabase()
    const paymentRow = await db
      .prepare('SELECT amount, concept, date, status FROM payments WHERE client_id = ? ORDER BY date DESC LIMIT 1')
      .get<{ amount: number; concept: string; date: string; status: 'completed' | 'pending' | 'overdue' }>(clientId)

    if (!paymentRow) return null

    return {
      monto: paymentRow.amount,
      concepto: paymentRow.concept,
      fecha: paymentRow.date,
      estado: paymentRow.status,
    }
  }
}

export const clientRepository = new ClientRepository()

