import type { CSSProperties } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';

const glassCardBase: CSSProperties = {
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.045)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  border: '1px solid rgba(255, 255, 255, 0.09)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
  boxSizing: 'border-box',
};

const GHOST_OPACITIES = [0.45, 0.28, 0.15, 0.07, 0.02];

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
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(300px, 0.85fr)',
          alignItems: 'center',
          gap: 40,
          padding: '24px 48px 64px 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Mitad izquierda: Tipografía principal ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--apple-font, 'Courier New', Courier, monospace)",
              fontSize: 'clamp(42px, 5.2vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.22,
              letterSpacing: '0.06em',
              color: 'var(--macos-text, #ececef)',
            }}
          >
            {!hasPending ? (
              <>
                Hoy es un día
                <br />
                <span
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", Palatino, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '1.16em',
                    letterSpacing: '0.05em',
                    opacity: 0.94,
                  }}
                >
                  tranquilo
                </span>
              </>
            ) : (
              <>
                Agenda del
                <br />
                <span
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", Palatino, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '1.16em',
                    letterSpacing: '0.05em',
                    opacity: 0.94,
                  }}
                >
                  día
                </span>
              </>
            )}
          </h1>
        </div>

        {/* ── Mitad derecha: Pila de cuadros glass tipo Apple ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            maxWidth: 420,
            justifySelf: 'end',
          }}
        >
          {/* Cuadro grueso principal: estado de reuniones */}
          <div
            style={{
              ...glassCardBase,
              padding: '22px 22px',
              minHeight: 84,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.03em',
                color: 'var(--macos-text, #ececef)',
              }}
            >
              {totalEventsCount === 0
                ? 'Sin reuniones pendientes'
                : `${totalEventsCount} ${totalEventsCount === 1 ? 'reunión pendiente' : 'reuniones pendientes'}`}
            </div>
            <div
              style={{
                fontSize: 12.5,
                letterSpacing: '0.02em',
                color: 'var(--macos-text-secondary, #a4a4ab)',
              }}
            >
              {totalEventsCount === 0
                ? 'No hay audiencias ni citas programadas'
                : 'Revisa tu agenda para ver los horarios'}
            </div>
          </div>

          {/* Segundo cuadro grueso: estado de pagos */}
          <div
            style={{
              ...glassCardBase,
              padding: '22px 22px',
              minHeight: 84,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.03em',
                color: 'var(--macos-text, #ececef)',
              }}
            >
              {pendingPaymentsCount === 0
                ? 'Sin pagos pendientes'
                : `${pendingPaymentsCount} ${pendingPaymentsCount === 1 ? 'pago pendiente' : 'pagos pendientes'}`}
            </div>
            <div
              style={{
                fontSize: 12.5,
                letterSpacing: '0.02em',
                color: 'var(--macos-text-secondary, #a4a4ab)',
              }}
            >
              {pendingPaymentsCount === 0
                ? 'Todo al día en honorarios y cobros'
                : 'Hay cobros por gestionar en Pagos'}
            </div>
          </div>

          {/* Cuadros inferiores a la mitad de grosor, difuminados y desvaneciéndose */}
          {GHOST_OPACITIES.map((opacity, index) => (
            <div
              key={index}
              aria-hidden="true"
              style={{
                ...glassCardBase,
                height: 40,
                borderRadius: 14,
                opacity,
                filter: `blur(${0.6 + index * 0.45}px)`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </div>
      </div>
    </Page>
  );
}
