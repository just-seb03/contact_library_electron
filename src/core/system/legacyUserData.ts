/**
 * @file legacyUserData.ts
 * @description Migración de la carpeta de datos (userData) tras el cambio de nombre de la app.
 *
 * Electron guarda los datos en una carpeta con el nombre de la app (`app.name`). Al cambiarlo a
 * "Contact Library", la app empezó a usar una carpeta nueva y vacía. Esta migración copia los
 * datos de las carpetas con nombres anteriores la primera vez que se arranca con el nombre nuevo.
 *
 * - Solo actúa si la carpeta actual NO tiene base de datos (nunca sobrescribe datos existentes).
 * - Copia, no mueve: la carpeta antigua queda intacta como respaldo.
 * - Debe ejecutarse antes de `app.whenReady()` (antes de que Chromium abra el localStorage).
 */

import { app } from 'electron'
import fs from 'node:fs'
import path from 'node:path'

/** Nombres anteriores de la carpeta de datos, del más reciente al más antiguo. */
const LEGACY_USER_DATA_NAMES = ['YourAppName', 'contact_library_electron']

const DATABASE_FILE = 'contact_library.db'

/**
 * Elementos a copiar. `Local Storage` se incluye porque puede contener datos que nunca
 * llegaron a SQLite; al arrancar, AppProvider los migra a la base de datos.
 */
const ITEMS_TO_COPY = [
  DATABASE_FILE,
  `${DATABASE_FILE}-wal`,
  `${DATABASE_FILE}-shm`,
  'documents',
  'Local Storage',
]

/**
 * @returns La carpeta de origen si se migró algo; `null` si no hacía falta o no había datos.
 */
export function migrateLegacyUserData(): string | null {
  try {
    const target = app.getPath('userData')
    if (fs.existsSync(path.join(target, DATABASE_FILE))) return null

    const appData = app.getPath('appData')
    for (const name of LEGACY_USER_DATA_NAMES) {
      const source = path.join(appData, name)
      if (path.resolve(source) === path.resolve(target)) continue
      if (!fs.existsSync(path.join(source, DATABASE_FILE))) continue

      fs.mkdirSync(target, { recursive: true })
      for (const item of ITEMS_TO_COPY) {
        const from = path.join(source, item)
        if (fs.existsSync(from)) {
          fs.cpSync(from, path.join(target, item), { recursive: true, force: true })
        }
      }

      console.log(`[UserData] Datos migrados desde "${source}" a "${target}"`)
      return source
    }
  } catch (error) {
    // Nunca bloquear el arranque: en el peor caso la app inicia con datos nuevos.
    console.error('[UserData] No se pudieron migrar los datos de la carpeta anterior:', error)
  }
  return null
}
