import type { CSSProperties, FC } from 'react';
import { useApp } from '../../context/AppContext';

export type FilterType = 'all' | 'completed' | 'pending';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const PaymentsFilterBar: FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  const { darkMode } = useApp();

  const baseTabStyle: CSSProperties = {
    background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '500',
    color: darkMode ? '#a1a1a6' : '#6e6e73',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  // Estilo superpuesto cuando la pestaña está seleccionada
  const activeTabStyle: CSSProperties = {
    background: darkMode ? '#007aff' : 'rgba(255, 255, 255, 0.8)',
    color: darkMode ? '#ffffff' : '#1d1d1f',
    boxShadow: darkMode ? '0 4px 12px rgba(0, 122, 255, 0.35)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
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