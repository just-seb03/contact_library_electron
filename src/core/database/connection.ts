import path from 'node:path'
import fs from 'node:fs'
import sqlite3 from 'sqlite3'
import { app } from 'electron'
import { TABLES_SQL, SEED_SQL } from './schema'

export interface DatabaseStatement {
  all<T = Record<string, unknown>>(...args: unknown[]): Promise<T[]>
  get<T = Record<string, unknown>>(...args: unknown[]): Promise<T | undefined>
  run(...args: unknown[]): Promise<{ lastInsertRowid: number; changes: number }>
}

export interface DatabaseWrapper {
  prepare(sql: string): DatabaseStatement
  exec(sql: string): Promise<void>
  pragma(sql: string): Promise<void>
  transaction<T>(fn: () => Promise<T>): Promise<T>
  close(): void
}

let dbInstance: DatabaseWrapper | null = null

export function getDatabasePath(): string {
  try {
    const userDataPath = app?.getPath ? app.getPath('userData') : process.cwd()
    return path.join(userDataPath, 'contact_library.db')
  } catch {
    return path.join(process.cwd(), 'contact_library.db')
  }
}

function normalizeParams(args: unknown[]): unknown[] {
  return args.length === 1 && Array.isArray(args[0]) ? args[0] : args
}

function openDatabase(targetPath: string): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database(targetPath, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(database)
      }
    })
  })
}

function createWrapper(rawDb: sqlite3.Database): DatabaseWrapper {
  let transactionTail: Promise<void> = Promise.resolve()

  const exec = (sql: string): Promise<void> =>
    new Promise((resolve, reject) => {
      rawDb.exec(sql, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })

  return {
    prepare(sql: string): DatabaseStatement {
      return {
        all<T>(...args: unknown[]): Promise<T[]> {
          const params = normalizeParams(args)
          return new Promise((resolve, reject) => {
            const statement = rawDb.prepare(sql, (prepareError) => {
              if (prepareError) {
                reject(prepareError)
                return
              }
              statement.all(params, (error, rows) => {
                statement.finalize((finalizeError) => {
                  if (error || finalizeError) {
                    reject(error || finalizeError)
                  } else {
                    resolve(rows as T[])
                  }
                })
              })
            })
          })
        },
        get<T>(...args: unknown[]): Promise<T | undefined> {
          const params = normalizeParams(args)
          return new Promise((resolve, reject) => {
            const statement = rawDb.prepare(sql, (prepareError) => {
              if (prepareError) {
                reject(prepareError)
                return
              }
              statement.get(params, (error, row) => {
                statement.finalize((finalizeError) => {
                  if (error || finalizeError) {
                    reject(error || finalizeError)
                  } else {
                    resolve(row as T | undefined)
                  }
                })
              })
            })
          })
        },
        run(...args: unknown[]): Promise<{ lastInsertRowid: number; changes: number }> {
          const params = normalizeParams(args)
          return new Promise((resolve, reject) => {
            const statement = rawDb.prepare(sql, (prepareError) => {
              if (prepareError) {
                reject(prepareError)
                return
              }
              statement.run(params, function (error) {
                statement.finalize((finalizeError) => {
                  if (error || finalizeError) {
                    reject(error || finalizeError)
                  } else {
                    resolve({ lastInsertRowid: this.lastID, changes: this.changes })
                  }
                })
              })
            })
          })
        },
      }
    },
    exec,
    pragma(sql: string): Promise<void> {
      return exec(`PRAGMA ${sql};`)
    },
    async transaction<T>(fn: () => Promise<T>): Promise<T> {
      let releaseTransaction!: () => void
      const previousTransaction = transactionTail
      transactionTail = new Promise<void>((resolve) => {
        releaseTransaction = resolve
      })

      await previousTransaction
      try {
        await exec('BEGIN TRANSACTION;')
        const result = await fn()
        await exec('COMMIT;')
        return result
      } catch (error) {
        try {
          await exec('ROLLBACK;')
        } catch (rollbackError) {
          console.error('[SQLite] Error revirtiendo transacción:', rollbackError)
        }
        throw error
      } finally {
        releaseTransaction()
      }
    },
    close(): void {
      rawDb.close((error) => {
        if (error) {
          console.error('[SQLite] Error cerrando la base de datos:', error)
        }
      })
    },
  }
}

export async function initDatabase(dbPath?: string): Promise<DatabaseWrapper> {
  if (dbInstance) return dbInstance

  const targetPath = dbPath || getDatabasePath()
  const dbDir = path.dirname(targetPath)
  fs.mkdirSync(dbDir, { recursive: true })

  const rawDb = await openDatabase(targetPath)
  const wrapper = createWrapper(rawDb)

  try {
    await wrapper.pragma('foreign_keys = ON')

    let tablesSql = TABLES_SQL
    const tablesFile = path.join(process.cwd(), 'src', 'core', 'database', 'schema', 'tables.sql')
    if (fs.existsSync(tablesFile)) {
      tablesSql = fs.readFileSync(tablesFile, 'utf-8')
    }
    await wrapper.exec(tablesSql)

    const clientCount = await wrapper.prepare('SELECT count(*) as count FROM clients').get<{ count: number }>()
    if (!clientCount || clientCount.count === 0) {
      let seedSql = SEED_SQL
      const seedFile = path.join(process.cwd(), 'src', 'core', 'database', 'schema', 'seed.sql')
      if (fs.existsSync(seedFile)) {
        seedSql = fs.readFileSync(seedFile, 'utf-8')
      }
      await wrapper.exec(seedSql)
    }
  } catch (error) {
    wrapper.close()
    throw error
  }

  console.log('[SQLite] Base de datos inicializada y conectada en:', targetPath)
  dbInstance = wrapper
  return dbInstance
}

export function getDatabase(): DatabaseWrapper {
  if (!dbInstance) {
    throw new Error('[SQLite] La base de datos no ha sido inicializada. Asegúrate de llamar a initDatabase() primero.')
  }
  return dbInstance
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}
