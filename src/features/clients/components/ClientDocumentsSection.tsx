import { useRef, useState, type FC } from 'react';
import { Icon } from 'framework7-react';
import type { ClientDocument } from '../types';
import {
  ACTION_BUTTON_STYLE,
  APP_COLORS,
  EMPTY_TEXT_STYLE,
  MUTED_ITEM_STYLE,
  SECTION_HEADING_STYLE,
  SECTION_STYLE,
} from '../../../core/theme/style';

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

  return (
    <section
      style={SECTION_STYLE}
      aria-labelledby="client-documents-heading"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <h2 id="client-documents-heading" style={{ ...SECTION_HEADING_STYLE, margin: 0 }}>
          Documentos del cliente
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={ACTION_BUTTON_STYLE}
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
            <div key={document.id} style={MUTED_ITEM_STYLE}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <Icon f7="doc_text_fill" size="20px" style={{ color: APP_COLORS.danger, flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <a
                    href={document.dataUrl}
                    download={document.name}
                    style={{ color: 'var(--macos-text, #1c1c1e)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={`Descargar ${document.name}`}
                  >
                    {document.name}
                  </a>
                  <span style={{ color: APP_COLORS.secondaryText, fontSize: 12 }}>{formatFileSize(document.size)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDelete(document)}
                aria-label={`Eliminar ${document.name}`}
                title="Eliminar documento"
                style={{ border: 'none', background: 'transparent', color: APP_COLORS.danger, cursor: 'pointer', padding: 6 }}
              >
                <Icon f7="trash" size="16px" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={EMPTY_TEXT_STYLE}>Este cliente aún no tiene documentos asociados.</p>
      )}
      {error && <p role="alert" style={{ margin: '12px 0 0', color: APP_COLORS.danger, fontSize: 13 }}>{error}</p>}
    </section>
  );
};
