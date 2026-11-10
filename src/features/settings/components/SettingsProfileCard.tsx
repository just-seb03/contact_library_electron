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
  darkMode,
  onEdit,
}) => {
  const cardStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderRadius: 14,
    backgroundColor: darkMode ? 'rgba(38, 38, 42, 0.8)' : 'rgba(255, 255, 255, 0.85)',
    border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.07)',
    boxShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
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
            background: 'linear-gradient(135deg, var(--macos-accent-color, #007aff), #5856d6)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: '0 4px 12px var(--macos-accent-tint-active, rgba(0, 122, 255, 0.35))',
            border: darkMode ? '2px solid rgba(255, 255, 255, 0.15)' : '2px solid #ffffff',
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
                color: darkMode ? '#ffffff' : '#1c1c1e',
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
              color: darkMode ? '#a1a1aa' : '#636366',
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
              color: darkMode ? '#71717a' : '#8e8e93',
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
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.15)',
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : '#ffffff',
            color: darkMode ? '#ffffff' : '#1c1c1e',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.14)' : '#f2f2f7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255, 255, 255, 0.08)' : '#ffffff';
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
