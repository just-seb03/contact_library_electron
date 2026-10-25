import { useState, type FC, type CSSProperties } from 'react';
import { Icon, f7 } from 'framework7-react';
import type { Client } from '../types';
import { APP_COLORS, SECTION_STYLE } from '../../../core/theme/style';

interface ClientCaseDetailsProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client, onEdit, onDelete }) => {
  const { caso } = client;
  const [copied, setCopied] = useState(false);


  const sectionStyle: CSSProperties = {
    ...SECTION_STYLE,
  };

  const headerRowStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  };

  const titleBlockStyle: CSSProperties = {
    flex: '1 1 220px',
    minWidth: 0,
  };

  const titleStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 1.25,
    color: 'var(--macos-text, #1c1c1e)',
    margin: 0,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 13,
    color: APP_COLORS.secondaryText,
    lineHeight: '1.4',
    marginTop: 4,
  };

  const actionButtonsGroupStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: '0 0 auto',
    gap: 8,
  };

  const editBtnStyle: CSSProperties = {
    width: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    backgroundColor: 'var(--macos-input-bg, #f2f2f7)',
    color: APP_COLORS.primary,
    border: '1px solid var(--macos-card-border, #d1d1d6)',
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
    whiteSpace: 'nowrap',
    backgroundColor: APP_COLORS.dangerSurface,
    color: APP_COLORS.danger,
    border: `1px solid ${APP_COLORS.borderDanger}`,
    borderRadius: 8,
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
  };

  const fieldCardStyle: CSSProperties = {
    backgroundColor: 'var(--macos-input-bg, #f2f2f7)',
    borderRadius: 10,
    padding: '12px 16px',
    marginBottom: 10,
  };

  const fieldLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: APP_COLORS.secondaryText,
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
    color: 'var(--macos-text, #1c1c1e)',
    overflowWrap: 'anywhere',
  };

  const expedienteValueStyle: CSSProperties = {
    ...fieldValueStyle,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const copyBtnStyle: CSSProperties = {
    width: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    background: 'var(--macos-card-bg, #ffffff)',
    border: '1px solid var(--macos-card-border, #d1d1d6)',
    borderRadius: 5,
    padding: '2px 6px',
    cursor: 'pointer',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  };
  /** Tarjeta de audiencia: Colores neutros si está completado, azul activo si está en curso*/
  const handleCopyExpediente = () => {
    if (caso?.expediente) {
      navigator.clipboard.writeText(caso.expediente);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteClient = () => {
    f7.dialog.confirm(
      `Se eliminará a ${client.name}, sus pagos y se desvinculará de sus eventos. Los eventos se conservarán. Esta acción no se puede deshacer.`,
      'Eliminar cliente',
      onDelete
    );
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
          <button
            type="button"
            style={{ ...deleteBtnStyle, marginTop: 12, marginLeft: 8 }}
            onClick={handleDeleteClient}
          >
            <Icon f7="trash" size="13px" style={{ marginRight: 5 }} />
            Eliminar cliente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      <div style={headerRowStyle}>
        <div style={titleBlockStyle}>
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
            title="Eliminar cliente"
            onClick={handleDeleteClient}
          >
            <Icon f7="trash" size="13px" style={{ marginRight: 5 }} />
            Eliminar cliente
          </button>
        </div>
      </div>

      <div style={fieldCardStyle}>
        <div style={fieldLabelStyle}>N° DE EXPEDIENTE</div>
        <div style={expedienteRowStyle}>
          <span style={expedienteValueStyle} title={caso.expediente}>{caso.expediente}</span>
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
              style={{ color: copied ? APP_COLORS.success : APP_COLORS.primary }}
            />
            <span
              style={{
                fontSize: 11,
                color: copied ? APP_COLORS.success : APP_COLORS.primary,
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </span>
          </button>
        </div>
      </div>

      <div style={fieldCardStyle}>
        <div style={fieldLabelStyle}>MATERIA PRINCIPAL</div>
        <div style={fieldValueStyle}>{caso.materia}</div>
      </div>

    </div>
  );
};
