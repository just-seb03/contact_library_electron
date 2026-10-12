import type { CSSProperties, FC } from 'react';

export type FilterType = 'all' | 'completed' | 'pending';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const PaymentsFilterBar: FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  const baseTabStyle: CSSProperties = {
    background: 'rgba(0, 0, 0, 0.04)',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6e6e73',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  // Estilo superpuesto cuando la pestaña está seleccionada
  const activeTabStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#1d1d1f',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    fontWeight: '600',
  };

  return (
    <div className="display-flex flex-wrap margin-bottom" style={{ gap: '8px' }}>
      <button
        className={`filter-tab-btn ${currentFilter === 'all' ? 'active' : ''}`}
        onClick={() => onFilterChange('all')}
        style={{ ...baseTabStyle, ...(currentFilter === 'all' ? activeTabStyle : {}) }}
      >
        Todos
      </button>
      <button
        className={`filter-tab-btn ${currentFilter === 'completed' ? 'active' : ''}`}
        onClick={() => onFilterChange('completed')}
        style={{ ...baseTabStyle, ...(currentFilter === 'completed' ? activeTabStyle : {}) }}
      >
        Completados
      </button>
      <button
        className={`filter-tab-btn ${currentFilter === 'pending' ? 'active' : ''}`}
        onClick={() => onFilterChange('pending')}
        style={{ ...baseTabStyle, ...(currentFilter === 'pending' ? activeTabStyle : {}) }}
      >
        Pendientes / Vencidos
      </button>
    </div>
  );
};