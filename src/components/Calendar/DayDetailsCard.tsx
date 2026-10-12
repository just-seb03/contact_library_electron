import type { CSSProperties, FC } from 'react';
import { Card, CardContent, List, ListItem, Icon } from 'framework7-react';
import { useApp } from '../../context/AppContext';

interface DayDetailsCardProps {
  month: string;
  day: number;
}

export const DayDetailsCard: FC<DayDetailsCardProps> = ({ month, day }) => {
  const { hearings, setSelectedClientId, darkMode } = useApp();
  const dayHearings = hearings.filter((h) => h.day === day);

  const cardStyle: CSSProperties = {
    ...styles.glassCard,
    ...(darkMode ? {
      background: 'rgba(22, 24, 30, 0.65)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
      color: '#f5f5f7',
    } : {}),
  };

  const badgeStyle: CSSProperties = {
    ...styles.dateBadge,
    ...(darkMode ? {
      background: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      color: '#f5f5f7',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    } : {}),
  };

  const listContainerStyle: CSSProperties = {
    ...styles.listContainer,
    ...(darkMode ? {
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
    } : {}),
  };

  const eventItemStyle: CSSProperties = {
    ...styles.emptyEventItem,
    ...(darkMode ? {
      background: 'rgba(255, 255, 255, 0.06)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      color: '#f5f5f7',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    } : {}),
  };

  return (
    <Card 
      outline={false}
      className="no-border margin-horizontal-none elevation-2"
      style={cardStyle}
    >
      <CardContent className="display-flex align-items-center" style={{ padding: '18px 24px' }}>
        <div style={badgeStyle} className="day-details-date-badge">
          <div style={{ ...styles.badgeMonth, color: darkMode ? '#8e8e93' : '#8e8e93' }}>
            {month}
          </div>
          <div style={{ ...styles.badgeDay, color: darkMode ? '#f5f5f7' : 'inherit' }}>
            {day}
          </div>
        </div>
        <div style={listContainerStyle}>
          <List mediaList className="no-hairlines no-hairlines-between" style={{ margin: 0, background: 'transparent' }}>
            {dayHearings.length > 0 ? (
              dayHearings.map((h) => (
                <ListItem
                  key={h.id}
                  title={`${h.clientName} - Audiencia`}
                  subtitle={`${h.timeStr} · ${h.juzgado}`}
                  text={`${h.expediente} · ${h.materia}`}
                  onClick={() => setSelectedClientId(h.clientId)}
                  style={{ ...eventItemStyle, cursor: 'pointer' }}
                  className="day-details-event-item"
                >
                  <Icon slot="media" f7="calendar_badge_plus" size="30px" color="blue" />
                </ListItem>
              ))
            ) : (
              <ListItem
                title="Sin eventos programados"
                subtitle="Espacio reservado para detalles de audiencia / caso"
                style={eventItemStyle}
                className="day-details-event-item"
              >
                <Icon slot="media" f7="calendar_badge_minus" size="30px" color="gray" />
              </ListItem>
            )}
          </List>
        </div>
      </CardContent>
    </Card>
  );
};

const styles: Record<string, CSSProperties> = {
  glassCard: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  dateBadge: {
    minWidth: '85px',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '18px',
    padding: '10px 14px',
    border: '1px solid rgba(255, 255, 255, 0.75)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
  },
  badgeMonth: {
    fontSize: '13px',
    color: '#8e8e93',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  badgeDay: {
    fontSize: '38px',
    fontWeight: 'bold',
    lineHeight: '1.1',
    color: 'inherit',
  },
  listContainer: {
    flex: 1,
    borderLeft: '1px solid rgba(0, 0, 0, 0.07)',
    paddingLeft: '20px',
    marginLeft: '20px',
  },
  emptyEventItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
  },
};
