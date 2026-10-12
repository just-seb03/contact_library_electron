import type { CSSProperties } from 'react';
import {
  Page,
  Block,
  BlockTitle,
  Card,
  List,
  ListItem,
  Toggle,
  Icon,
} from 'framework7-react';
import { useApp } from '../context/AppContext';

export default function Configuration() {
  const { darkMode, toggleDarkMode } = useApp();

  const glassCardStyle: CSSProperties = {
    ...styles.glassCard,
    ...(darkMode ? {
      background: 'rgba(22, 24, 30, 0.65)',
      border: 'none',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
      color: '#f5f5f7',
    } : {}),
  };

  return (
    <Page className="liquid-page" pageContent={false} style={{ background: 'transparent' }}>
      <div style={styles.scrollWrapper}>
        <div style={styles.contentContainer}>
          {/* Encabezado Principal */}
          <Block style={styles.headerBlock}>
            <div style={styles.headerIconBox}>
              <Icon f7="gear_alt_fill" size="32px" color="blue" />
            </div>
            <div>
              <h1 style={{ ...styles.mainTitle, color: darkMode ? '#f5f5f7' : '#1d1d1f' }}>Configuraciones</h1>
              <p style={{ ...styles.subtitle, color: darkMode ? '#a1a1a6' : '#666' }}>
                Personaliza la apariencia del sistema, gestiona las preferencias y revisa el estado de sincronización.
              </p>
            </div>
          </Block>

          {/* Sección 1: Apariencia y Tonalidad */}
          <BlockTitle className="font-weight-bold" style={styles.sectionTitle}>
            Apariencia y Tonalidad
          </BlockTitle>
          <Card 
            outline={false}
            className="no-border margin-horizontal-none"
            style={glassCardStyle}
          >
            <List mediaList className="no-hairlines no-hairlines-between" style={styles.listTransparent}>
              {/* Opción Principal: Modo Oscuro */}
              <ListItem
                title="Modo Oscuro"
                subtitle={darkMode ? 'Tonalidad oscura Midnight activada para todas las vistas' : 'Tonalidad clara Pure Crystalline activada'}
              >
                <div slot="media" style={styles.iconWrapper(darkMode ? '#5e5ce6' : '#ff9500')}>
                  <Icon f7={darkMode ? 'moon_stars_fill' : 'sun_max_fill'} size="20px" color="white" />
                </div>
                <div slot="after">
                  <Toggle 
                    checked={darkMode} 
                    onChange={toggleDarkMode} 
                    color="blue" 
                  />
                </div>
              </ListItem>
            </List>
          </Card>

          {/* Sección 2: Notificaciones y Recordatorios */}
          <BlockTitle className="font-weight-bold" style={styles.sectionTitle}>
            Notificaciones y Alertas
          </BlockTitle>
          <Card 
            outline={false}
            className="no-border margin-horizontal-none"
            style={glassCardStyle}
          >
            <List mediaList className="no-hairlines no-hairlines-between" style={styles.listTransparent}>
              <ListItem
                title="Alertas de Audiencias Judiciales"
                subtitle="Recordatorios automáticos de comparecencias fijadas en los expedientes"
              >
                <div slot="media" style={styles.iconWrapper('#007aff')}>
                  <Icon f7="calendar" size="20px" color="white" />
                </div>
                <div slot="after">
                  <Toggle defaultChecked color="blue" />
                </div>
              </ListItem>

              <ListItem
                title="Recordatorios de Cobros"
                subtitle="Avisos sobre honorarios pendientes y facturas próximas a vencer"
              >
                <div slot="media" style={styles.iconWrapper('#ff9500')}>
                  <Icon f7="creditcard_fill" size="20px" color="white" />
                </div>
                <div slot="after">
                  <Toggle defaultChecked color="blue" />
                </div>
              </ListItem>
            </List>
          </Card>

          {/* Sección 3: Información de la Aplicación */}
          <BlockTitle className="font-weight-bold" style={styles.sectionTitle}>
            Información del Software
          </BlockTitle>
          <Card 
            outline={false}
            className="no-border margin-horizontal-none"
            style={glassCardStyle}
          >
            <List mediaList className="no-hairlines no-hairlines-between" style={styles.listTransparent}>
              <ListItem
                title="Contact Library Desktop"
                subtitle="Framework7 v9.2 · React 18 · Electron 30 · Vite"
              >
                <div slot="media" style={styles.iconWrapper('#8e8e93')}>
                  <Icon f7="desktopcomputer" size="20px" color="white" />
                </div>
                <div slot="after">
                  <span style={styles.versionText}>v1.0.0</span>
                </div>
              </ListItem>
            </List>
          </Card>
        </div>
      </div>
    </Page>
  );
}

const styles: {
  scrollWrapper: CSSProperties;
  contentContainer: CSSProperties;
  headerBlock: CSSProperties;
  headerIconBox: CSSProperties;
  mainTitle: CSSProperties;
  subtitle: CSSProperties;
  sectionTitle: CSSProperties;
  glassCard: CSSProperties;
  listTransparent: CSSProperties;
  versionText: CSSProperties;
  iconWrapper: (bg: string) => CSSProperties;
} = {
  scrollWrapper: {
    height: '100%',
    overflowY: 'auto',
    padding: '52px 24px 48px 16px',
    boxSizing: 'border-box',
  },
  contentContainer: {
    maxWidth: '820px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  headerBlock: {
    margin: '0 0 16px 0',
    padding: '12px 4px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  headerIconBox: {
    width: '60px',
    height: '60px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    border: '1px solid rgba(0, 122, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  mainTitle: {
    fontSize: '26px',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    margin: 0,
  },
  subtitle: {
    fontSize: '13px',
    color: '#666',
    margin: '4px 0 0 0',
  },
  sectionTitle: {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '18px 0 8px 8px',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.45)',
    backdropFilter: 'blur(25px) saturate(190%)',
    WebkitBackdropFilter: 'blur(25px) saturate(190%)',
    border: '1px solid rgba(255, 255, 255, 0.65)',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
  },
  listTransparent: {
    margin: 0,
    background: 'transparent',
  },
  versionText: {
    fontSize: '12px',
    fontWeight: 600,
    opacity: 0.6,
  },
  iconWrapper: (bg: string) => ({
    width: '38px',
    height: '38px',
    borderRadius: '11px',
    backgroundColor: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.12)',
  }),
};
