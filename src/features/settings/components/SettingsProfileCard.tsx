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
    borderRadius: 14,
    backgroundColor: 'var(--macos-card-bg, rgba(255, 255, 255, 0.85))',
    border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.07))',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
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
        {/* Avatar estilo Apple con gradiente y anillo */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--macos-accent-color, #0056b8), var(--macos-accent-gradient-end, #5336c7))',
            color: 'var(--macos-on-accent, #ffffff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 4px 12px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.35))',
            border: '2px solid var(--macos-card-bg, #ffffff)',
          }}
        >
          {getInitials(name) || 'CL'}
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 16,
                fontWeight: 650,
                color: 'var(--macos-text, #1c1c1e)',
                letterSpacing: '-0.01em',
              }}
            >
              {name}
            </span>
            <Icon f7="checkmark_seal_fill" size="14px" style={{ color: 'var(--macos-accent-color, #007aff)' }} />
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
            height: 28,
            padding: '0 12px',
            borderRadius: 6,
            border: '1px solid var(--macos-card-border, rgba(0, 0, 0, 0.15))',
            backgroundColor: 'var(--macos-input-bg, #ffffff)',
            color: 'var(--macos-text, #1c1c1e)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--macos-hover-bg, #f2f2f7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--macos-input-bg, #ffffff)';
          }}
        >
          <Icon f7="pencil" size="11px" style={{ color: 'var(--macos-accent-color, #007aff)' }} />
          <span>Editar</span>
        </button>
      )}
    </div>
  );
};

export default SettingsProfileCard;
