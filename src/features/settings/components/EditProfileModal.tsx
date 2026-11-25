import { useState, useEffect, type FC, type CSSProperties, type FormEvent } from 'react';
import { Icon } from 'framework7-react';

export interface ProfileFormData {
  name: string;
  firm: string;
  email: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileFormData;
  onSave: (data: ProfileFormData) => void;
  darkMode: boolean;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: 16,
  };

  const modalStyle: CSSProperties = {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'var(--macos-modal-bg, #ffffff)',
    borderRadius: 14,
    border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.12))',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeInScale 0.15s ease-out',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderBottom: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.08))',
  };

  const inputGroupStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 14,
  };

  const labelStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--macos-text-muted, #3c3c43)',
  };

  const inputStyle: CSSProperties = {
    height: 34,
    padding: '0 10px',
    borderRadius: 7,
    border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.15))',
    backgroundColor: 'var(--macos-input-bg, #f5f5f7)',
    color: 'var(--macos-text, #1c1c1e)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  };

  const footerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    padding: '12px 18px',
    borderTop: '1px solid var(--macos-divider, rgba(0, 0, 0, 0.08))',
    backgroundColor: 'var(--macos-subtle-bg, #fbfbfd)',
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: 'var(--macos-accent-color, #0056b8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--macos-on-accent, #ffffff)',
              }}
            >
              <Icon f7="person_crop_circle" size="14px" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 650, color: 'var(--macos-text, #1c1c1e)' }}>
              Editar Perfil del Despacho
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--macos-text-secondary, #8e8e93)',
              padding: 4,
            }}
          >
            <Icon f7="xmark_circle_fill" size="18px" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '18px 18px 6px 18px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Nombre del Titular o Abogado</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle}
              placeholder="Ej. Sebastián Contreras"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Firma o Estudio Jurídico</label>
            <input
              type="text"
              required
              value={formData.firm}
              onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
              style={inputStyle}
              placeholder="Ej. Contreras & Asociados • Litigios"
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Correo Electrónico de Contacto</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
              placeholder="abogado@despacho.cl"
            />
          </div>

          <div style={footerStyle}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 30,
                padding: '0 14px',
                borderRadius: 6,
                border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.12))',
                backgroundColor: 'var(--macos-input-bg, #ffffff)',
                color: 'var(--macos-text, #3c3c43)',
                fontSize: 12.5,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              style={{
                height: 30,
                padding: '0 16px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'var(--macos-accent-color, #0056b8)',
                color: 'var(--macos-on-accent, #ffffff)',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.35))',
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
