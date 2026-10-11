import React from 'react';

interface ButtonProps {
  onClick?: () => void;
}

export const RegisterPaymentButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <div style={styles.buttonContainer}>
      <button style={styles.primaryButton} onClick={onClick}>
        <i className="f7-icons" style={{ fontSize: '16px', marginRight: '6px' }}>
          plus_circle_fill
        </i>
        Registrar Cobro
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: '20px',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0071e3',
    width: 'auto',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)',
    transition: 'all 0.2s ease',
  },
};