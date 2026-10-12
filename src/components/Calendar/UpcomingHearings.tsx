import type { CSSProperties, FC } from 'react';
import { Card, List, ListItem, Icon, BlockTitle } from 'framework7-react';

export const UpcomingHearings: FC = () => {
  return (
    <>
      <BlockTitle className="font-weight-bold" style={styles.title}>
        Próximas Audiencias
      </BlockTitle>
      <Card 
        outline={false}
        className="no-border margin-horizontal-none elevation-2"
        style={styles.glassCard}
      >
        <List mediaList className="no-hairlines no-hairlines-between" style={{ margin: '8px 0', background: 'transparent' }}>
          {[1, 2, 3, 4].map(i => (
            <ListItem
              key={i}
              title="----------------"
              subtitle="------------"
              text="---------------------------------"
              style={styles.upcomingPlaceholderItem}
            >
              <div slot="media" style={styles.upcomingIconWrapper}>
                <Icon f7="calendar" size="22px" color="gray" style={{ opacity: 0.4 }} />
              </div>
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
};

const styles: Record<string, CSSProperties> = {
  title: {
    fontSize: '18px',
    margin: '0 0 16px 0',
    color: '#1d1d1f',
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
  upcomingPlaceholderItem: {
    opacity: 0.55,
    borderRadius: '16px',
    margin: '4px 10px',
    background: 'rgba(255, 255, 255, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.55)',
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
