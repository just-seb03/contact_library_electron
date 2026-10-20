import type { FC } from 'react';
import { Block, BlockTitle, Button, Icon, Searchbar } from 'framework7-react';

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
}) => (
  <Block className="no-margin-top padding-top-half">
    <BlockTitle className="no-margin-top">
      {month} {year}
      <Button slot="after" round small onClick={onNext} aria-label="Mes siguiente">
        <Icon f7="chevron_right" />
      </Button>
    </BlockTitle>
    <Searchbar
      inline
      customSearch
      clearButton
      placeholder="Buscar audiencias, casos, clientes..."
      value={searchQuery}
      onInput={(event) => onSearchChange((event.target as HTMLInputElement).value)}
    />
  </Block>
);
