import { useState, type FC, type CSSProperties } from 'react';
import { Icon, f7 } from 'framework7-react';
import type { Client } from '../types';

interface ClientCaseDetailsProps {
  client: Client;
  onEdit: () => void;
  onDelete: () => void;
}

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client, onEdit, onDelete }) => {
  const { caso } = client;
  const [copied, setCopied] = useState(false);

  const sectionStyle: CSSProperties = {
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderRadius: 16,
    padding: '18px 20px',
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
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.25,
    color: 'var(--macos-text, #ececef)',
    margin: 0,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 12.5,
    color: 'var(--macos-text-secondary, #8e8e93)',
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
    minWidth: 'auto',
    maxWidth: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.06))',
    color: 'var(--macos-text, #ececef)',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.14))',
    borderRadius: 999,
    height: 30,
    padding: '0 14px',
    fontSize: 12,
    fontWeight: 550,
    cursor: 'pointer',
  };

  const deleteBtnStyle: CSSProperties = {
    width: 'auto',
    minWidth: 'auto',
    maxWidth: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    backgroundColor: 'transparent',
    color: 'var(--macos-text-secondary, #a4a4ab)',
    border: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.2))',
    borderRadius: 999,
    height: 30,
    padding: '0 12px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
  };

  const fieldCardStyle: CSSProperties = {
    backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.035))',
    border: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 10,
  };

  const fieldLabelStyle: CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--macos-text-secondary, #8e8e93)',
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
    fontSize: 14.5,
    fontWeight: 550,
    color: 'var(--macos-text, #ececef)',
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
    minWidth: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.06))',
    border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.14))',
    borderRadius: 999,
    padding: '3px 10px',
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
              style={{ color: 'var(--macos-text, #ececef)' }}
            />
            <span
              style={{
                fontSize: 11,
                color: 'var(--macos-text, #ececef)',
                fontWeight: 550,
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
