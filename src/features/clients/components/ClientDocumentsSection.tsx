import { useRef, useState, type FC, type CSSProperties } from 'react';
import { Icon } from 'framework7-react';
import type { ClientDocument } from '../types';
import { databaseService } from '../../../core/database/databaseService';

const glassSectionStyle: CSSProperties = {
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.045))',
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.09))',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
  backdropFilter: 'blur(24px) saturate(160%)',
  WebkitBackdropFilter: 'blur(24px) saturate(160%)',
  borderRadius: 16,
  padding: '18px 20px',
};

const glassItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 14px',
  borderRadius: 12,
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.035))',
  border: '1px solid var(--macos-divider, rgba(128, 128, 136, 0.14))',
};

const uploadBtnStyle: CSSProperties = {
  width: 'auto',
  minWidth: 'auto',
  maxWidth: 'fit-content',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  height: 28,
  padding: '0 12px',
  borderRadius: 999,
  border: '1px solid var(--macos-card-border, rgba(255, 255, 255, 0.14))',
  backgroundColor: 'var(--macos-subtle-bg, rgba(255, 255, 255, 0.06))',
  color: 'var(--macos-text, #ececef)',
  fontSize: 12,
  fontWeight: 550,
  cursor: 'pointer',
};

interface ClientDocumentsSectionProps {
  documents: ClientDocument[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (document: ClientDocument) => void;
}

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

function formatFileSize(size: number): string {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export const ClientDocumentsSection: FC<ClientDocumentsSectionProps> = ({
  documents,
  onUpload,
  onDelete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleOpenDocument = (e: React.MouseEvent, doc: ClientDocument) => {
    if (databaseService.isElectronDbAvailable() && doc.id) {
      e.preventDefault();
      databaseService.openDocument(doc.id).then((opened) => {
        if (!opened && doc.dataUrl) {
          window.open(doc.dataUrl, '_blank');
        }
      });
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Solo se permiten archivos PDF.');
      return;
    }
    if (file.size > MAX_DOCUMENT_SIZE) {
      setError('El archivo no puede superar los 10 MB.');
      return;
    }
    try {
      setError('');
      await onUpload(file);
    } catch (uploadError) {
      console.error('No se pudo guardar el documento.', uploadError);
      setError('No se pudo guardar el documento.');
    }
  };

  return (
    <section
      style={glassSectionStyle}
      aria-labelledby="client-documents-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <h2 id="client-documents-heading" style={{ fontSize: 15, fontWeight: 600, color: 'var(--macos-text, #ececef)', margin: 0 }}>
          Documentos del cliente
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={uploadBtnStyle}
        >
          <Icon f7="plus" size="12px" />
          Subir PDF
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      {documents.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {documents.map((document) => (
            <div key={document.id} style={glassItemStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Icon f7="doc_text_fill" size="18px" style={{ color: 'var(--macos-text-secondary, #a4a4ab)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <a
                    href={document.dataUrl || '#'}
                    download={document.name}
                    onClick={(e) => handleOpenDocument(e, document)}
                    style={{ color: 'var(--macos-text, #ececef)', fontSize: 14, fontWeight: 550, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                    title={`Abrir o descargar ${document.name}`}
                  >
                    {document.name}
                  </a>
                  <span style={{ color: 'var(--macos-text-secondary, #8e8e93)', fontSize: 12 }}>{formatFileSize(document.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(document)}
                aria-label={`Eliminar ${document.name}`}
                title="Eliminar documento"
                style={{ width: 'auto', border: 'none', background: 'transparent', color: 'var(--macos-text-secondary, #8e8e93)', cursor: 'pointer', padding: 6 }}
              >
                <Icon f7="trash" size="15px" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--macos-text-secondary, #8e8e93)' }}>Este cliente aún no tiene documentos asociados.</p>
      )}
      {error && <p role="alert" style={{ margin: '12px 0 0', color: '#ff6961', fontSize: 13 }}>{error}</p>}
    </section>
  );
};
