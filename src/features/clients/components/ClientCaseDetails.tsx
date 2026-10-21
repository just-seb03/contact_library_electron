import type { FC, CSSProperties } from 'react';
import { Badge, Icon } from 'framework7-react';
import type { Client } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface ClientCaseDetailsProps {
  client: Client;
}

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client }) => {
  const { caso, pago } = client;

  const sectionStyle: CSSProperties = {
    backgroundColor: 'var(--app-color-white, #ffffff)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: '#1c1c1e',
    padding: '0 0 4px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 13,
    color: '#8e8e93',
    lineHeight: '1.4',
    marginBottom: 16,
  };

  const fieldCardStyle: CSSProperties = {
    backgroundColor: '#f9f9fb',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 10,
  };

  const fieldLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  };

  const fieldValueStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    color: '#1c1c1e',
  };

  const paymentCardStyle: CSSProperties = {
    backgroundColor: '#f9f9fb',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const paymentLeftStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const paymentLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const paymentAmountStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    color: '#1c1c1e',
  };

  const paymentDateStyle: CSSProperties = {
    fontSize: 12,
    color: '#8e8e93',
  };

  const hearingCardStyle: CSSProperties = {
    background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%)',
    borderRadius: 10,
    padding: '14px 16px',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const hearingIconContainerStyle: CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0,122,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const hearingLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--app-color-primary, #007aff)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  };

  const hearingDateStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: '#1c1c1e',
  };

  const estadoBadgeStyle: CSSProperties = {
    backgroundColor: '#e6f0ff',
    color: '#007aff',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    lineHeight: '1.3',
    maxWidth: 220,
    textAlign: 'center',
    fontWeight: 500,
  };

  const paymentStatusColor = (estado: string) => {
    switch (estado) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const paymentStatusLabel = (estado: string) => {
    switch (estado) {
      case 'completed': return 'Cobrado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      default: return estado;
    }
  };

  if (!caso) {
    return (
      <div style={sectionStyle}>
        <div className="text-align-center padding-vertical">
          <Icon f7="folder_badge_plus" size="38px" className="text-color-gray" />
          <h3>Sin expediente activo</h3>
          <p className="text-color-gray">
            Aún no se ha registrado un expediente judicial para {client.name}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      {/* Título Expediente + estado del caso */}
      <div style={titleStyle}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Expediente y Seguimiento Jurídico</div>
          <div style={subtitleStyle}>
            {caso.juzgado} · {caso.materia}
          </div>
        </div>
        {caso.estado && (
          <div style={estadoBadgeStyle}>
            {caso.estado}
          </div>
        )}
      </div>

      {/* Campo: N° de expediente */}
      <div style={fieldCardStyle}>
        <div style={fieldLabelStyle}>N° DE EXPEDIENTE</div>
        <div style={fieldValueStyle}>{caso.expediente}</div>
      </div>

      {/* Campo: Materia principal */}
      <div style={fieldCardStyle}>
        <div style={fieldLabelStyle}>MATERIA PRINCIPAL</div>
        <div style={fieldValueStyle}>{caso.materia}</div>
      </div>

      {/* Gestión de pagos */}
      {pago && (
        <div style={paymentCardStyle}>
          <div style={paymentLeftStyle}>
            <div style={paymentLabelStyle}>ESTADO EN GESTIÓN DE PAGOS</div>
            <div style={paymentAmountStyle}>
              {pago.concepto} · {formatCLP(pago.monto)}
            </div>
            <div style={paymentDateStyle}>
              Fecha de registro: {pago.fecha}
            </div>
          </div>
          <Badge color={paymentStatusColor(pago.estado)}>
            {paymentStatusLabel(pago.estado)}
          </Badge>
        </div>
      )}

      {/* Próxima audiencia programada */}
      {caso.proximaAudiencia && (
        <div style={hearingCardStyle}>
          <div style={hearingIconContainerStyle}>
            <Icon f7="calendar_badge_plus" size="20px" color="blue" />
          </div>
          <div>
            <div style={hearingLabelStyle}>PRÓXIMA AUDIENCIA PROGRAMADA</div>
            <div style={hearingDateStyle}>{caso.proximaAudiencia}</div>
          </div>
        </div>
      )}
    </div>
  );
};
