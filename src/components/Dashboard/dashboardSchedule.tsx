import { Card, CardContent, List, ListItem, Icon, Button, Badge } from 'framework7-react';
import type { CSSProperties } from 'react';
import { useApp } from '../../context/AppContext';
import type { AppTab, HearingEvent } from '../../context/types';

interface DashboardScheduleProps {
  todayHearings: HearingEvent[];
  upcomingHearings: HearingEvent[];
  openClient: (clientId: number) => void;
  showTab: (tab: AppTab) => void;
}

const glassCardStyle: CSSProperties = {
  margin: 0,
  border: '1px solid rgba(255, 255, 255, 0.6)',
  borderRadius: '18px',
  background: 'rgba(255, 255, 255, 0.45)',
  boxShadow: '0 8px 24px rgba(35, 45, 65, 0.045)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
};

const panelHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '10px',
  flexShrink: 0,
};

const panelTitleStyle: CSSProperties = {
  fontSize: '15px',
  margin: 0,
  fontWeight: 700,
  color: 'inherit',
};

const emptyStateStyle: CSSProperties = {
  minHeight: '68px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  color: '#8e8e93',
  fontSize: '12px',
  textAlign: 'center',
  flex: 1,
};

const listStyle: CSSProperties = { margin: 0, flex: '1 0 auto', overflowY: 'visible' };
const listItemStyle: CSSProperties = {
  borderRadius: '13px',
  marginBottom: '6px',
};

export function DashboardSchedule({
  todayHearings,
  upcomingHearings,
  openClient,
  showTab,
}: DashboardScheduleProps) {
  const { darkMode } = useApp();

  const dynamicCardStyle: CSSProperties = {
    ...glassCardStyle,
    ...(darkMode ? {
      background: 'rgba(22, 24, 30, 0.65)',
      border: 'none',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
      color: '#f5f5f7',
    } : {}),
    display: 'flex',
    flex: 1,
  };

  const dynamicItemStyle: CSSProperties = {
    ...listItemStyle,
    ...(darkMode ? {
      background: 'rgba(255, 255, 255, 0.06)',
      border: 'none',
      boxShadow: 'none',
      color: '#f5f5f7',
    } : {}),
  };

  const badgeBg = darkMode ? 'rgba(0, 122, 255, 0.2)' : '#eaf2ff';
  const badgeColor = darkMode ? '#64d2ff' : '#3477ce';

  return (
    <section className="row" style={{ flex: '0 0 auto' }} aria-label="Agenda y próximas audiencias">
      <div className="col-100 medium-50 margin-bottom-half" style={{ display: 'flex' }}>
        <Card outline={false} className="no-border margin-horizontal-none" style={dynamicCardStyle}>
          <CardContent style={{ padding: '15px', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={panelHeaderStyle}>
              <h2 style={{ ...panelTitleStyle, color: darkMode ? '#f5f5f7' : 'inherit' }}>Audiencias de hoy</h2>
              <Badge
                style={{
                  background: badgeBg,
                  color: badgeColor,
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '0 8px',
                  height: '24px',
                  borderRadius: '10px',
                }}
              >
                {todayHearings.length}
              </Badge>
            </div>

            {todayHearings.length === 0 ? (
              <div style={emptyStateStyle}>
                <Icon f7="calendar_badge_check" />
                <span>Tu día está libre de audiencias.</span>
              </div>
            ) : (
              <List mediaList className="no-hairlines no-hairlines-between" style={listStyle}>
                {todayHearings.map((hearing) => (
                  <ListItem
                    key={hearing.id}
                    link="#"
                    onClick={() => openClient(hearing.clientId)}
                    style={dynamicItemStyle}
                    className="dashboard-schedule-item"
                  >
                    <div
                      slot="media"
                      style={{
                        color: darkMode ? '#64d2ff' : '#3378d0',
                        background: darkMode ? 'rgba(0, 122, 255, 0.2)' : '#edf4ff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '6px 8px',
                        borderRadius: '9px',
                        display: 'inline-block',
                      }}
                    >
                      {hearing.timeStr}
                    </div>
                    <div slot="title" style={{ fontWeight: 600, color: darkMode ? '#f5f5f7' : 'inherit' }}>{hearing.clientName}</div>
                    <div slot="text" style={{ fontSize: '12px', color: darkMode ? '#a1a1a6' : '#758093' }}>{hearing.materia}</div>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="col-100 medium-50 margin-bottom-half" style={{ display: 'flex' }}>
        <Card outline={false} className="no-border margin-horizontal-none" style={dynamicCardStyle}>
          <CardContent style={{ padding: '15px', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Próximas audiencias</h2>
              <Button
                small
                onClick={() => showTab('calendar')}
                style={{ color: '#377bd1', fontWeight: 600, textTransform: 'none' }}
              >
                Ver agenda
              </Button>
            </div>

            {upcomingHearings.length === 0 ? (
              <div style={emptyStateStyle}>
                <Icon f7="calendar" />
                <span>No hay próximas audiencias registradas.</span>
              </div>
            ) : (
              <List mediaList className="no-hairlines no-hairlines-between" style={listStyle}>
                {upcomingHearings.map((hearing) => (
                  <ListItem
                    key={hearing.id}
                    link="#"
                    onClick={() => openClient(hearing.clientId)}
                    style={listItemStyle}
                    className="dashboard-schedule-item"
                  >
                    <div
                      slot="media"
                      style={{
                        minWidth: '49px',
                        color: '#007aff',
                        background: '#edf4ff',
                        fontSize: '11px',
                        fontWeight: 700,
                        textAlign: 'center',
                        padding: '6px 7px',
                        borderRadius: '9px',
                        display: 'inline-block',
                        textTransform: 'capitalize',
                      }}
                    >
                      {new Date(hearing.year, hearing.monthIndex, hearing.day).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                    <div slot="title" style={{ fontWeight: 600, color: 'inherit' }}>{hearing.clientName}</div>
                    <div slot="text" style={{ fontSize: '12px', color: '#758093' }}>
                      {hearing.timeStr} · {hearing.materia}
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
