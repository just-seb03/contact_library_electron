import type { CSSProperties, FC } from 'react';
import { Card, List, ListItem, Icon, BlockTitle } from 'framework7-react';
import { useApp } from '../../context/AppContext';

export const UpcomingHearings: FC = () => {
  const { hearings, setSelectedClientId } = useApp();

  return (
    <>
      <BlockTitle className="font-weight-bold" style={styles.title}>
        Próximas Audiencias ({hearings.length})
      </BlockTitle>
      <Card 
        outline={false}
        className="no-border margin-horizontal-none elevation-2"
        style={styles.glassCard}
      >
        <List mediaList className="no-hairlines no-hairlines-between" style={{ margin: '8px 0', background: 'transparent' }}>
          {hearings.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
              No hay audiencias programadas
            </div>
          ) : (
            hearings.map((h) => (
              <ListItem
                key={h.id}
                title={h.clientName}
                subtitle={h.dateStr}
                text={`${h.expediente} · ${h.materia}`}
                onClick={() => setSelectedClientId(h.clientId)}
                style={styles.upcomingItem}
                className="upcoming-hearing-item"
              >
                <div slot="media" style={styles.upcomingIconWrapper} className="upcoming-icon-box">
                  <Icon f7="calendar_badge_clock" size="22px" color="blue" />
                </div>
              </ListItem>
            ))
          )}
        </List>
      </Card>
    </>
  );
};

const styles: Record<string, CSSProperties> = {
  title: {
    fontSize: '18px',
    margin: '0 0 16px 0',
    color: 'inherit',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  upcomingItem: {
    borderRadius: '16px',
    margin: '6px 10px',
    background: 'rgba(255, 255, 255, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  upcomingIconWrapper: {
    width: '56px',
    height: '56px',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
