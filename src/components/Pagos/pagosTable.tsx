import React from 'react';
import { Payment } from './types';

interface TableProps {
  payments: Payment[];
}

export const PaymentsTable: React.FC<TableProps> = ({ payments }) => {
  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.th}>Cliente / Entidad</th>
            <th style={styles.th}>Concepto</th>
            <th style={styles.th}>Fecha</th>
            <th style={styles.th}>Monto</th>
            <th style={styles.th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => (
            <tr key={item.id} style={styles.tableRow}>
              <td style={styles.tdBold}>{item.client}</td>
              <td style={styles.td}>{item.concept}</td>
              <td style={styles.td}>{item.date}</td>
              <td style={styles.tdAmount}>${item.amount.toFixed(2)}</td>
              <td style={styles.td}>
                <span style={getStatusBadgeStyle(item.status)}>
                  {item.status === 'completed' && 'Completado'}
                  {item.status === 'pending' && 'Pendiente'}
                  {item.status === 'overdue' && 'Vencido'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getStatusBadgeStyle = (status: Payment['status']): React.CSSProperties => {
  const base: React.CSSProperties = {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'inline-block',
  };

  if (status === 'completed') return { ...base, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#065f46' };
  if (status === 'pending') return { ...base, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#92400e' };
  return { ...base, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#991b1b' };
};

const styles: { [key: string]: React.CSSProperties } = {
  tableContainer: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  th: {
    padding: '14px 18px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
    transition: 'background-color 0.15s ease',
  },
  tdBold: {
    padding: '14px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1d1d1f',
  },
  td: {
    padding: '14px 18px',
    fontSize: '13px',
    color: '#424245',
  },
  tdAmount: {
    padding: '14px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1d1d1f',
  },
};