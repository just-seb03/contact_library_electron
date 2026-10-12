import type { CSSProperties, FC } from 'react';
import { Card, CardContent, Icon, Button, BlockTitle } from 'framework7-react';
import { useApp } from '../../context/AppContext';
import { Client } from './types';
import { formatCLP } from '../../utils/format';

interface ClientCaseDetailsProps {
  client: Client;
}

export const ClientCaseDetails: FC<ClientCaseDetailsProps> = ({ client }) => {
  const { darkMode } = useApp();
  const { caso, pago } = client;

  const cardContainerStyle: CSSProperties = {
    ...styles.cardContainer,
    ...(darkMode ? {
      background: 'rgba(22, 24, 30, 0.65)',
      border: 'none',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
      color: '#f5f5f7',
    } : {}),
  };

  const infoGlassCardStyle: CSSProperties = {
    ...styles.infoGlassCard,
    ...(darkMode ? {
      background: 'rgba(255, 255, 255, 0.06)',
      border: 'none',
      boxShadow: 'none',
      color: '#f5f5f7',
    } : {}),
  };

  const paymentCardStyle: CSSProperties = {
    ...styles.paymentCard,
    ...(darkMode ? {
      background: 'rgba(255, 255, 255, 0.06)',
      border: 'none',
      boxShadow: 'none',
      color: '#f5f5f7',
    } : {}),
  };

  const hearingCardStyle: CSSProperties = {
    ...styles.hearingCard,
    ...(darkMode ? {
      background: 'rgba(255, 255, 255, 0.06)',
      border: 'none',
      boxShadow: 'none',
      color: '#f5f5f7',
    } : {}),
  };

  return (
    <Card 
      outline={false}
      className="no-border margin-horizontal-none margin-bottom-none"
      style={cardContainerStyle}
    >
      <CardContent style={styles.cardContent}>
        {caso ? (
          <div style={styles.caseWrapper}>
            {/* Header del Expediente */}
            <div style={styles.caseHeader}>
              <div>
                <BlockTitle className="font-weight-bold margin-none" style={{ ...styles.sectionTitle, color: darkMode ? '#f5f5f7' : '#1d1d1f' }}>
                  Expediente y Seguimiento Jurídico
                </BlockTitle>
                <div style={styles.courtSubtitle}>
                  {caso.juzgado} · {caso.materia}
                </div>
              </div>

              <div style={styles.headerBadge}>
                <span style={styles.statusPill}>
                  {caso.estado}
                </span>
              </div>
            </div>

            {/* Grid de Tarjetas de Información del Caso */}
            <div style={styles.infoCardsGrid}>
              <div className="case-info-card" style={infoGlassCardStyle}>
                <div style={styles.label}>N° de Expediente</div>
                <div style={styles.value}>{caso.expediente}</div>
              </div>

              <div className="case-info-card" style={infoGlassCardStyle}>
                <div style={styles.label}>Materia Principal</div>
                <div style={styles.value}>{caso.materia}</div>
              </div>
            </div>

            {/* Tarjeta de Honorarios y Cobros sincronizada con Pagos */}
            {pago && (
              <div className="case-payment-card" style={paymentCardStyle}>
                <div style={{ flex: 1 }}>
                  <div style={styles.label}>Estado en Gestión de Pagos</div>
                  <div style={styles.paymentConcept}>
                    {pago.concepto} · <span style={styles.paymentAmount}>{formatCLP(pago.monto)}</span>
                  </div>
                  <div style={styles.paymentDate}>
                    Fecha de registro: {pago.fecha}
                  </div>
                </div>
                <div>
                  <span 
                    className={`badge ${pago.estado === 'completed' ? 'color-green' : pago.estado === 'pending' ? 'color-orange' : 'color-red'}`}
                    style={styles.paymentBadge}
                  >
                    {pago.estado === 'completed' ? 'Cobrado' : pago.estado === 'pending' ? 'Pendiente' : 'Vencido'}
                  </span>
                </div>
              </div>
            )}

            {/* Próxima Audiencia si existe */}
            {caso.proximaAudiencia && (
              <div className="case-hearing-card" style={hearingCardStyle}>
                <div style={styles.hearingIconBox}>
                  <Icon f7="calendar_badge_plus" size="24px" color="blue" />
                </div>
                <div>
                  <div style={styles.hearingLabel}>Próxima Audiencia Programada</div>
                  <div style={styles.hearingDate}>{caso.proximaAudiencia}</div>
                </div>
              </div>
            )}

            {/* Barra de Acciones del Caso */}
            <div style={styles.actionsBar}>
              <Button fill round color="blue" className="elevation-1" style={styles.actionBtn}>
                <Icon f7="arrow_up_doc_fill" size="16px" className="margin-right-half" />
                Subir archivo
              </Button>
              <Button outline round color="blue" style={styles.actionBtn}>
                <Icon f7="folder_fill" size="16px" className="margin-right-half" />
                Ver archivos
              </Button>
            </div>
          </div>
        ) : (
          /* Placeholder cuando no tiene caso asignado */
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIconBox}>
              <Icon f7="folder_badge_plus" size="38px" color="gray" />
            </div>
            <h3 style={styles.emptyTitle}>
              Sin Expediente Activo
            </h3>
            <p style={styles.emptyText}>
              Aún no se ha registrado un expediente judicial para {client.name}. Puedes abrir un nuevo caso o vincular una causa existente.
            </p>
            <Button fill round color="blue" className="margin-top elevation-1" style={styles.createCaseBtn}>
              <Icon f7="plus" size="16px" className="margin-right-half" />
              Crear Nuevo Expediente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const styles: Record<string, CSSProperties> = {
  cardContainer: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  cardContent: {
    padding: '24px',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  caseWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    minHeight: '100%',
  },
  caseHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  },
  sectionTitle: {
    fontSize: '18px',
    color: 'inherit',
    letterSpacing: '-0.3px',
  },
  courtSubtitle: {
    fontSize: '13px',
    color: '#8e8e93',
    marginTop: '4px',
    fontWeight: 500,
  },
  headerBadge: {
    display: 'flex',
    alignItems: 'center',
  },
  statusPill: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    color: '#007aff',
    padding: '5px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    border: '1px solid rgba(0, 122, 255, 0.2)',
  },
  infoCardsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '14px',
    marginTop: '6px',
    marginBottom: '2px',
  },
  infoGlassCard: {
    flex: '1 1 200px',
    background: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.75)',
    borderRadius: '16px',
    padding: '14px 18px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
  },
  label: {
    fontSize: '11px',
    color: '#8e8e93',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: '0.4px',
  },
  value: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'inherit',
    marginTop: '3px',
  },
  paymentCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.75)',
    borderRadius: '16px',
    padding: '12px 18px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
  },
  paymentConcept: {
    fontSize: '14px',
    color: 'inherit',
    fontWeight: 600,
    marginTop: '3px',
  },
  paymentAmount: {
    color: 'inherit',
    fontWeight: 700,
  },
  paymentDate: {
    fontSize: '11px',
    color: '#86868b',
    marginTop: '2px',
  },
  paymentBadge: {
    padding: '5px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
  },
  hearingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.08) 0%, rgba(0, 90, 220, 0.12) 100%)',
    border: '1px solid rgba(0, 122, 255, 0.25)',
    borderRadius: '16px',
    padding: '14px 18px',
  },
  hearingIconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 122, 255, 0.15)',
  },
  hearingLabel: {
    fontSize: '11px',
    color: '#007aff',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  hearingDate: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'inherit',
    marginTop: '2px',
  },
  actionsBar: {
    marginTop: 'auto',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    paddingTop: '16px',
    paddingBottom: '4px',
    flexShrink: 0,
  },
  actionBtn: {
    padding: '0 18px',
    fontSize: '13px',
    fontWeight: 600,
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    padding: '32px 16px',
    textAlign: 'center',
  },
  emptyIconBox: {
    width: '68px',
    height: '68px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    fontSize: '17px',
    fontWeight: 600,
    color: 'inherit',
  },
  emptyText: {
    fontSize: '13px',
    margin: 0,
    color: '#8e8e93',
    maxWidth: '420px',
    lineHeight: '1.5',
  },
  createCaseBtn: {
    padding: '0 20px',
    fontSize: '13px',
    fontWeight: 600,
  },
};
