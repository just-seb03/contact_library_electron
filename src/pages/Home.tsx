import React from 'react';
import { Page, Views, View } from 'framework7-react';
import { LeftBar } from '../components/Home/LeftBar';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { activeTab, setActiveTab } = useApp();

  const getTabStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.98) translateY(4px)',
    pointerEvents: isActive ? 'auto' : 'none',
    zIndex: isActive ? 1 : 0,
    transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  return (
    <Page style={styles.pageContainer}>
      <div style={styles.layoutWrapper}>
        {/* Componente de la Barra Lateral */}
        <LeftBar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Áreas de contenido cambiante según la opción elegida */}
        <div style={styles.contentArea}>
          <Views tabs className="safe-areas" style={styles.viewsContainer}>
            <View id="view-home" tab tabActive={activeTab === 'inicio'} url="/home-content/" style={getTabStyle(activeTab === 'inicio')} />
            <View id="view-calendar" tab tabActive={activeTab === 'calendar'} url="/calendar/" style={getTabStyle(activeTab === 'calendar')} />
            <View id="view-cliente" tab tabActive={activeTab === 'cliente'} url="/cliente/" style={getTabStyle(activeTab === 'cliente')} />
            <View id="view-pagos" tab tabActive={activeTab === 'pagos'} url="/pagos/" style={getTabStyle(activeTab === 'pagos')} />
            <View id="view-settings" tab tabActive={activeTab === 'config'} url="/settings/" style={getTabStyle(activeTab === 'config')} />
          </Views>
        </div>
      </div>
    </Page>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    background: 'transparent',
    height: '100vh',
    overflow: 'hidden',
  },
  layoutWrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  contentArea: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  viewsContainer: {
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
};