import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';

interface SettingsProfileCardProps {
  name: string;
  firm: string;
  email: string;
  darkMode: boolean;
  onEdit?: () => void;
}

export const SettingsProfileCard: FC<SettingsProfileCardProps> = ({
  name,
  firm,
  email,
  onEdit,
}) => {
  const cardStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderRadius: 16,
    backgroundColor: 'var(--macos-subtle-bg, rgba(128, 128, 136, 0.06))',
    border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.18))',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    marginBottom: 24,
    userSelect: 'none',
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  };

  return (
    <div style={{ ...cardStyle, flexWrap: 'nowrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1, marginRight: 16 }}>
        {/* Avatar monocromo adaptado a la paleta */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: 'var(--macos-active-bg, rgba(128, 128, 136, 0.2))',
            border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.25))',
            color: 'var(--macos-text, #ececef)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {getInitials(name) || 'CL'}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 15.5,
                fontWeight: 650,
                color: 'var(--macos-text, #ececef)',
                letterSpacing: '-0.01em',
              }}
            >
              {name}
            </span>
          </div>

          <div
            style={{
              fontSize: 12.5,
              color: 'var(--macos-text-muted, #636366)',
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {firm}
          </div>

          <div
            style={{
              fontSize: 11.5,
              color: 'var(--macos-text-secondary, #8e8e93)',
              marginTop: 1,
            }}
          >
            {email}
          </div>
        </div>
      </div>

      {/* Botón de edición compacto estilo macOS */}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Editar datos del despacho"
          style={{
            width: 'auto',
            minWidth: 'auto',
            maxWidth: 'fit-content',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 30,
            padding: '0 14px',
            borderRadius: 999,
            border: '1px solid var(--macos-card-border, rgba(128, 128, 136, 0.22))',
            backgroundColor: 'var(--macos-active-bg, rgba(128, 128, 136, 0.16))',
            color: 'var(--macos-text, #ececef)',
            fontSize: 12,
            fontWeight: 550,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: 'background-color 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--macos-hover-bg, rgba(128, 128, 136, 0.22))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--macos-active-bg, rgba(128, 128, 136, 0.16))';
          }}
        >
          <Icon f7="pencil" size="11px" style={{ color: 'currentColor' }} />
          <span>Editar</span>
        </button>
      )}
    </div>
  );
};

export default SettingsProfileCard;
