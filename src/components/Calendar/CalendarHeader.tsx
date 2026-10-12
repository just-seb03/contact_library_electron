import type { CSSProperties, FC } from 'react';
import { Block, Button, Icon, Searchbar } from 'framework7-react';

interface CalendarHeaderProps {
  month: string;
  year: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNext?: () => void;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  month,
  year,
  searchQuery,
  onSearchChange,
  onNext,
}) => {
  return (
    <Block className="display-flex justify-content-space-between align-items-center" style={styles.headerBlock}>
      {/* Izquierda: Título y Navegación */}
      <div className="display-flex align-items-center">
        <h1 style={styles.title}>
          {month} {year}
        </h1>
        <Button 
          round 
          small 
          onClick={onNext}
          className="display-flex align-items-center justify-content-center elevation-1"
          style={styles.glassButton}
        >
          <Icon f7="chevron_right" size="16px" color="gray" />
        </Button>
      </div>

      {/* Derecha: Barra de Búsqueda nativa de Framework7 */}
      <div style={styles.searchbarWrapper}>
        <Searchbar
          inline
          customSearch
          disableButton={false}
          clearButton
          backdrop={false}
          placeholder="Buscar audiencias, casos, clientes..."
          value={searchQuery}
          onInput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
          style={styles.searchbar}
        />
      </div>
    </Block>
  );
};

const styles: Record<string, CSSProperties> = {
  headerBlock: {
    marginTop: '60px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: 0,
    color: 'inherit',
    letterSpacing: '-0.5px',
  },
  glassButton: {
    marginLeft: '12px',
    width: '32px',
    height: '32px',
    minWidth: '32px',
    padding: 0,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  searchbarWrapper: {
    width: '320px',
  },
  searchbar: {
    background: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.75)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
  },
};
