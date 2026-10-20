import Dashboard from './pages/Dashboard';
import contentRoutes from './contentRoutes';

const routes = [
  {
    path: '/',
    component: Dashboard,
  },
  ...contentRoutes,
];

export default routes;