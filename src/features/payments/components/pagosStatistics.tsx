import { Icon } from 'framework7-react';
import { formatCLP } from '../../../core/utils/format';
import { PAYMENT_SURFACE_STYLE } from '../styles';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  totalVencidos: number;
}

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
      gap: '12px',
    }}
  >
    {[
      {
        label: 'Ingresos cobrados',
        value: formatCLP(totalIngresos),
        icon: 'arrow_down_left',
      },
      {
        label: 'Por cobrar',
        value: formatCLP(totalPendientes),
        icon: 'clock',
      },
      {
        label: 'Vencidos',
        value: formatCLP(totalVencidos),
        icon: 'exclamationmark_circle',
      },
    ].map(({ label, value, icon }) => (
      <article
        key={label}
        style={{
          ...PAYMENT_SURFACE_STYLE,
          minWidth: 0,
          padding: '16px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--macos-text-secondary, #a4a4ab)' }}>
          <Icon f7={icon} size="15px" />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.02em' }}>{label}</span>
        </div>
        <div style={{ marginTop: 10, color: 'var(--macos-text, #ececef)', fontSize: 'clamp(18px, 2.2vw, 24px)', fontWeight: 700, lineHeight: 1.15, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </article>
    ))}
  </section>
);
