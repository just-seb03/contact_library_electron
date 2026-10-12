import type { CSSProperties, FC } from 'react';
import { Card, CardContent, List, ListItem, Icon } from 'framework7-react';

interface DayDetailsCardProps {
  month: string;
  day: number;
}

export const DayDetailsCard: FC<DayDetailsCardProps> = ({ month, day }) => {
  return (
    <Card 
      outline={false}
      className="no-border margin-horizontal-none elevation-2"
      style={styles.glassCard}
    >
      <CardContent className="display-flex align-items-center" style={{ padding: '18px 24px' }}>
        <div style={styles.dateBadge}>
          <div style={styles.badgeMonth}>
            {month}
          </div>
          <div style={styles.badgeDay}>
            {day}
          </div>
        </div>
        <div style={styles.listContainer}>
          <List mediaList className="no-hairlines no-hairlines-between" style={{ margin: 0, background: 'transparent' }}>
            <ListItem
              title="Sin eventos programados"
              subtitle="Espacio reservado para detalles de audiencia / caso"
              style={styles.emptyEventItem}
            >
              <Icon slot="media" f7="calendar_badge_minus" size="30px" color="gray" />
            </ListItem>
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
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  badgeDay: {
    fontSize: '38px',
    fontWeight: 'bold',
    lineHeight: '1.1',
    color: '#1d1d1f',
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
