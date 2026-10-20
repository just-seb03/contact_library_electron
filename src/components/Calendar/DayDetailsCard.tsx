import type { FC } from 'react';
import { BlockTitle, Card, List, ListItem } from 'framework7-react';
import { useApp } from '../../context/AppContext';

interface DayDetailsCardProps {
  month: string;
  day: number;
}

export const DayDetailsCard: FC<DayDetailsCardProps> = ({ month, day }) => {
  const { hearings, setSelectedClientId } = useApp();
  const dayHearings = hearings.filter((hearing) => hearing.day === day);

  return (
    <Card>
      <BlockTitle>{day} de {month}</BlockTitle>
      {dayHearings.length > 0 ? (
        <List mediaList>
          {dayHearings.map((hearing) => (
            <ListItem
              key={hearing.id}
              title={`${hearing.clientName} - Audiencia`}
              subtitle={`${hearing.timeStr} · ${hearing.juzgado}`}
              text={`${hearing.expediente} · ${hearing.materia}`}
              link="#"
              onClick={() => setSelectedClientId(hearing.clientId)}
            />
          ))}
        </List>
      ) : (
        <p className="text-align-center text-color-gray">Sin eventos programados</p>
      )}
    </Card>
  );
};
