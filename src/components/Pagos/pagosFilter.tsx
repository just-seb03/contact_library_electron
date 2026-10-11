import React from 'react';

type FilterType = 'all' | 'completed' | 'pending';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const PaymentsFilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div style={styles.filterBar}>
      <button
        onClick={() => onFilterChange('all')}
        style={{ ...styles.filterTab, ...(currentFilter === 'all' ? styles.activeFilterTab : {}) }}
      >
        Todos
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        style={{ ...styles.filterTab, ...(currentFilter === 'completed' ? styles.activeFilterTab : {}) }}
      >
        Completados
      </button>
      <button
        onClick={() => onFilterChange('pending')}
        style={{ ...styles.filterTab, ...(currentFilter === 'pending' ? styles.activeFilterTab : {}) }}
      >
        Pendientes / Vencidos
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  filterTab: {
    background: 'rgba(0, 0, 0, 0.04)',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6e6e73',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeFilterTab: {
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#1d1d1f',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    fontWeight: '600',
  },
};