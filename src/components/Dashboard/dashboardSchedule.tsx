import { BlockTitle, Button, Card, List, ListItem } from 'framework7-react';
import type { AppTab, HearingEvent } from '../../context/types';

interface DashboardScheduleProps {
  todayHearings: HearingEvent[];
  upcomingHearings: HearingEvent[];
  openClient: (clientId: number) => void;
  showTab: (tab: AppTab) => void;
}

export function DashboardSchedule({
  todayHearings,
  upcomingHearings,
  openClient,
  showTab,
}: DashboardScheduleProps) {
  return (
    <section aria-label="Agenda y próximas audiencias">
      <Card>
        <BlockTitle>Audiencias de hoy ({todayHearings.length})</BlockTitle>
        {todayHearings.length === 0 ? (
          <p className="text-align-center text-color-gray">Tu día está libre de audiencias.</p>
        ) : (
          <List mediaList>
            {todayHearings.map((hearing) => (
              <ListItem
                key={hearing.id}
                title={hearing.clientName}
                subtitle={hearing.timeStr}
                text={hearing.materia}
                link="#"
                onClick={() => openClient(hearing.clientId)}
              />
            ))}
          </List>
        )}
      </Card>

      <Card>
        <BlockTitle>
          Próximas audiencias
          <Button slot="after" small onClick={() => showTab('calendar')}>Ver agenda</Button>
        </BlockTitle>
        {upcomingHearings.length === 0 ? (
          <p className="text-align-center text-color-gray">No hay próximas audiencias registradas.</p>
        ) : (
          <List mediaList>
            {upcomingHearings.map((hearing) => (
              <ListItem
                key={hearing.id}
                title={hearing.clientName}
                subtitle={new Date(hearing.year, hearing.monthIndex, hearing.day).toLocaleDateString('es-CL')}
                text={`${hearing.timeStr} · ${hearing.materia}`}
                link="#"
                onClick={() => openClient(hearing.clientId)}
              />
            ))}
          </List>
        )}
      </Card>
    </section>
  );
}
