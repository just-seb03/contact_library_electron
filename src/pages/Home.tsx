import React from 'react';
import { Page, Views, View } from 'framework7-react';
import { LeftBar } from '../components/Home/LeftBar';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <Page style={styles.pageContainer}>
      <div style={styles.layoutWrapper}>
        {/* Componente de la Barra Lateral */}
        <LeftBar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Áreas de contenido cambiante según la opción elegida */}
        <div style={styles.contentArea}>
          <Views tabs className="safe-areas">
            <View id="view-home" tab tabActive={activeTab === 'inicio'} url="/home-content/"/>
            <View id="view-calendar" tab tabActive={activeTab === 'calendar'} url="/calendar/"/>
            <View id="view-cliente" tab tabActive={activeTab === 'cliente'} url="/cliente/" />
            <View id="view-pagos" tab tabActive={activeTab === 'pagos'} url="/pagos/" />
            <View id="view-settings" tab tabActive={activeTab === 'config'} url="/settings/" />
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
};