import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'
import type { Payment } from '../../../core/context/types'
import {
  IPC_CHANNELS,
  createIpcSuccess,
  createIpcError,
  type IpcResponse,
} from '../../../shared/types/ipc'

interface PaymentRow {
  id: string
  client: string
  client_id: number | null
  concept: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'overdue'
}

function parsePaymentRow(row: PaymentRow): Payment {
  return {
    id: row.id,
    client: row.client,
    clientId: row.client_id ?? undefined,
    concept: row.concept,
    amount: row.amount,
    date: row.date,
    status: row.status,
  }
}

export function registerPaymentController(): void {
  // 1. Obtener todos los pagos
  ipcMain.handle(
    IPC_CHANNELS.PAYMENTS_LIST,
    async (): Promise<IpcResponse<Payment[]>> => {
      try {
        const db = getDatabase()
        const rows = await db.prepare('SELECT * FROM payments ORDER BY date DESC').all<PaymentRow>()
        return createIpcSuccess(rows.map(parsePaymentRow))
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // 2. Guardar lote completo de pagos
  ipcMain.handle(
    IPC_CHANNELS.PAYMENTS_SAVE_ALL,
    async (_event, payments: Payment[]): Promise<IpcResponse<boolean>> => {
      try {
        if (!Array.isArray(payments)) {
          return createIpcError('Se esperaba una lista de pagos.')
        }

        const db = getDatabase()
        await db.transaction(async () => {
          await db.prepare('DELETE FROM payments').run()
          const statement = db.prepare(`
            INSERT INTO payments (id, client, client_id, concept, amount, date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `)
          for (const payment of payments) {
            await statement.run(
              payment.id,
              payment.client,
              payment.clientId || null,
              payment.concept,
              payment.amount,
              payment.date,
              payment.status
            )
          }
        })
        return createIpcSuccess(true)
      } catch (error) {
        return createIpcError(error)
      }
    }
  )

  // Compatibilidad con canales heredados
  ipcMain.handle('db:payments:getAll', async () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM payments ORDER BY date DESC').all()
  })

  ipcMain.handle('db:payments:saveAll', async (_event, payments: Payment[]) => {
    const db = getDatabase()
    await db.transaction(async () => {
      await db.prepare('DELETE FROM payments').run()
      const statement = db.prepare(`
        INSERT INTO payments (id, client, client_id, concept, amount, date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      for (const payment of payments) {
        await statement.run(
          payment.id,
          payment.client,
          payment.clientId || null,
          payment.concept,
          payment.amount,
          payment.date,
          payment.status
        )
      }
    })
    return true
  })
}
