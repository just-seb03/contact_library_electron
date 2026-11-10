import { ipcMain } from 'electron'
import { getDatabase } from '../../../core/database/connection'

interface ClientRow {
  id: number
  name: string
  phone: string
  email: string | null
  rut: string | null
  status: string
  caso: string | null
  pago: string | null
  documentos: string | null
}

function parseClient(row: ClientRow) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    rut: row.rut ?? undefined,
    status: row.status as 'activo' | 'en_proceso' | 'completado',
    caso: row.caso ? JSON.parse(row.caso) : undefined,
    pago: row.pago ? JSON.parse(row.pago) : undefined,
    documentos: row.documentos ? JSON.parse(row.documentos) : [],
  }
}

export function registerClientController(): void {
  ipcMain.handle('db:clients:getAll', async () => {
    const db = getDatabase()
    const rows = await db.prepare('SELECT * FROM clients ORDER BY id ASC').all<ClientRow>()
    return rows.map(parseClient)
  })

  ipcMain.handle('db:clients:create', async (_event, client: any) => {
    const db = getDatabase()
    const info = await db.prepare(`
      INSERT INTO clients (name, phone, email, rut, status, caso, pago, documentos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      client.name,
      client.phone,
      client.email || null,
      client.rut || null,
      client.status || 'activo',
      client.caso ? JSON.stringify(client.caso) : null,
      client.pago ? JSON.stringify(client.pago) : null,
      client.documentos ? JSON.stringify(client.documentos) : '[]'
    )
    return {
      ...client,
      id: Number(info.lastInsertRowid),
    }
  })

  ipcMain.handle('db:clients:update', async (_event, id: number, data: any) => {
    const db = getDatabase()
    const existing = await db.prepare('SELECT * FROM clients WHERE id = ?').get<ClientRow>(id)
    if (!existing) {
      throw new Error(`Cliente con id ${id} no encontrado`)
    }

    const current = parseClient(existing)
    const merged = { ...current, ...data }

    await db.prepare(`
      UPDATE clients
      SET name = ?, phone = ?, email = ?, rut = ?, status = ?, caso = ?, pago = ?, documentos = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      merged.name,
      merged.phone,
      merged.email || null,
      merged.rut || null,
      merged.status || 'activo',
      merged.caso ? JSON.stringify(merged.caso) : null,
      merged.pago ? JSON.stringify(merged.pago) : null,
      merged.documentos ? JSON.stringify(merged.documentos) : '[]',
      id
    )

    return merged
  })

  ipcMain.handle('db:clients:delete', async (_event, id: number) => {
    const db = getDatabase()
    await db.prepare('DELETE FROM clients WHERE id = ?').run(id)
    return true
  })

  ipcMain.handle('db:clients:saveAll', async (_event, clients: any[]) => {
    const db = getDatabase()
    await db.transaction(async () => {
      await db.prepare('DELETE FROM clients').run()
      const statement = db.prepare(`
        INSERT INTO clients (id, name, phone, email, rut, status, caso, pago, documentos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      for (const client of clients) {
        await statement.run(
          client.id,
          client.name,
          client.phone,
          client.email || null,
          client.rut || null,
          client.status || 'activo',
          client.caso ? JSON.stringify(client.caso) : null,
          client.pago ? JSON.stringify(client.pago) : null,
          client.documentos ? JSON.stringify(client.documentos) : '[]'
        )
      }
    })
    return true
  })
}
