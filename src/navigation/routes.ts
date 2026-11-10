import Dashboard from '../features/dashboard/pages/DashboardPage';
import contentRoutes from './contentRoutes';

const routes = [
  {
    path: '/',
    component: Dashboard,
  },
  ...contentRoutes,
];

export default routes;