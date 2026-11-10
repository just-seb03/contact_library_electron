import { getDatabase } from '../../../core/database/connection'
import type { Payment } from '../../../core/context/types'

export interface PaymentRow {
  id: string
  client_id: number | null
  client_name: string
  concept: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'overdue'
  created_at: string
  updated_at: string
}

export interface PaymentFilters {
  clientId?: number
  status?: 'completed' | 'pending' | 'overdue'
  search?: string
  startDate?: string
  endDate?: string
}

export interface CreatePaymentDTO {
  id?: string
  client: string
  clientId?: number | null
  concept: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'overdue'
}

export interface UpdatePaymentDTO {
  client?: string
  clientId?: number | null
  concept?: string
  amount?: number
  date?: string
  status?: 'completed' | 'pending' | 'overdue'
}

export interface PaymentSummary {
  totalAmount: number
  completedAmount: number
  pendingAmount: number
  overdueAmount: number
  totalCount: number
  completedCount: number
  pendingCount: number
  overdueCount: number
}

export class PaymentRepository {
  private toEntity(row: PaymentRow): Payment {
    return {
      id: row.id,
      client: row.client_name,
      clientId: row.client_id ?? undefined,
      concept: row.concept,
      amount: row.amount,
      date: row.date,
      status: row.status,
    }
  }

  async getAll(filters?: PaymentFilters): Promise<Payment[]> {
    const db = getDatabase()
    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.clientId) {
      conditions.push('client_id = ?')
      params.push(filters.clientId)
    }

    if (filters?.status) {
      conditions.push('status = ?')
      params.push(filters.status)
    }

    if (filters?.startDate) {
      conditions.push('date >= ?')
      params.push(filters.startDate)
    }

    if (filters?.endDate) {
      conditions.push('date <= ?')
      params.push(filters.endDate)
    }

    if (filters?.search && filters.search.trim() !== '') {
      const term = `%${filters.search.trim().toLowerCase()}%`
      conditions.push('(LOWER(client_name) LIKE ? OR LOWER(concept) LIKE ?)')
      params.push(term, term)
    }

    let query = 'SELECT * FROM payments'
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    query += ' ORDER BY date DESC, created_at DESC'

    const rows = await db.prepare(query).all<PaymentRow>(...params)
    return rows.map((r) => this.toEntity(r))
  }

  async getById(id: string): Promise<Payment | null> {
    const db = getDatabase()
    const row = await db.prepare('SELECT * FROM payments WHERE id = ?').get<PaymentRow>(id)
    return row ? this.toEntity(row) : null
  }

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const db = getDatabase()
    const id = data.id || `pay-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    await db.prepare(`
      INSERT INTO payments (id, client_id, client_name, concept, amount, date, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      id,
      data.clientId || null,
      data.client,
      data.concept,
      Number(data.amount),
      data.date,
      data.status
    )

    const created = await this.getById(id)
    if (!created) {
      throw new Error(`Error al persistir pago ${id}`)
    }
    return created
  }

  async update(id: string, data: UpdatePaymentDTO): Promise<Payment> {
    const db = getDatabase()
    const existing = await db.prepare('SELECT * FROM payments WHERE id = ?').get<PaymentRow>(id)
    if (!existing) {
      throw new Error(`Pago con id ${id} no encontrado`)
    }

    const updatedClientId = data.clientId !== undefined ? data.clientId : existing.client_id
    const updatedClientName = data.client !== undefined ? data.client : existing.client_name
    const updatedConcept = data.concept !== undefined ? data.concept : existing.concept
    const updatedAmount = data.amount !== undefined ? Number(data.amount) : existing.amount
    const updatedDate = data.date !== undefined ? data.date : existing.date
    const updatedStatus = data.status !== undefined ? data.status : existing.status

    await db.prepare(`
      UPDATE payments
      SET client_id = ?, client_name = ?, concept = ?, amount = ?, date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      updatedClientId,
      updatedClientName,
      updatedConcept,
      updatedAmount,
      updatedDate,
      updatedStatus,
      id
    )

    const updated = await this.getById(id)
    if (!updated) {
      throw new Error(`Error al recuperar pago actualizado con id ${id}`)
    }
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const db = getDatabase()
    const res = await db.prepare('DELETE FROM payments WHERE id = ?').run(id)
    return res.changes > 0
  }

  /**
   * Cálculo de balance y resumen automático de pagos
   */
  async getSummary(clientId?: number): Promise<PaymentSummary> {
    const db = getDatabase()
    let query = 'SELECT amount, status FROM payments'
    const params: unknown[] = []

    if (clientId) {
      query += ' WHERE client_id = ?'
      params.push(clientId)
    }

    const rows = await db.prepare(query).all<{ amount: number; status: 'completed' | 'pending' | 'overdue' }>(...params)

    let totalAmount = 0
    let completedAmount = 0
    let pendingAmount = 0
    let overdueAmount = 0
    let completedCount = 0
    let pendingCount = 0
    let overdueCount = 0

    for (const r of rows) {
      const amt = Number(r.amount) || 0
      totalAmount += amt
      if (r.status === 'completed') {
        completedAmount += amt
        completedCount++
      } else if (r.status === 'pending') {
        pendingAmount += amt
        pendingCount++
      } else if (r.status === 'overdue') {
        overdueAmount += amt
        overdueCount++
      }
    }

    return {
      totalAmount,
      completedAmount,
      pendingAmount,
      overdueAmount,
      totalCount: rows.length,
      completedCount,
      pendingCount,
      overdueCount,
    }
  }
}

export const paymentRepository = new PaymentRepository()

