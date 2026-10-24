import { useRef, useState, type CSSProperties, type FC } from 'react';
import { Icon } from 'framework7-react';
import type { ClientDocument } from '../types';

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

  const itemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 10,
    backgroundColor: '#f9f9fb',
  };

  return (
    <section
      style={{
        backgroundColor: 'var(--app-color-white, #ffffff)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
      }}
      aria-labelledby="client-documents-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <h2 id="client-documents-heading" style={{ margin: 0, color: '#1c1c1e', fontSize: 18, fontWeight: 600 }}>
          Documentos del cliente
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginLeft: 'auto',
            width: 130,
            height: 36,
            padding: '6px 6px',
            border: '1px solid #d1d1d6',
            borderRadius: 8,
            backgroundColor: '#f2f2f7',
            color: '#007aff',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Icon f7="plus" size="13px" />
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
            <div key={document.id} style={itemStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Icon f7="doc_text_fill" size="20px" style={{ color: '#ff3b30', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <a
                    href={document.dataUrl}
                    download={document.name}
                    style={{ color: '#1c1c1e', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={`Descargar ${document.name}`}
                  >
                    {document.name}
                  </a>
                  <span style={{ color: '#8e8e93', fontSize: 12 }}>{formatFileSize(document.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(document)}
                aria-label={`Eliminar ${document.name}`}
                title="Eliminar documento"
                style={{ border: 'none', background: 'transparent', color: '#c62820', cursor: 'pointer', padding: 6 }}
              >
                <Icon f7="trash" size="16px" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, color: '#8e8e93', fontSize: 13 }}>Este cliente aún no tiene documentos asociados.</p>
      )}
      {error && <p role="alert" style={{ margin: '12px 0 0', color: '#c62820', fontSize: 13 }}>{error}</p>}
    </section>
  );
};
