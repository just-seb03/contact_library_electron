import { Icon, Link, List, ListItem, Navbar, NavRight, NavTitle, Page, Popup } from 'framework7-react';
import { useApp } from '../../context/AppContext';

type DayScheduleProps = {
  date: number;
  monthIndex: number;
  month: string;
  year: number;
  onClose: () => void;
};

export const DayScheduleOverlay = ({ date, monthIndex, month, year, onClose }: DayScheduleProps) => {
  const { hearings } = useApp();
  const dayHearings = hearings.filter(
    (hearing) => hearing.day === date && hearing.monthIndex === monthIndex && hearing.year === year
  );

  return (
    <Popup opened closeByBackdropClick onPopupClosed={onClose}>
      <Page>
        <Navbar>
          <NavTitle>{date} de {month} de {year}</NavTitle>
          <NavRight>
            <Link popupClose aria-label="Cerrar">
              <Icon f7="xmark" />
            </Link>
          </NavRight>
        </Navbar>
        {dayHearings.length === 0 ? (
          <p className="text-align-center text-color-gray">Sin audiencias programadas</p>
        ) : (
          <List mediaList>
            {dayHearings.map((hearing) => (
              <ListItem
                key={hearing.id}
                title={hearing.clientName}
                subtitle={hearing.timeStr}
                text={`${hearing.expediente} · ${hearing.materia} · ${hearing.juzgado}`}
              />
            ))}
          </List>
        )}
      </Page>
    </Popup>
  );
};
