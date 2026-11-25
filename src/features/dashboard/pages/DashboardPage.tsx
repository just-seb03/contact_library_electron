import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';

export default function Dashboard() {
  const { hearings, calendarEvents, payments } = useApp();

  const pendingPaymentsCount = payments.filter(
    (p) => p.status === 'pending' || p.status === 'overdue'
  ).length;
  const totalEventsCount = hearings.length + calendarEvents.length;
  const hasPending = totalEventsCount > 0 || pendingPaymentsCount > 0;

  return (
    <Page noNavbar noToolbar>
      <div
        style={{
          minHeight: 'calc(100vh - 52px)',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0 48px',
          boxSizing: 'border-box',
        }}
      >
        {!hasPending ? (
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(34px, 4.5vw, 56px)',
              fontWeight: 400,
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
              color: 'var(--macos-text, #ececef)',
            }}
          >
            Hoy es un día
            <br />
            <span
              style={{
                fontFamily: 'Georgia, "Times New Roman", Palatino, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '1.14em',
                letterSpacing: '0.01em',
                opacity: 0.92,
              }}
            >
              tranquilo
            </span>
          </h1>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(28px, 3.6vw, 44px)',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'var(--macos-text, #ececef)',
              }}
            >
              Pendientes
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: 'var(--macos-text-secondary, #a4a4ab)',
                lineHeight: 1.6,
              }}
            >
              {totalEventsCount > 0 && `${totalEventsCount} ${totalEventsCount === 1 ? 'evento en agenda' : 'eventos en agenda'}`}
              {totalEventsCount > 0 && pendingPaymentsCount > 0 && ' · '}
              {pendingPaymentsCount > 0 && `${pendingPaymentsCount} ${pendingPaymentsCount === 1 ? 'pago pendiente' : 'pagos pendientes'}`}
            </p>
          </div>
        )}
      </div>
    </Page>
  );
}
