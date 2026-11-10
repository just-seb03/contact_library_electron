import { Page, Card, CardContent, CardHeader, Icon, Badge, Button } from 'framework7-react';
import { useDashboard } from '../hooks/useDashboard';
import { useHomeData } from '../hooks/useHomeData';
import { UpcomingMeetingCard } from '../components/UpcomingMeetingCard';
import { DailyProgressCard } from '../components/DailyProgressCard';
import {
  DASHBOARD_INNER_SURFACE_STYLE,
  DASHBOARD_PAGE_STYLE,
  DASHBOARD_WIDGET_STYLE,
} from '../styles';

export default function Dashboard() {
  const { lawyerName, todayLabel, nextMeeting, openClient: openClientHome, showTab } = useHomeData();
  const { todayHearings, openClient } = useDashboard();

  return (
    <Page noNavbar noToolbar>
      <div
        style={{
          ...DASHBOARD_PAGE_STYLE,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '1280px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* ── HEADER: fecha + saludo (izq) | acciones rápidas (der) ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <span
              className="text-color-gray text-transform-capitalize"
              style={{ fontSize: '12px', display: 'block', marginBottom: '7px', letterSpacing: '0.02em' }}
            >
              {todayLabel}
            </span>
            <h1 className="no-margin font-weight-bold" style={{ fontSize: '30px', letterSpacing: '-0.03em', color: 'var(--macos-text, #1c1c1e)' }}>
              Hola, {lawyerName}
            </h1>
          </div>

          {/* Botones de acción rápida */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {[
              { icon: 'calendar_badge_plus', label: '+ Nueva Cita', action: () => showTab('calendar') },
              { icon: 'person_badge_plus',   label: '+ Cliente',    action: () => showTab('cliente') },
            ].map(({ icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  background: 'var(--macos-input-bg, rgba(255, 255, 255, 0.55))',
                  border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.08))',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--macos-accent-color, #007aff)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--macos-accent-tint, rgba(0,122,255,0.15))')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--macos-input-bg, rgba(255, 255, 255, 0.55))')}
              >
                <Icon f7={icon} size="14px" style={{ color: 'var(--macos-accent-color, #007aff)' }} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── FILA MEDIA: Próxima reunión (izq) | Resumen del día (der) ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            alignItems: 'stretch',
          }}
        >
          <UpcomingMeetingCard
            nextMeeting={nextMeeting}
            onOpenClient={openClientHome}
          />

          <DailyProgressCard />
        </div>

        {/* ── FILA INFERIOR: Audiencias de hoy ── */}
        <Card outline className="no-margin" style={{ ...DASHBOARD_WIDGET_STYLE, width: '100%' }}>
          <CardHeader style={{ padding: '14px 16px 10px 16px' }}>
            <div className="display-flex align-items-center" style={{ gap: '8px', marginLeft: '4px' }}>
              <Icon f7="calendar_badge_clock" size="18px" style={{ color: 'var(--macos-accent-color, #007aff)', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--macos-text, #1c1c1e)', marginLeft: '12px' }}>
                Audiencias de hoy
              </span>
              {todayHearings.length > 0 && (
                <Badge color="blue" style={{ fontSize: '11px', padding: '0 6px', backgroundColor: 'var(--macos-accent-color, #007aff)' }}>
                  {todayHearings.length}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent style={{ padding: '0 16px 16px 16px' }}>
            {todayHearings.length === 0 ? (
              <div
                className="display-flex align-items-center justify-content-center"
                style={{ padding: '32px 0', flexDirection: 'column', gap: '8px' }}
              >
                <Icon f7="checkmark_seal_fill" size="36px" style={{ color: '#34c759', opacity: 0.7 }} />
                <span className="text-color-gray" style={{ fontSize: '15px' }}>
                  No hay audiencias programadas para hoy
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {todayHearings.map((hearing) => (
                  <div
                    key={hearing.id}
                    style={{
                      ...DASHBOARD_INNER_SURFACE_STYLE,
                      backgroundColor: 'var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.055))',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#1c1c1e',
                          display: 'block',
                          marginBottom: '8px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {hearing.clientName}
                      </span>

                      <div
                        style={{
                          ...DASHBOARD_INNER_SURFACE_STYLE,
                          backgroundColor: 'var(--macos-accent-tint-subtle, rgba(0, 122, 255, 0.045))',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div className="display-flex align-items-center" style={{ gap: '4px' }}>
                          <Icon f7="clock_fill" size="14px" style={{ color: 'var(--macos-accent-color, #007aff)' }} />
                          <span style={{ fontSize: '13px', color: 'var(--macos-accent-color, #007aff)', fontWeight: 600 }}>{hearing.timeStr}</span>
                        </div>
                        <div className="display-flex align-items-center" style={{ gap: '4px' }}>
                          <Icon f7="briefcase_fill" size="14px" className="text-color-gray" />
                          <span className="text-color-gray" style={{ fontSize: '13px' }}>{hearing.materia}</span>
                        </div>
                        {hearing.juzgado && (
                          <div className="display-flex align-items-center" style={{ gap: '4px' }}>
                            <Icon f7="building_columns_fill" size="14px" className="text-color-gray" />
                            <span className="text-color-gray" style={{ fontSize: '13px' }}>{hearing.juzgado}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      small
                      round
                      outline
                      onClick={() => openClient(hearing.clientId)}
                      style={{ fontSize: '11px', flexShrink: 0 }}
                    >
                      Ver expediente
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
