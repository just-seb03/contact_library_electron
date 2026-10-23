import { Card, CardContent, Icon } from 'framework7-react';
import { formatCLP } from '../../../core/utils/format';
import { GLASS_CARD_STYLE } from '../../../core/theme/style';

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
      gap: '16px',
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
      <Card
        key={label}
        outline
        className="no-margin"
        style={{
          ...GLASS_CARD_STYLE,
          aspectRatio: '2 / 1',
          minWidth: 0,
        }}
      >
        <CardContent
          style={{
            height: '100%',
            padding: 'clamp(16px, 3vw, 28px)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Icon f7={icon} size="24px" style={{ color }} />
          <div>
            <div
              style={{
                color: '#8e8e93',
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              {label}
            </div>
            <div
              style={{
                color: '#1c1c1e',
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                fontWeight: 700,
                lineHeight: 1.15,
                overflowWrap: 'anywhere',
              }}
            >
              {value}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </section>
);
