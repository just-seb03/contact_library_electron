/**
 * @file paymentController.ts
 * @description Controlador IPC para la gestión y persistencia de pagos y cobros en SQLite.
 * Proporciona tipado estricto, mapeo de columnas snake_case y respuestas estandarizadas.
 */

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

/**
 * Mapea una fila de base de datos SQLite (snake_case) a la entidad Payment (camelCase)
 */
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

/**
 * Registra todos los handlers IPC correspondientes al dominio de pagos.
 */
export function registerPaymentController(): void {
  // [payments:list] - Recupera la lista completa de pagos ordenada descendentemente por fecha
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

  // [payments:saveAll] - Reemplazo atómico de la tabla de pagos dentro de una transacción SQLite
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

  // --- Handlers de retrocompatibilidad transitoria ---
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
