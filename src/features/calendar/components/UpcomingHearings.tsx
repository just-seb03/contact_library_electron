import type { FC } from 'react';
import { BlockTitle, List, ListItem } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';

export const UpcomingHearings: FC = () => {
  const { hearings, setSelectedClientId } = useApp();

  return (
    <>
      <BlockTitle>Próximas audiencias ({hearings.length})</BlockTitle>
      {hearings.length === 0 ? (
        <p className="text-align-center text-color-gray">No hay audiencias programadas</p>
      ) : (
        <List mediaList strong inset>
          {hearings.map((hearing) => (
            <ListItem
              key={hearing.id}
              title={hearing.clientName}
              subtitle={hearing.dateStr}
              text={`${hearing.expediente} · ${hearing.materia}`}
              link="#"
              onClick={() => setSelectedClientId(hearing.clientId)}
            />
          ))}
        </List>
      )}
    </>
  );
};
