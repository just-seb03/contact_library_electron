export type ClientStatus = 'activo' | 'en_proceso' | 'completado';

export interface ClientCase {
  expediente: string;
  juzgado: string;
  materia: string;
  estado: string;
  proximaAudiencia?: string;
}

export interface ClientPaymentInfo {
  monto: number;
  concepto: string;
  fecha: string;
  estado: 'completed' | 'pending' | 'overdue';
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  rut?: string;
  status?: ClientStatus;
  caso?: ClientCase;
  pago?: ClientPaymentInfo;
}
