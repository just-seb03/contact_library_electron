import type { CSSProperties, FC } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment } from './types';
import { formatCLP } from '../../utils/format';

interface TableProps {
  payments: Payment[];
  onStatusChange?: (id: string, status: 'completed' | 'pending' | 'overdue') => void;
}

export const PaymentsTable: FC<TableProps> = ({ payments, onStatusChange }) => {
  const { darkMode } = useApp();

  const tableWrapperStyle: CSSProperties = {
    background: darkMode ? 'rgba(22, 24, 30, 0.65)' : 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '18px',
    overflowX: 'auto', 
    width: '100%',
    color: darkMode ? '#f5f5f7' : 'inherit',
  };

  const nextStatusMap: Record<Payment['status'], Payment['status']> = {
    completed: 'pending',
    pending: 'overdue',
    overdue: 'completed',
  };

  return (
    <div className="data-table elevation-2 margin-bottom" style={tableWrapperStyle}>
      <table>
        <thead>
          <tr>
            <th className="label-cell text-color-gray text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Cliente / Entidad</th>
            <th className="label-cell text-color-gray text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Concepto</th>
            <th className="label-cell text-color-gray text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Fecha</th>
            <th className="numeric-cell text-color-gray text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Monto</th>
            <th className="label-cell text-color-gray text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((item) => (
            <tr key={item.id}>
              <td className="label-cell font-weight-600" style={{ color: 'inherit' }}>
                {item.client}
              </td>
              <td className="label-cell text-color-gray">{item.concept}</td>
              <td className="label-cell text-color-gray">{item.date}</td>
              <td className="numeric-cell font-weight-600" style={{ color: 'inherit' }}>
                {formatCLP(item.amount)}
              </td>
              <td className="label-cell">
                <span 
                  className={`badge ${getBadgeColor(item.status)}`} 
                  onClick={() => onStatusChange && onStatusChange(item.id, nextStatusMap[item.status])}
                  style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: 600,
                    cursor: onStatusChange ? 'pointer' : 'default',
                    userSelect: 'none',
                    transition: 'transform 0.15s ease',
                  }}
                  title={onStatusChange ? 'Haz clic para cambiar estado' : undefined}
                >
                  {getStatusText(item.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Asigna la clase de color nativa de Framework7
const getBadgeColor = (status: Payment['status']): string => {
  if (status === 'completed') return 'color-green';
  if (status === 'pending') return 'color-orange';
  return 'color-red';
};

// Traduce el estado a texto legible
const getStatusText = (status: Payment['status']): string => {
  if (status === 'completed') return 'Completado';
  if (status === 'pending') return 'Pendiente';
  return 'Vencido';
};