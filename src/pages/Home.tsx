import { useEffect, useRef, type CSSProperties } from 'react';
import { Page, View } from 'framework7-react';
import type { Router as Framework7Router, View as Framework7View } from 'framework7/types';
import { LeftBar } from '../components/Home/LeftBar';
import { useApp } from '../context/AppContext';
import contentRoutes from '../contentRoutes';
import { getAppTabForRoute } from '../utils/navigation';

export default function HomePage() {
  const { setActiveTab } = useApp();
  const removeRouteListener = useRef<(() => void) | null>(null);

  const handleContentViewInit = (view?: Framework7View.View) => {
    const router = view?.router;
    if (!router) return;

    const syncActiveTab = (route: Framework7Router.Route) => {
      const tab = getAppTabForRoute(route.path);
      if (tab) setActiveTab(tab);
    };

    router.on('routeChanged', syncActiveTab);
    syncActiveTab(router.currentRoute);
    removeRouteListener.current = () => router.off('routeChanged', syncActiveTab);
  };

  useEffect(() => () => removeRouteListener.current?.(), []);

  return (
    <Page style={styles.pageContainer}>
      <div style={styles.layoutWrapper}>
        <LeftBar />

        <div style={styles.contentArea}>
          <View
            id="content-view"
            className="safe-areas"
            url="/home-content/"
            routes={contentRoutes}
            style={styles.viewsContainer}
            onViewInit={handleContentViewInit}
          />
        </div>
      </div>
    </Page>
  );
}

const styles: Record<string, CSSProperties> = {
  pageContainer: {
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