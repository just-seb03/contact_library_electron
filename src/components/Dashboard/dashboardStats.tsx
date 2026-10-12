import type { CSSProperties } from 'react';
import { Card, CardContent } from 'framework7-react';
import { useApp } from '../../context/AppContext';
import { formatCLP } from '../../utils/format';

interface DashboardStatsProps {
  clientsCount: number;
  todayHearingsCount: number;
  amountToReview: number;
}

export function DashboardStats({ clientsCount, todayHearingsCount, amountToReview }: DashboardStatsProps) {
  const { darkMode } = useApp();

  const glassStyle: CSSProperties = {
    background: darkMode ? 'rgba(22, 24, 30, 0.65)' : 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: darkMode ? 'none' : '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '18px',
    boxShadow: darkMode
      ? '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08)'
      : '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    color: darkMode ? '#f5f5f7' : 'inherit',
    margin: 0,
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
        <Card outline={false} className="no-border margin-horizontal-none" style={glassStyle}>
          <CardContent style={{ padding: '16px' }}>
            <div
              className="text-color-gray text-uppercase font-weight-600"
              style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', overflowWrap: 'anywhere' }}
            >
              Clientes
            </div>
            <div
              className="font-weight-bold margin-vertical-half"
              style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', color: 'inherit' }}
            >
              {clientsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ minWidth: 0 }}>
        <Card outline={false} className="no-border margin-horizontal-none" style={glassStyle}>
          <CardContent style={{ padding: '16px' }}>
            <div
              className="text-color-gray text-uppercase font-weight-600"
              style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', overflowWrap: 'anywhere' }}
            >
              Audiencias hoy
            </div>
            <div
              className="font-weight-bold margin-vertical-half"
              style={{ fontSize: 'clamp(18px, 2.4vw, 28px)', color: 'inherit' }}
            >
              {todayHearingsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ minWidth: 0 }}>
        <Card outline={false} className="no-border margin-horizontal-none" style={glassStyle}>
          <CardContent style={{ padding: '16px' }}>
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
          </CardContent>
        </Card>
      </div>
    </section>
  );
}