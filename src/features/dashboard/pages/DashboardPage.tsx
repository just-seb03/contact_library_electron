import type { CSSProperties } from 'react';
import { Page } from 'framework7-react';
import { useApp } from '../../../core/context/AppContext';
import brotherSignatureFont from '../../../../assets/fonts/Brother Signature.otf';

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
      <style>{`
        @font-face {
          font-family: 'Brother Signature';
          src: url('${brotherSignatureFont}') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div
        style={{
          minHeight: 'calc(100vh - 52px)',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)',
          alignItems: 'center',
          gap: 32,
          padding: '24px 48px 56px 48px',
          boxSizing: 'border-box',
        }}
      >
        {/* ── Mitad izquierda: Courier arriba + Brother Signature abajo ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--apple-font, 'Courier New', Courier, monospace)",
              fontSize: 'clamp(42px, 4.8vw, 66px)',
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '0.06em',
              color: 'var(--macos-text, #ececef)',
            }}
          >
            {!hasPending ? (
              <>
                <span style={{ whiteSpace: 'nowrap' }}>Hoy es un día</span>
                <br />
                <span
                  style={{
                    fontFamily: "'Brother Signature', Georgia, serif",
                    fontWeight: 400,
                    fontSize: '1.68em',
                    lineHeight: 0.95,
                    letterSpacing: '0.03em',
                    display: 'inline-block',
                    marginTop: 8,
                  }}
                >
                  tranquilo
                </span>
              </>
            ) : (
              <>
                <span style={{ whiteSpace: 'nowrap' }}>Agenda del</span>
                <br />
                <span
                  style={{
                    fontFamily: "'Brother Signature', Georgia, serif",
                    fontWeight: 400,
                    fontSize: '1.68em',
                    lineHeight: 0.95,
                    letterSpacing: '0.03em',
                    display: 'inline-block',
                    marginTop: 8,
                  }}
                >
                  día
                </span>
              </>
            )}
          </h1>
        </div>

        {/* ── Mitad derecha: Cuadros principales centrados + fantasmas hacia abajo ── */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            maxWidth: 480,
            justifySelf: 'end',
          }}
        >
          {/* Cuadro grueso principal: estado de reuniones */}
          <div
            style={{
              ...glassCardBase,
              padding: '22px 24px',
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
              padding: '22px 24px',
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
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              pointerEvents: 'none',
            }}
          >
            {GHOST_OPACITIES.map((opacity, index) => (
              <div
                key={index}
                style={{
                  ...glassCardBase,
                  height: 40,
                  borderRadius: 14,
                  opacity,
                  filter: `blur(${0.6 + index * 0.45}px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
