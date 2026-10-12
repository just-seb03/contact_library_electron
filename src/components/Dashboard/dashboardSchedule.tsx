import { Card, CardContent, List, ListItem, Icon, Button, Badge } from 'framework7-react';
import type { CSSProperties } from 'react';
import type { AppTab, HearingEvent } from '../../context/types';

interface DashboardScheduleProps {
  todayHearings: HearingEvent[];
  upcomingHearings: HearingEvent[];
  openClient: (clientId: number) => void;
  showTab: (tabId: string, activeTab: AppTab) => void;
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
  color: '#263246',
};

const emptyStateStyle: CSSProperties = {
  minHeight: '68px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  color: '#9aa3b1',
  fontSize: '12px',
  textAlign: 'center',
  flex: 1,
};

const listStyle: CSSProperties = { margin: 0, flex: '1 0 auto', overflowY: 'visible' };
const listItemStyle: CSSProperties = {
  border: '1px solid #edf0f4',
  borderRadius: '13px',
  background: 'rgba(255, 255, 255, 0.72)',
  marginBottom: '6px',
};

export function DashboardSchedule({
  todayHearings,
  upcomingHearings,
  openClient,
  showTab,
}: DashboardScheduleProps) {
  return (
    <section className="row" style={{ flex: '0 0 auto' }} aria-label="Agenda y próximas audiencias">
      <div className="col-100 medium-50 margin-bottom-half" style={{ display: 'flex' }}>
        <Card className="elevation-2 margin-horizontal-none" style={{ ...glassCardStyle, display: 'flex', flex: 1 }}>
          <CardContent style={{ padding: '15px', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Audiencias de hoy</h2>
              <Badge
                style={{
                  background: '#eaf2ff',
                  color: '#3477ce',
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
                    style={listItemStyle}
                  >
                    <div
                      slot="media"
                      style={{
                        color: '#3378d0',
                        background: '#edf4ff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '6px 8px',
                        borderRadius: '9px',
                        display: 'inline-block',
                      }}
                    >
                      {hearing.timeStr}
                    </div>
                    <div slot="title" style={{ fontWeight: 600, color: '#1d2735' }}>{hearing.clientName}</div>
                    <div slot="text" style={{ fontSize: '12px', color: '#758093' }}>{hearing.materia}</div>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="col-100 medium-50 margin-bottom-half" style={{ display: 'flex' }}>
        <Card className="elevation-2 margin-horizontal-none" style={{ ...glassCardStyle, display: 'flex', flex: 1 }}>
          <CardContent style={{ padding: '15px', display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>Próximas audiencias</h2>
              <Button
                small
                onClick={() => showTab('#view-calendar', 'calendar')}
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
                    <div slot="title" style={{ fontWeight: 600, color: '#1d2735' }}>{hearing.clientName}</div>
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
