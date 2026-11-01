import Database, { Database as DatabaseType } from 'better-sqlite3'
import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'

let db: DatabaseType | null = null

/**
 * Obtiene la ruta física del archivo de base de datos SQLite.
 * En producción se ubica en el directorio de datos del usuario (userData),
 * y en desarrollo permite un fallback local o dentro del mismo proyecto.
 */
export function getDatabasePath(): string {
  try {
    const userDataPath = app?.getPath ? app.getPath('userData') : process.cwd()
    return path.join(userDataPath, 'contact_library.db')
  } catch {
    return path.join(process.cwd(), 'contact_library.db')
  }
}

/**
 * Inicializa la conexión con SQLite y ejecuta el schema inicial.
 * (En STANDBY para el Paso 2)
 */
export function initDatabase(dbPath?: string): DatabaseType {
  if (db) return db

  const targetPath = dbPath || getDatabasePath()
  const dbDir = path.dirname(targetPath)

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  db = new Database(targetPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // Carga y ejecución de tablas y seed desde core/database/schema
  const coreSchemaDir = path.join(process.cwd(), 'src', 'core', 'database', 'schema')
  const tablesPath = path.join(coreSchemaDir, 'tables.sql')
  const seedPath = path.join(coreSchemaDir, 'seed.sql')

  if (fs.existsSync(tablesPath)) {
    const tablesSql = fs.readFileSync(tablesPath, 'utf-8')
    db.exec(tablesSql)
  }

  if (fs.existsSync(seedPath)) {
    const seedSql = fs.readFileSync(seedPath, 'utf-8')
    db.exec(seedSql)
  }

  return db
}

/**
 * Obtiene la instancia activa de la base de datos SQLite.
 */
export function getDatabase(): DatabaseType {
  if (!db) {
    throw new Error('La base de datos aún no ha sido inicializada. (En standby)')
  }
  return db
}

/**
 * Cierra la conexión de la base de datos si está abierta.
 */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
  }
}
