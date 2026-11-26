import type { CSSProperties } from 'react';
import { formatCLP } from '../../../core/utils/format';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  totalVencidos: number;
}

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: '0.02em',
  color: 'var(--macos-text-secondary, #8e8e93)',
};

export const PaymentsStats = ({
  totalIngresos,
  totalPendientes,
  totalVencidos,
}: StatsProps) => (
  <aside
    aria-label="Resumen de pagos"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      textAlign: 'right',
      gap: 24,
      userSelect: 'text',
      WebkitUserSelect: 'text',
    }}
  >
    {/* Pendientes en grande arriba */}
    <div>
      <div style={labelStyle}>Pendientes</div>
      <div
        style={{
          marginTop: 4,
          color: 'var(--macos-text, #ececef)',
          fontSize: 'clamp(28px, 3vw, 38px)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          fontVariantNumeric: 'tabular-nums',
          overflowWrap: 'anywhere',
        }}
      >
        {formatCLP(totalPendientes)}
      </div>
    </div>

    {/* Vencidos y Pagados debajo, más pequeños */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
      <div>
        <div style={labelStyle}>Vencidos</div>
        <div
          style={{
            marginTop: 2,
            color: 'var(--macos-text, #ececef)',
            opacity: 0.86,
            fontSize: 19,
            fontWeight: 400,
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatCLP(totalVencidos)}
        </div>
      </div>

      <div>
        <div style={labelStyle}>Pagados</div>
        <div
          style={{
            marginTop: 2,
            color: 'var(--macos-text, #ececef)',
            opacity: 0.72,
            fontSize: 19,
            fontWeight: 400,
            lineHeight: 1.2,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatCLP(totalIngresos)}
        </div>
      </div>
    </div>
  </aside>
);
