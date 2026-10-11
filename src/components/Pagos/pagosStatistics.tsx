import React from 'react';

interface StatsProps {
  totalIngresos: number;
  totalPendientes: number;
  cobrosPendientesCount: number;
  totalTransacciones: number;
}

export const PaymentsStats: React.FC<StatsProps> = ({
  totalIngresos,
  totalPendientes,
  cobrosPendientesCount,
  totalTransacciones,
}) => {
  return (
    <section style={styles.statsGrid}>
      <div style={styles.glassCard}>
        <span style={styles.cardLabel}>Ingresos Cobrados</span>
        <div style={{ ...styles.cardValue, color: '#10b981' }}>${totalIngresos.toFixed(2)}</div>
        <span style={styles.cardSubtext}>Este mes</span>
      </div>

      <div style={styles.glassCard}>
        <span style={styles.cardLabel}>Por Cobrar</span>
        <div style={{ ...styles.cardValue, color: '#f59e0b' }}>${totalPendientes.toFixed(2)}</div>
        <span style={styles.cardSubtext}>{cobrosPendientesCount} cobros pendientes</span>
      </div>

      <div style={styles.glassCard}>
        <span style={styles.cardLabel}>Total Transacciones</span>
        <div style={styles.cardValue}>{totalTransacciones}</div>
        <span style={styles.cardSubtext}>Registradas en agenda</span>
      </div>
    </section>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#86868b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '8px 0 4px 0',
    letterSpacing: '-0.5px',
    color: '#1d1d1f',
  },
  cardSubtext: {
    fontSize: '11px',
    color: '#86868b',
  },
};