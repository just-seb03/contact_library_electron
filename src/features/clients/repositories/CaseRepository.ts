import { getDatabase } from '../../../core/database/connection'

export interface CaseRow {
  id: number
  client_id: number
  expediente: string
  juzgado: string
  materia: string
  estado: string
  proxima_audiencia: string | null
  created_at: string
  updated_at: string
}

export interface CaseEntity {
  id: number
  clientId: number
  expediente: string
  juzgado: string
  materia: string
  estado: string
  proximaAudiencia?: string
  createdAt: string
  updatedAt: string
}

export interface UpsertCaseDTO {
  expediente: string
  juzgado: string
  materia: string
  estado: string
  proximaAudiencia?: string | null
}

export class CaseRepository {
  private toEntity(row: CaseRow): CaseEntity {
    return {
      id: row.id,
      clientId: row.client_id,
      expediente: row.expediente,
      juzgado: row.juzgado,
      materia: row.materia,
      estado: row.estado,
      proximaAudiencia: row.proxima_audiencia ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async getByClientId(clientId: number): Promise<CaseEntity | null> {
    const db = getDatabase()
    const row = await db.prepare('SELECT * FROM cases WHERE client_id = ?').get<CaseRow>(clientId)
    return row ? this.toEntity(row) : null
  }

  async upsert(clientId: number, data: UpsertCaseDTO): Promise<CaseEntity> {
    const db = getDatabase()
    const existing = await this.getByClientId(clientId)

    if (existing) {
      await db.prepare(`
        UPDATE cases
        SET expediente = ?, juzgado = ?, materia = ?, estado = ?, proxima_audiencia = ?, updated_at = CURRENT_TIMESTAMP
        WHERE client_id = ?
      `).run(
        data.expediente,
        data.juzgado,
        data.materia,
        data.estado,
        data.proximaAudiencia ?? null,
        clientId
      )
    } else {
      await db.prepare(`
        INSERT INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        clientId,
        data.expediente,
        data.juzgado,
        data.materia,
        data.estado,
        data.proximaAudiencia ?? null
      )
    }

    const updated = await this.getByClientId(clientId)
    if (!updated) {
      throw new Error(`Error al persistir expediente judicial para el cliente ${clientId}`)
    }
    return updated
  }

  async updateStatus(clientId: number, estado: string): Promise<boolean> {
    const db = getDatabase()
    const res = await db.prepare(`
      UPDATE cases
      SET estado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE client_id = ?
    `).run(estado, clientId)
    return res.changes > 0
  }

  async deleteByClientId(clientId: number): Promise<boolean> {
    const db = getDatabase()
    const res = await db.prepare('DELETE FROM cases WHERE client_id = ?').run(clientId)
    return res.changes > 0
  }
}

export const caseRepository = new CaseRepository()

