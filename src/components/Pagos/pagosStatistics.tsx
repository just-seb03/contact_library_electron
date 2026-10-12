import type { CSSProperties, FC } from 'react';
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
  const glassStyle: CSSProperties = {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '18px',
  };

  return (
    <div className="row margin-bottom">
      
      {/* Columna 1 */}
      <div className="col-100 medium-33 margin-bottom-half">
        <div className="card elevation-2 margin-horizontal-none" style={glassStyle}>
          <div className="card-content card-content-padding">
            <div className="text-color-gray text-uppercase font-weight-600" style={{ fontSize: '12px' }}>Ingresos Cobrados</div>
            <div className="text-color-green font-weight-bold margin-vertical-half" style={{ fontSize: '28px' }}>
              {formatCLP(totalIngresos)}
            </div>
            <div className="text-color-gray" style={{ fontSize: '11px' }}>Este mes</div>
          </div>
        </div>
      </div>

      {/* Columna 2 */}
      <div className="col-100 medium-33 margin-bottom-half">
        <div className="card elevation-2 margin-horizontal-none" style={glassStyle}>
          <div className="card-content card-content-padding">
            <div className="text-color-gray text-uppercase font-weight-600" style={{ fontSize: '12px' }}>Por Cobrar</div>
            <div className="text-color-orange font-weight-bold margin-vertical-half" style={{ fontSize: '28px' }}>
              {formatCLP(totalPendientes)}
            </div>
            <div className="text-color-gray" style={{ fontSize: '11px' }}>{cobrosPendientesCount} cobros pendientes</div>
          </div>
        </div>
      </div>

      {/* Columna 3 */}
      <div className="col-100 medium-33 margin-bottom-half">
        <div className="card elevation-2 margin-horizontal-none" style={glassStyle}>
          <div className="card-content card-content-padding">
            <div className="text-color-gray text-uppercase font-weight-600" style={{ fontSize: '12px' }}>Total Transacciones</div>
            <div className="font-weight-bold margin-vertical-half" style={{ fontSize: '28px', color: '#1d1d1f' }}>
              {totalTransacciones}
            </div>
            <div className="text-color-gray" style={{ fontSize: '11px' }}>Registradas en agenda</div>
          </div>
        </div>
      </div>

    </div>
  );
};