import React from 'react';

export const PaymentsHeader = () => {
  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.title}>Gestión de Pagos</h1>
        <p style={styles.subtitle}>Control de honorarios, cobranzas y facturación</p>
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    margin: '30px',
    fontSize: '26px',
    fontWeight: '700',
    color: '#1d1d1f',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#6e6e73',
  },
};