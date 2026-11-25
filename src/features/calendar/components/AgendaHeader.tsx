import type { FC, CSSProperties } from 'react';
import { Icon } from 'framework7-react';

interface AgendaHeaderProps {
  onAddEvent: () => void;
}

export const AgendaHeader: FC<AgendaHeaderProps> = ({ onAddEvent }) => {
  const headerStyle: CSSProperties = {
    padding: '10px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  return (
    <div style={headerStyle}>
      <button
        type="button"
        onClick={onAddEvent}
        aria-label="Añadir evento"
        title="Añadir evento"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 34,
          height: 34,
          padding: 0,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: 'var(--macos-text, #ececef)',
          opacity: 0.85,
          cursor: 'pointer',
          transition: 'opacity 0.14s ease, transform 0.14s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.85';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Icon f7="plus" size="24px" />
      </button>
    </div>
  );
};

export default AgendaHeader;
