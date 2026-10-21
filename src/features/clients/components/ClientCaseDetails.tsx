import { useState, type FC, type CSSProperties } from 'react';
import { Badge, Icon, f7 } from 'framework7-react';
import type { Client } from '../types';
import { formatCLP } from '../../../core/utils/format';

interface ClientCaseDetailsProps {
  client: Client;
}

const paymentStatusColor = (estado: string): string => {
  switch (estado) {
    case 'completed': return 'green';
    case 'pending': return 'orange';
    case 'overdue': return 'red';
    default: return 'gray';
  }
};

const paymentStatusLabel = (estado: string): string => {
  switch (estado) {
    case 'completed': return 'Cobrado';
    case 'pending': return 'Pendiente';
    case 'overdue': return 'Vencido';
    default: return estado;
  }
};

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client }) => {
  const { caso, pago } = client;
  const [copied, setCopied] = useState(false);

  const isCompleted = client.status === 'completado';

  const sectionStyle: CSSProperties = {
    backgroundColor: 'var(--app-color-white, #ffffff)',
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
  };

  const headerRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  };

  const titleStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: '#1c1c1e',
    margin: 0,
  };

  /** Subtítulo simplificado: únicamente juzgado/tribunal (Heurística #8) */
  const subtitleStyle: CSSProperties = {
    fontSize: 13,
    color: '#8e8e93',
    lineHeight: '1.4',
    marginTop: 4,
  };

  const actionButtonsGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const editBtnStyle: CSSProperties = {
    width: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
    color: '#007aff',
    border: '1px solid #d1d1d6',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  };

  const deleteBtnStyle: CSSProperties = {
    width: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#fff1f0',
    color: '#ff3b30',
    border: '1px solid #ffccc7',
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
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

  const expedienteRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  };

  const fieldValueStyle: CSSProperties = {
    fontSize: 15,
    fontWeight: 600,
    color: '#1c1c1e',
    whiteSpace: 'nowrap',
  };

  const copyBtnStyle: CSSProperties = {
    width: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    background: '#ffffff',
    border: '1px solid #d1d1d6',
    borderRadius: 5,
    padding: '2px 6px',
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
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

  /** Tarjeta de audiencia: Colores neutros si está completado, azul activo si está en curso (Heurística #1) */
  const hearingCardStyle: CSSProperties = isCompleted
    ? {
        backgroundColor: '#f2f2f7',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: '1px solid #e5e5ea',
      }
    : {
        background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f7ff 100%)',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      };

  const hearingIconContainerStyle: CSSProperties = isCompleted
    ? {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(142, 142, 147, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'rgba(0,122,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

  const hearingLabelStyle: CSSProperties = isCompleted
    ? {
        fontSize: 11,
        fontWeight: 700,
        color: '#8e8e93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
      }
    : {
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

  const handleCopyExpediente = () => {
    if (caso?.expediente) {
      navigator.clipboard.writeText(caso.expediente);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!caso) {
    return (
      <div style={sectionStyle}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Icon f7="folder_badge_plus" size="38px" className="text-color-gray" />
          <h3 style={{ margin: '8px 0 4px 0' }}>Sin expediente activo</h3>
          <p className="text-color-gray" style={{ margin: 0 }}>
            Aún no se ha registrado un expediente judicial para {client.name}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      {/* Cabecera: Título con juzgado y botones de acción Editar/Archivar (Heurística #3, #4, #8) */}
      <div style={headerRowStyle}>
        <div>
          <h2 style={titleStyle}>Expediente y Seguimiento Jurídico</h2>
          <div style={subtitleStyle}>{caso.juzgado}</div>
        </div>
        <div style={actionButtonsGroupStyle}>
          <button
            type="button"
            style={editBtnStyle}
            title="Editar expediente"
            onClick={() => {
              if (f7?.dialog) {
                f7.dialog.alert(`Editar datos del expediente: ${caso.expediente}`, 'Editar Expediente');
              }
            }}
          >
            <Icon f7="pencil" size="13px" style={{ marginRight: 5 }} />
            Editar
          </button>
          <button
            type="button"
            style={deleteBtnStyle}
            title="Archivar o eliminar expediente"
            onClick={() => {
              if (f7?.dialog) {
                f7.dialog.confirm(
                  `¿Estás seguro de archivar o eliminar el expediente ${caso.expediente}?`,
                  'Confirmar acción'
                );
              }
            }}
          >
            <Icon f7="trash" size="13px" style={{ marginRight: 5 }} />
            Archivar/Eliminar
          </button>
        </div>
      </div>

      {/* Bloque: N° de Expediente con botón de copiar al portapapeles (Heurística #1) */}
      <div style={fieldCardStyle}>
        <div style={fieldLabelStyle}>N° DE EXPEDIENTE</div>
        <div style={expedienteRowStyle}>
          <span style={fieldValueStyle}>{caso.expediente}</span>
          <button
            type="button"
            style={copyBtnStyle}
            onClick={handleCopyExpediente}
            title="Copiar expediente"
            aria-label="Copiar expediente"
          >
            <Icon
              f7={copied ? 'checkmark_alt' : 'doc_on_doc'}
              size="11px"
              style={{ color: copied ? '#34c759' : '#007aff' }}
            />
            <span
              style={{
                fontSize: 11,
                color: copied ? '#34c759' : '#007aff',
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </span>
          </button>
        </div>
      </div>

      {/* Bloque: Materia principal */}
      <div style={fieldCardStyle}>
        <div style={fieldLabelStyle}>MATERIA PRINCIPAL</div>
        <div style={fieldValueStyle}>{caso.materia}</div>
      </div>

      {/* Bloque: Gestión de pagos */}
      {pago && (
        <div style={paymentCardStyle}>
          <div style={paymentLeftStyle}>
            <div style={paymentLabelStyle}>ESTADO EN GESTIÓN DE PAGOS</div>
            <div style={paymentAmountStyle}>
              {pago.concepto} · {formatCLP(pago.monto)}
            </div>
            <div style={paymentDateStyle}>Fecha de registro: {pago.fecha}</div>
          </div>
          <Badge color={paymentStatusColor(pago.estado)}>
            {paymentStatusLabel(pago.estado)}
          </Badge>
        </div>
      )}

      {/* Bloque: Audiencia dinámica según estado completado o activo (Heurística #1) */}
      {caso.proximaAudiencia && (
        <div style={hearingCardStyle}>
          <div style={hearingIconContainerStyle}>
            <Icon
              f7="calendar"
              size="20px"
              style={{ color: isCompleted ? '#8e8e93' : '#007aff' }}
            />
          </div>
          <div>
            <div style={hearingLabelStyle}>
              {isCompleted ? 'ÚLTIMA AUDIENCIA REALIZADA' : 'PRÓXIMA AUDIENCIA PROGRAMADA'}
            </div>
            <div style={hearingDateStyle}>{caso.proximaAudiencia}</div>
          </div>
        </div>
      )}
    </div>
  );
};
