import type { CSSProperties, FC } from 'react';
import { Card, CardContent } from 'framework7-react';
import { useApp } from '../../context/AppContext';
import { formatCLP } from '../../utils/format';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  cobrosPendientesCount: number;
  totalTransacciones: number;
}

export const PaymentsStats: FC<StatsProps> = ({
  totalIngresos,
  totalPendientes,
  cobrosPendientesCount,
  totalTransacciones,
}) => {
  const { darkMode } = useApp();

  const cardStyle: CSSProperties = {
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
    <div className="row margin-bottom">
      {/* Columna 1 */}
      <div className="col-100 medium-33 margin-bottom-half">
        <Card outline={false} className="no-border margin-horizontal-none" style={cardStyle}>
          <CardContent style={{ padding: '16px' }}>
            <div className="text-color-gray text-uppercase font-weight-600" style={{ fontSize: '12px' }}>Ingresos Cobrados</div>
            <div className="text-color-green font-weight-bold margin-vertical-half" style={{ fontSize: '28px' }}>
              {formatCLP(totalIngresos)}
            </div>
            <div className="text-color-gray" style={{ fontSize: '11px' }}>Este mes</div>
          </CardContent>
        </Card>
      </div>

      {/* Columna 2 */}
      <div className="col-100 medium-33 margin-bottom-half">
        <Card outline={false} className="no-border margin-horizontal-none" style={cardStyle}>
          <CardContent style={{ padding: '16px' }}>
            <div className="text-color-gray text-uppercase font-weight-600" style={{ fontSize: '12px' }}>Por Cobrar</div>
            <div className="text-color-orange font-weight-bold margin-vertical-half" style={{ fontSize: '28px' }}>
              {formatCLP(totalPendientes)}
            </div>
            <div className="text-color-gray" style={{ fontSize: '11px' }}>{cobrosPendientesCount} cobros pendientes</div>
          </CardContent>
        </Card>
      </div>

      {/* Columna 3 */}
      <div className="col-100 medium-33 margin-bottom-half">
        <Card outline={false} className="no-border margin-horizontal-none" style={cardStyle}>
          <CardContent style={{ padding: '16px' }}>
            <div className="text-color-gray text-uppercase font-weight-600" style={{ fontSize: '12px' }}>Total Transacciones</div>
            <div className="font-weight-bold margin-vertical-half" style={{ fontSize: '28px', color: 'inherit' }}>
              {totalTransacciones}
            </div>
            <div className="text-color-gray" style={{ fontSize: '11px' }}>Registradas en agenda</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};