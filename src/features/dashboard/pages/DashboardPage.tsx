import { Page, Card, CardContent, CardHeader, Icon, Badge, Button } from 'framework7-react';
import { useDashboard } from '../hooks/useDashboard';
import { useHomeData } from '../../home/hooks/useHomeData';
import { UpcomingMeetingCard } from '../../home/components/UpcomingMeetingCard';
import { GLASS_CARD_STYLE } from '../../../core/theme/style';

export default function Dashboard() {
  const { lawyerName, todayLabel, nextMeeting, openClient: openClientHome, showTab } = useHomeData();
  const { todayHearings, openClient, paymentsToReviewCount, clientsCount } = useDashboard();

  return (
    <Page noNavbar noToolbar>
      <div
        style={{
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '1200px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* ── HEADER: fecha + saludo (izq) | acciones rápidas (der) ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <span
              className="text-color-gray text-transform-capitalize"
              style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}
            >
              {todayLabel}
            </span>
            <h1 className="no-margin font-weight-bold" style={{ fontSize: '26px', color: '#1c1c1e' }}>
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
                  background: 'rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.10)',
                  borderRadius: '10px',
                  padding: '7px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#007aff',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,122,255,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
              >
                <Icon f7={icon} size="14px" style={{ color: '#007aff' }} />
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
            lawyerName={lawyerName}
            todayLabel={todayLabel}
            nextMeeting={nextMeeting}
            onOpenClient={openClientHome}
            onViewSchedule={() => showTab('calendar')}
          />

          {/* Resumen del día */}
          <Card outline className="no-margin" style={{ ...GLASS_CARD_STYLE, height: '100%' }}>
            <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#8e8e93', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Resumen del día
              </span>
            </CardHeader>
            <CardContent style={{ padding: '0 16px 16px 16px' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    icon: 'person_2_fill',
                    color: '#007aff',
                    text: `${clientsCount} ${clientsCount === 1 ? 'cliente registrado' : 'clientes registrados'}`,
                  },
                  {
                    icon: 'calendar_fill',
                    color: '#34c759',
                    text: `${todayHearings.length} ${todayHearings.length === 1 ? 'audiencia hoy' : 'audiencias hoy'}`,
                  },
                  {
                    icon: 'exclamationmark_circle_fill',
                    color: paymentsToReviewCount > 0 ? '#ff9500' : '#34c759',
                    text: `${paymentsToReviewCount} ${paymentsToReviewCount === 1 ? 'pago pendiente' : 'pagos pendientes'}`,
                  },
                ].map(({ icon, color, text }) => (
                  <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon f7={icon} size="18px" style={{ color, flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#1c1c1e' }}>{text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* ── FILA INFERIOR: Audiencias de hoy ── */}
        <Card outline className="no-margin" style={{ ...GLASS_CARD_STYLE, width: '100%' }}>
          <CardHeader style={{ padding: '14px 16px 10px 16px' }}>
            <div className="display-flex align-items-center" style={{ gap: '8px', marginLeft: '4px' }}>
              <Icon f7="calendar_badge_clock" size="18px" style={{ color: '#007aff', flexShrink: 0 }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1c1c1e', marginLeft: '12px' }}>
                Audiencias de hoy
              </span>
              {todayHearings.length > 0 && (
                <Badge color="blue" style={{ fontSize: '11px', padding: '0 6px' }}>
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
                      backgroundColor: 'rgba(0, 122, 255, 0.05)',
                      border: '1px solid rgba(0, 122, 255, 0.12)',
                      borderRadius: '10px',
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
                          backgroundColor: 'rgba(0, 122, 255, 0.05)',
                          border: '1px solid rgba(0, 122, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div className="display-flex align-items-center" style={{ gap: '4px' }}>
                          <Icon f7="clock_fill" size="14px" style={{ color: '#007aff' }} />
                          <span style={{ fontSize: '13px', color: '#007aff', fontWeight: 600 }}>{hearing.timeStr}</span>
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
