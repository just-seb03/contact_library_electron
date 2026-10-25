import { Icon } from 'framework7-react';
import { formatCLP } from '../../../core/utils/format';
import { APP_COLORS } from '../../../core/theme/style';
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
        color: '#34c759',
      },
      {
        label: 'Por cobrar',
        value: formatCLP(totalPendientes),
        icon: 'clock_fill',
        color: '#ff9500',
      },
      {
        label: 'Vencidos',
        value: formatCLP(totalVencidos),
        icon: 'exclamationmark_circle_fill',
        color: '#ff3b30',
      },
    ].map(({ label, value, icon, color }) => (
      <article
        key={label}
        style={{
          ...PAYMENT_SURFACE_STYLE,
          minWidth: 0,
          padding: '15px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, color }}>
          <Icon f7={icon} size="17px" />
          <span style={{ color: APP_COLORS.secondaryText, fontSize: 12, fontWeight: 600 }}>{label}</span>
        </div>
        <div style={{ marginTop: 9, color: APP_COLORS.sidebarText, fontSize: 'clamp(18px, 2.2vw, 25px)', fontWeight: 700, lineHeight: 1.15, overflowWrap: 'anywhere', fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </div>
      </article>
    ))}
  </section>
);
