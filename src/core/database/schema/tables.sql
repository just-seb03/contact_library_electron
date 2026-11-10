-- Schema de Tablas SQLite para Contact Library
-- Estructurado según las features de la aplicación

-- 1. Feature: Clientes
CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  rut TEXT,
  status TEXT DEFAULT 'activo', -- 'activo' | 'en_proceso' | 'completado'
  caso TEXT,                     -- JSON: { expediente, juzgado, materia, estado, proximaAudiencia }
  pago TEXT,                     -- JSON: { monto, concepto, fecha, estado }
  documentos TEXT,               -- JSON Array: [{ id, name, dataUrl, size, uploadedAt }]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Feature: Pagos
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  client TEXT NOT NULL,
  clientId INTEGER,
  concept TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL,          -- 'completed' | 'pending' | 'overdue'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
);

-- 3. Feature: Calendario / Audiencias
CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  startTime TEXT NOT NULL,
  endTime TEXT NOT NULL,
  colorId TEXT DEFAULT 'blue',
  alarmMinutes INTEGER DEFAULT 15,
  clientId INTEGER,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
);

-- 4. Feature: Configuración / Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
