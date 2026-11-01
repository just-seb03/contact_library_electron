import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'

export function registerPaymentController(): void {
  ipcMain.handle('db:payments:getAll', async () => {
    const db = getDatabase()
    return db.prepare('SELECT * FROM payments ORDER BY date DESC').all()
  })

  ipcMain.handle('db:payments:saveAll', async (_event, payments: any[]) => {
    const db = getDatabase()
    await db.transaction(async () => {
      await db.prepare('DELETE FROM payments').run()
      const statement = db.prepare(`
        INSERT INTO payments (id, client, clientId, concept, amount, date, status)
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
