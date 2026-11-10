import type { DatabaseWrapper } from './connection'
import { TABLES_SQL, SEED_SQL } from './schema'

interface TableColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: string | null
  pk: number
}

interface OldClientRow {
  id: number
  name: string
  phone: string
  email?: string | null
  rut?: string | null
  status?: string | null
  caso?: string | null
  pago?: string | null
  documentos?: string | null
}

/**
 * Ejecuta migraciones automáticas sobre la base de datos SQLite.
 * Utiliza PRAGMA user_version para llevar el control de versiones sin perder información.
 */
export async function runDatabaseMigrations(db: DatabaseWrapper): Promise<void> {
  const versionRow = await db.prepare('PRAGMA user_version;').get<{ user_version: number }>()
  const currentVersion = versionRow?.user_version ?? 0

  if (currentVersion === 0) {
    console.log('[SQLite Migrator] Detectada base de datos sin versión (versión 0). Verificando esquema...')

    // Verificar si la tabla clients existe
    const tableCheck = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='clients'")
      .get<{ name: string }>()

    if (tableCheck) {
      // Verificar columnas existentes
      const columns = await db.prepare('PRAGMA table_info(clients)').all<TableColumnInfo>()
      const hasOldCasoColumn = columns.some((col) => col.name === 'caso')

      if (hasOldCasoColumn) {
        console.log('[SQLite Migrator] Migrando base de datos antigua (con columnas JSON) al esquema normalizado v1...')
        await db.transaction(async () => {
          // 1. Leer clientes antiguos
          const oldClients = await db.prepare('SELECT * FROM clients').all<OldClientRow>()

          // 2. Asegurar que las nuevas tablas existan
          await db.exec(TABLES_SQL)

          // 3. Crear tabla temporal para clientes limpios
          await db.exec(`
            CREATE TABLE IF NOT EXISTS clients_new (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              phone TEXT NOT NULL,
              email TEXT,
              rut TEXT,
              status TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'en_proceso', 'completado')),
              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
          `)

          // 4. Migrar datos
          for (const oldClient of oldClients) {
            await db.prepare(`
              INSERT INTO clients_new (id, name, phone, email, rut, status)
              VALUES (?, ?, ?, ?, ?, ?)
            `).run(
              oldClient.id,
              oldClient.name,
              oldClient.phone,
              oldClient.email || null,
              oldClient.rut || null,
              oldClient.status || 'activo'
            )

            // Migrar caso si existía
            if (oldClient.caso) {
              try {
                const casoObj = JSON.parse(oldClient.caso)
                if (casoObj && typeof casoObj === 'object') {
                  await db.prepare(`
                    INSERT OR REPLACE INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia)
                    VALUES (?, ?, ?, ?, ?, ?)
                  `).run(
                    oldClient.id,
                    casoObj.expediente || 'Sin Expediente',
                    casoObj.juzgado || 'Sin Juzgado',
                    casoObj.materia || 'General',
                    casoObj.estado || 'Activo',
                    casoObj.proximaAudiencia || null
                  )
                }
              } catch {
                // Si el JSON estaba corrupto, continuar
              }
            }

            // Migrar documentos si existían
            if (oldClient.documentos) {
              try {
                const docs = JSON.parse(oldClient.documentos)
                if (Array.isArray(docs)) {
                  for (const doc of docs) {
                    if (doc && doc.name) {
                      await db.prepare(`
                        INSERT OR IGNORE INTO documents (id, client_id, name, file_name, relative_path, size, mime_type, uploaded_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                      `).run(
                        doc.id || `migrated-${Date.now()}-${Math.random()}`,
                        oldClient.id,
                        doc.name,
                        doc.name,
                        `${oldClient.id}/${doc.name}`,
                        Number(doc.size) || 0,
                        'application/pdf',
                        doc.uploadedAt || new Date().toISOString()
                      )
                    }
                  }
                }
              } catch {
                // Ignorar error de parsing en documentos
              }
            }
          }

          // 5. Reemplazar la tabla antigua por la normalizada
          await db.exec('DROP TABLE clients;')
          await db.exec('ALTER TABLE clients_new RENAME TO clients;')

          // 6. Volver a aplicar constraints e índices
          await db.exec(TABLES_SQL)

          // 7. Actualizar versión a 1
          await db.pragma('user_version = 1')
        })

        console.log('[SQLite Migrator] Migración a v1 completada exitosamente.')
        return
      }
    }

    // Si la base de datos es totalmente nueva:
    console.log('[SQLite Migrator] Creando base de datos inicial v1...')
    await db.exec(TABLES_SQL)

    const clientCount = await db.prepare('SELECT count(*) as count FROM clients').get<{ count: number }>()
    if (!clientCount || clientCount.count === 0) {
      console.log('[SQLite Migrator] Población inicial con seed data...')
      await db.exec(SEED_SQL)
    }

    await db.pragma('user_version = 1')
    console.log('[SQLite Migrator] Esquema inicial v1 aplicado con éxito.')
  }
}

