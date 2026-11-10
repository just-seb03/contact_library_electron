import { MOCK_CLIENTS } from './mockData';
import type { Client, ClientCase, ClientDocument, ClientPaymentInfo, Payment } from './types';

const CLIENTS_STORAGE_KEY = 'contact_library_clients';
const REGISTERED_PAYMENTS_STORAGE_KEY = 'contact_library_registered_payments';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isClientCase(value: unknown): value is ClientCase {
  if (!isRecord(value)) return false;
  return typeof value.expediente === 'string'
    && typeof value.juzgado === 'string'
    && typeof value.materia === 'string'
    && typeof value.estado === 'string'
    && (value.proximaAudiencia === undefined || typeof value.proximaAudiencia === 'string');
}

function isClientPayment(value: unknown): value is ClientPaymentInfo {
  if (!isRecord(value)) return false;
  return typeof value.monto === 'number'
    && typeof value.concepto === 'string'
    && typeof value.fecha === 'string'
    && ['completed', 'pending', 'overdue'].includes(String(value.estado));
}

function isClientDocument(value: unknown): value is ClientDocument {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.dataUrl === 'string'
    && typeof value.size === 'number'
    && typeof value.uploadedAt === 'string';
}

function isClient(value: unknown): value is Client {
  if (!isRecord(value)) return false;
  const client = value;
  const validStatus = client.status === undefined
    || (
      typeof client.status === 'string'
      && ['activo', 'en_proceso', 'completado'].includes(client.status)
    );

  return Number.isSafeInteger(client.id)
    && typeof client.name === 'string'
    && typeof client.phone === 'string'
    && (client.email === undefined || typeof client.email === 'string')
    && (client.rut === undefined || typeof client.rut === 'string')
    && validStatus
    && (client.caso === undefined || isClientCase(client.caso))
    && (client.pago === undefined || isClientPayment(client.pago))
    && (client.documentos === undefined
      || (Array.isArray(client.documentos) && client.documentos.every(isClientDocument)));
}

export function loadClients(): Client[] {
  try {
    const stored = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!stored) return MOCK_CLIENTS;
    const parsed: unknown = JSON.parse(stored);
    if (
      !Array.isArray(parsed)
      || !parsed.every(isClient)
      || new Set(parsed.map((client) => client.id)).size !== parsed.length
    ) {
      throw new Error('Los datos guardados de clientes no son válidos.');
    }
    return parsed;
  } catch (error) {
    console.error('No se pudieron cargar los clientes guardados.', error);
    return MOCK_CLIENTS;
  }
}

export function saveClients(clients: Client[]): void {
  try {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  } catch (error) {
    console.error('No se pudieron guardar los clientes.', error);
  }
}

export function loadRegisteredPayments(clients: Client[]): Payment[] {
  try {
    const stored = localStorage.getItem(REGISTERED_PAYMENTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('El contenido guardado no es una lista.');
    const validPayments = parsed.filter(
      (payment): payment is Payment =>
        typeof payment?.id === 'string' &&
        typeof payment?.client === 'string' &&
        (payment?.clientId === undefined || Number.isSafeInteger(payment.clientId)) &&
        typeof payment?.concept === 'string' &&
        typeof payment?.amount === 'number' &&
        typeof payment?.date === 'string' &&
        ['completed', 'pending', 'overdue'].includes(payment?.status)
    );
    const linkedPayments = validPayments.filter((payment) => (
      payment.clientId !== undefined
        ? clients.some((client) => client.id === payment.clientId)
        : clients.some((client) => client.name === payment.client)
    ));
    if (linkedPayments.length !== validPayments.length) {
      console.info('Se eliminaron pagos registrados que no pertenecen a ningún cliente.');
    }
    return linkedPayments;
  } catch (error) {
    console.error('No se pudieron cargar los pagos registrados.', error);
    return [];
  }
}

export function saveRegisteredPayments(payments: Payment[]): void {
  try {
    localStorage.setItem(REGISTERED_PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
  } catch (error) {
    console.error('No se pudieron guardar los pagos registrados.', error);
  }
}
