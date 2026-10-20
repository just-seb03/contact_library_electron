import { useEffect, useRef } from 'react';
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
    <Page>
      <View
        id="content-view"
        className="safe-areas"
        url="/home-content/"
        routes={contentRoutes}
        onViewInit={handleContentViewInit}
      />
      <LeftBar />
    </Page>
  );
}
