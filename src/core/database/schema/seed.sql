-- Datos iniciales (Seed) para Contact Library
-- Adaptado al esquema relacional normalizado

-- 1. Clientes
INSERT OR IGNORE INTO clients (id, name, phone, email, rut, status) VALUES
(1, 'El manzano', '+56 9 8765 4321', 'contacto@elmanzano.cl', '76.123.456-7', 'activo'),
(2, 'Sebastian Bastian', '+56 9 9123 4567', 'sebastian.bastian@empresa.com', '18.987.654-3', 'en_proceso'),
(3, 'MaxiMaxi', '+56 9 6543 2109', 'administracion@maximaxi.com', '77.890.123-k', 'en_proceso'),
(6, 'Carlos Mendoza', '+56 9 5555 2222', 'carlos.mendoza@legales.cl', '15.432.876-5', 'en_proceso');

-- 2. Casos / Expedientes legales asociados
INSERT OR IGNORE INTO cases (client_id, expediente, juzgado, materia, estado, proxima_audiencia) VALUES
(1, 'EXP-2026-042', '1° Juzgado Civil de Santiago', 'Asesoría Mensual Corporativa', 'Contrato vigente al día', '28 Oct, 2026 - 10:00 AM'),
(2, 'EXP-2026-118', '2° Juzgado de Letras del Trabajo', 'Desarrollo de Módulo y Propiedad Intelectual', 'Revisión de entregables y cobro pendiente', '14 Oct, 2026 - 11:30 AM'),
(3, 'EXP-2026-077', 'Juzgado de Cobranza Judicial', 'Mantenimiento de Agenda y Soporte Legal', 'Notificación de cobro vencido', '05 Nov, 2026 - 09:30 AM'),
(6, 'EXP-2026-155', '3° Juzgado Civil de Santiago', 'Revisión de contrato comercial', 'Pendiente de firma', '22 Oct, 2026 - 02:00 PM');

-- 3. Pagos
INSERT OR IGNORE INTO payments (id, client_id, client_name, concept, amount, date, status) VALUES
('pay-seed-1', 1, 'El manzano', 'Asesoría Mensual', 450000, '10 Oct, 2026', 'completed'),
('pay-seed-2', 2, 'Sebastian Bastian', 'Desarrollo de Modulo', 1200000, '14 Oct, 2026', 'pending'),
('pay-seed-3', 3, 'MaxiMaxi', 'Mantenimiento de Agenda', 300000, '05 Oct, 2026', 'overdue'),
('pay-seed-4', 6, 'Carlos Mendoza', 'Revisión Contractual', 600000, '22 Oct, 2026', 'pending');

-- 4. Calendario / Audiencias iniciales sincronizadas
INSERT OR IGNORE INTO calendar_events (id, title, date, start_time, end_time, color_id, alarm_minutes, client_id, details) VALUES
('cal-seed-1', 'Audiencia: El manzano', '2026-10-28', '10:00', '11:00', 'blue', 15, 1, '1° Juzgado Civil de Santiago - EXP-2026-042'),
('cal-seed-2', 'Audiencia: Sebastian Bastian', '2026-10-14', '11:30', '12:30', 'mint', 30, 2, '2° Juzgado de Letras del Trabajo - EXP-2026-118'),
('cal-seed-3', 'Audiencia: MaxiMaxi', '2026-11-05', '09:30', '10:30', 'rose', 60, 3, 'Juzgado de Cobranza Judicial - EXP-2026-077'),
('cal-seed-4', 'Audiencia: Carlos Mendoza', '2026-10-22', '14:00', '15:00', 'lavender', 15, 6, '3° Juzgado Civil de Santiago - EXP-2026-155');

-- 5. Configuración inicial (Settings)
INSERT OR IGNORE INTO settings (key, value) VALUES
('hearingAlerts', 'true'),
('paymentReminders', 'true'),
('soundEffects', 'true'),
('accentColor', '"blue"'),
('lawyerName', '"Sebastián Contreras"'),
('lawyerEmail', '"s.contreras@estudiojuridico.cl"'),
('lawyerFirm', '"Contreras & Asociados • Derecho Civil y Litigios"');
