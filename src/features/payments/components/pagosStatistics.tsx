import type { CSSProperties } from 'react';
import { formatCLP } from '../../../core/utils/format';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  totalVencidos: number;
}

const statCardStyle: CSSProperties = {
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  borderRadius: 16,
  minWidth: 0,
  padding: '16px 20px',
  userSelect: 'text',
  WebkitUserSelect: 'text',
};

export const PaymentsStats = ({
  totalIngresos,
  totalPendientes,
  totalVencidos,
}: StatsProps) => (
  <section
    aria-label="Resumen de pagos"
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: 12,
    }}
  >
    {[
      { label: 'Cobrado', value: formatCLP(totalIngresos) },
      { label: 'Pendiente', value: formatCLP(totalPendientes) },
      { label: 'Vencido', value: formatCLP(totalVencidos) },
    ].map(({ label, value }) => (
      <article key={label} style={statCardStyle}>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--macos-text-secondary, #8e8e93)' }}>
          {label}
        </div>
        <div
          style={{
            marginTop: 6,
            color: 'var(--macos-text, #ececef)',
            fontSize: 'clamp(18px, 2.2vw, 23px)',
            fontWeight: 550,
            lineHeight: 1.2,
            overflowWrap: 'anywhere',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
      </article>
    ))}
  </section>
);
