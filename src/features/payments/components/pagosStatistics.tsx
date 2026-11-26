import type { CSSProperties } from 'react';
import { formatCLP } from '../../../core/utils/format';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  totalVencidos: number;
  pendingCount: number;
  overdueCount: number;
  completedCount: number;
}

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: 'var(--macos-text-secondary, #8e8e93)',
};

export const PaymentsStats = ({
  totalIngresos,
  totalPendientes,
  totalVencidos,
  pendingCount,
  overdueCount,
  completedCount,
}: StatsProps) => (
  <aside
    aria-label="Resumen de pagos"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 22,
      userSelect: 'text',
      WebkitUserSelect: 'text',
    }}
  >
    {/* Pendientes en grande arriba */}
    <div>
      <div style={labelStyle}>
        Pendientes{pendingCount > 0 ? ` · ${pendingCount}` : ''}
      </div>
      <div
        style={{
          marginTop: 4,
          color: 'var(--macos-text, #ececef)',
          fontSize: 'clamp(32px, 3.4vw, 44px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          fontVariantNumeric: 'tabular-nums',
          overflowWrap: 'anywhere',
        }}
      >
        {formatCLP(totalPendientes)}
      </div>
    </div>

    {/* Vencidos y Pagados debajo, más pequeños */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={labelStyle}>
          Vencidos{overdueCount > 0 ? ` · ${overdueCount}` : ''}
        </div>
        <div
          style={{
            marginTop: 2,
            color: 'var(--macos-text, #ececef)',
            opacity: 0.86,
            fontSize: 21,
            fontWeight: 350,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatCLP(totalVencidos)}
        </div>
      </div>

      <div>
        <div style={labelStyle}>
          Pagados{completedCount > 0 ? ` · ${completedCount}` : ''}
        </div>
        <div
          style={{
            marginTop: 2,
            color: 'var(--macos-text, #ececef)',
            opacity: 0.72,
            fontSize: 21,
            fontWeight: 350,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatCLP(totalIngresos)}
        </div>
      </div>
    </div>
  </aside>
);
