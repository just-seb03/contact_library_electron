import type { Client } from './types';
import type { HearingEvent } from './types';

const MONTH_MAP: Record<string, number> = {
  ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
  jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
};

export function parseHearing(client: Client): HearingEvent | null {
  if (!client.caso?.proximaAudiencia) return null;
  const raw = client.caso.proximaAudiencia;
  const match = raw.match(/(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{4})\s*-\s*(.+)/);
  if (!match) return null;

  return {
    id: `hearing-${client.id}`,
    clientId: client.id,
    clientName: client.name,
    expediente: client.caso.expediente,
    materia: client.caso.materia,
    juzgado: client.caso.juzgado,
    dateStr: raw,
    day: parseInt(match[1], 10),
    monthIndex: MONTH_MAP[match[2].toLowerCase()] ?? 9,
    year: parseInt(match[3], 10),
    timeStr: match[4].trim(),
  };
}
