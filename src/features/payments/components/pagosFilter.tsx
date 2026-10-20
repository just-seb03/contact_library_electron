import { Segmented, Button } from 'framework7-react';

export type FilterType = 'all' | 'completed' | 'pending';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const PaymentsFilterBar = ({ currentFilter, onFilterChange }: FilterBarProps) => (
  <Segmented className="margin-vertical">
    <Button tabLinkActive={currentFilter === 'all'} onClick={() => onFilterChange('all')}>Todos</Button>
    <Button tabLinkActive={currentFilter === 'completed'} onClick={() => onFilterChange('completed')}>Completados</Button>
    <Button tabLinkActive={currentFilter === 'pending'} onClick={() => onFilterChange('pending')}>Pendientes / Vencidos</Button>
  </Segmented>
);
