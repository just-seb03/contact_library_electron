import HomePage from './pages/Home';
import Calendar from './pages/Calendar';
import Summary from './pages/Summary';
import Configuration from './pages/Configuration';
import Dashboard from './pages/Dashboard';
import Cliente from './pages/Cliente';
import Pagos from './pages/Pagos';

const routes = [
  {
    path: '/',
    component: HomePage,
  },
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
    path: '/summary/',
    component: Summary,
  },
  {
    path: '/settings/',
    component: Configuration,
  },
];

export default routes;