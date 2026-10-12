import type { CSSProperties } from 'react';
import { formatCLP } from '../../utils/format';

interface DashboardStatsProps {
  clientsCount: number;
  todayHearingsCount: number;
  amountToReview: number;
}

export function DashboardStats({ clientsCount, todayHearingsCount, amountToReview }: DashboardStatsProps) {
  const glassStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '18px',
  };

  return (
    <section
      aria-label="Indicadores"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '10px',
        marginBottom: '12px',
        flexShrink: 0,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div className="card elevation-2 margin-horizontal-none" style={glassStyle}>
          <div className="card-content card-content-padding">
            <div
              className="text-color-gray text-uppercase font-weight-600"
              style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', overflowWrap: 'anywhere' }}
            >
              Clientes
            </div>
            <div
              className="font-weight-bold margin-vertical-half"
              style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', color: '#1d1d1f' }}
            >
              {clientsCount}
            </div>
          </div>
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div className="card elevation-2 margin-horizontal-none" style={glassStyle}>
          <div className="card-content card-content-padding">
            <div
              className="text-color-gray text-uppercase font-weight-600"
              style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', overflowWrap: 'anywhere' }}
            >
              Audiencias hoy
            </div>
            <div
              className="font-weight-bold margin-vertical-half"
              style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', color: '#1d1d1f' }}
            >
              {todayHearingsCount}
            </div>
          </div>
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div className="card elevation-2 margin-horizontal-none" style={glassStyle}>
          <div className="card-content card-content-padding">
            <div
              className="text-color-gray text-uppercase font-weight-600"
              style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', overflowWrap: 'anywhere' }}
            >
              Por cobrar
            </div>
            <div
              className="text-color-orange font-weight-bold margin-vertical-half"
              style={{ fontSize: 'clamp(16px, 2vw, 28px)', overflowWrap: 'anywhere' }}
            >
              {formatCLP(amountToReview)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}