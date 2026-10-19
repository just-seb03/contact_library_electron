import HomePage from './pages/Home';
import contentRoutes from './contentRoutes';

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  ...contentRoutes,
];

export default routes;