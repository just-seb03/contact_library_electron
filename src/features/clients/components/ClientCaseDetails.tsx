import { useState, type FC, type CSSProperties } from 'react';
import { Icon, f7 } from 'framework7-react';
import type { Client } from '../types';

interface ClientCaseDetailsProps {
  client: Client;
  onEdit: () => void;
}

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client, onEdit }) => {
  const { caso } = client;
  const [copied, setCopied] = useState(false);


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

  /** Tarjeta de audiencia: Colores neutros si está completado, azul activo si está en curso (Heurística #1) */
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
          <button
            type="button"
            style={{ ...editBtnStyle, marginTop: 12 }}
            onClick={onEdit}
          >
            <Icon f7="pencil" size="13px" style={{ marginRight: 5 }} />
            Editar cliente
          </button>
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
            title="Editar cliente"
            onClick={onEdit}
          >
            <Icon f7="pencil" size="13px" style={{ marginRight: 5 }} />
            Editar cliente
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

      {/* Bloque: Audiencia dinámica según estado completado o activo (Heurística #1) */}
    </div>
  );
};
