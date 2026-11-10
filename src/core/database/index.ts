export { databaseService } from './databaseService'
export { TABLES_SQL, SEED_SQL } from './schema'
export { runDatabaseMigrations } from './migrator'
export {
  getDatabase,
  initDatabase,
  closeDatabase,
  getDatabasePath,
  getDocumentsStoragePath,
} from './connection'
export type { DatabaseWrapper, DatabaseStatement } from './connection'
