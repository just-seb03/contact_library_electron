-- Datos iniciales (Seed) para Contact Library
-- Extraídos del modelo y datos mock actuales

-- 1. Clientes iniciales
INSERT OR IGNORE INTO clients (id, name, phone, email, status, caso, pago, documentos) VALUES
(
  1,
  'El manzano',
  '+56 9 8765 4321',
  'contacto@elmanzano.cl',
  'activo',
  '{"expediente":"EXP-2026-042","juzgado":"1° Juzgado Civil de Santiago","materia":"Asesoría Mensual Corporativa","estado":"Contrato vigente al día","proximaAudiencia":"28 Oct, 2026 - 10:00 AM"}',
  '{"monto":450000,"concepto":"Asesoría Mensual","fecha":"10 Oct, 2026","estado":"completed"}',
  '[]'
),
(
  2,
  'Sebastian Bastian',
  '+56 9 9123 4567',
  'sebastian.bastian@empresa.com',
  'en_proceso',
  '{"expediente":"EXP-2026-118","juzgado":"2° Juzgado de Letras del Trabajo","materia":"Desarrollo de Módulo y Propiedad Intelectual","estado":"Revisión de entregables y cobro pendiente","proximaAudiencia":"14 Oct, 2026 - 11:30 AM"}',
  '{"monto":1200000,"concepto":"Desarrollo de Modulo","fecha":"14 Oct, 2026","estado":"pending"}',
  '[]'
),
(
  3,
  'MaxiMaxi',
  '+56 9 6543 2109',
  'administracion@maximaxi.com',
  'en_proceso',
  '{"expediente":"EXP-2026-077","juzgado":"Juzgado de Cobranza Judicial","materia":"Mantenimiento de Agenda y Soporte Legal","estado":"Notificación de cobro vencido","proximaAudiencia":"05 Nov, 2026 - 09:30 AM"}',
  '{"monto":300000,"concepto":"Mantenimiento de Agenda","fecha":"05 Oct, 2026","estado":"overdue"}',
  '[]'
),
(
  6,
  'Carlos Mendoza',
  '+56 9 5555 2222',
  'carlos.mendoza@legales.cl',
  'en_proceso',
  '{"expediente":"EXP-2026-155","juzgado":"3° Juzgado Civil de Santiago","materia":"Revisión de contrato comercial","estado":"Pendiente de firma","proximaAudiencia":"22 Oct, 2026 - 02:00 PM"}',
  '{"monto":600000,"concepto":"Revisión Contractual","fecha":"22 Oct, 2026","estado":"pending"}',
  '[]'
);

-- 2. Configuración inicial (Settings)
INSERT OR IGNORE INTO settings (key, value) VALUES
('hearingAlerts', 'true'),
('paymentReminders', 'true'),
('soundEffects', 'true'),
('accentColor', '"blue"'),
('lawyerName', '"Sebastián Contreras"'),
('lawyerEmail', '"s.contreras@estudiojuridico.cl"'),
('lawyerFirm', '"Contreras & Asociados • Derecho Civil y Litigios"');
