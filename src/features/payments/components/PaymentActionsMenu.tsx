import { useState, type CSSProperties, type FC } from 'react';
import { Icon } from 'framework7-react';

interface PaymentActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const PaymentActionsMenu: FC<PaymentActionsMenuProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  const menuStyle: CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    zIndex: 2,
    minWidth: 120,
    padding: 4,
    border: '1px solid #e5e5ea',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    boxShadow: '0 5px 18px rgba(0,0,0,0.14)',
  };

  const actionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    borderRadius: 7,
    backgroundColor: 'transparent',
    color: '#1c1c1e',
    fontSize: 13,
    textAlign: 'left',
    cursor: 'pointer',
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        aria-label="Acciones del pago"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          border: 'none',
          borderRadius: 8,
          backgroundColor: open ? '#e5e5ea' : 'transparent',
          color: '#6e6e73',
          cursor: 'pointer',
        }}
      >
        <Icon f7="ellipsis_vertical" size="18px" />
      </button>
      {open && (
        <div style={menuStyle}>
          <button
            type="button"
            style={actionStyle}
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <Icon f7="pencil" size="14px" />
            Editar
          </button>
          <button
            type="button"
            style={{ ...actionStyle, color: '#c62820' }}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Icon f7="trash" size="14px" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};
