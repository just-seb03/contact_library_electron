import React from 'react';
import { Page, Views, View } from 'framework7-react';
import { LeftBar } from '../components/Home/LeftBar';

export default function HomePage() {
  return (
    <Page style={styles.pageContainer}>
      <div style={styles.layoutWrapper}>
        {/* Componente de la Barra Lateral */}
        <LeftBar defaultTab="inicio" />

        {/* Áreas de contenido cambiante según la opción elegida */}
        <div style={styles.contentArea}>
          <Views tabs className="safe-areas">
            <View id="view-home" tab tabActive url="/home-content/" />
            <View id="view-calendar" tab url="/calendar/" />
            <View id="view-summary" tab url="/summary/" />
            <View id="view-settings" tab url="/settings/" />
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