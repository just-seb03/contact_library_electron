import type { FC, CSSProperties } from 'react';
import type { Client } from '../types';

interface ClientCaseDetailsProps {
  client: Client;
}

const sectionStyle: CSSProperties = {
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.14)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  borderRadius: 16,
  padding: '16px 20px',
  userSelect: 'text',
  WebkitUserSelect: 'text',
};

const headingStyle: CSSProperties = {
  fontSize: 13.5,
  fontWeight: 600,
  color: 'var(--macos-text, #ececef)',
  margin: '0 0 10px 0',
};

const rowStyle = (isLast: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 0',
  borderBottom: isLast ? 'none' : '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
});

const labelStyle: CSSProperties = {
  fontSize: 12.5,
  color: 'var(--macos-text-secondary, #8e8e93)',
  flexShrink: 0,
};

const valueStyle: CSSProperties = {
  fontSize: 13.5,
  fontWeight: 500,
  color: 'var(--macos-text, #ececef)',
  textAlign: 'right',
  overflowWrap: 'anywhere',
  cursor: 'text',
};

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client }) => {
  const { caso } = client;

  if (!caso) {
    return (
      <section style={sectionStyle} aria-label="Expediente">
        <h2 style={headingStyle}>Expediente</h2>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--macos-text-secondary, #8e8e93)' }}>
          Sin expediente registrado
        </p>
      </section>
    );
  }

  return (
    <section style={sectionStyle} aria-label="Expediente">
      <h2 style={headingStyle}>Expediente</h2>

      <div style={rowStyle(false)}>
        <span style={labelStyle}>Número</span>
        <span style={valueStyle}>{caso.expediente}</span>
      </div>

      <div style={rowStyle(!caso.juzgado && !caso.estado)}>
        <span style={labelStyle}>Materia</span>
        <span style={valueStyle}>{caso.materia}</span>
      </div>

      {caso.juzgado && (
        <div style={rowStyle(!caso.estado)}>
          <span style={labelStyle}>Juzgado</span>
          <span style={valueStyle}>{caso.juzgado}</span>
        </div>
      )}

      {caso.estado && (
        <div style={rowStyle(true)}>
          <span style={labelStyle}>Estado</span>
          <span style={valueStyle}>{caso.estado}</span>
        </div>
      )}
    </section>
  );
};
