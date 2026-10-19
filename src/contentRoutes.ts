import Calendar from './pages/Calendar';
import Configuration from './pages/Configuration';
import Dashboard from './pages/Dashboard';
import Cliente from './pages/Cliente';
import Pagos from './pages/Pagos';

const contentRoutes = [
  {
    path: '/home-content/',
    component: Dashboard,
  },
  {
    path: '/calendar/',
    component: Calendar,
  },
  {
    path: '/cliente/',
    component: Cliente,
  },
  {
    path: '/pagos/',
    component: Pagos,
  },
  {
    path: '/settings/',
    component: Configuration,
  },
];

export default contentRoutes;
