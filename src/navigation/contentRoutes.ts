import Calendar from '../features/calendar/pages/CalendarPage';
import Configuration from '../features/settings/pages/ConfigurationPage';
import Dashboard from '../features/dashboard/pages/DashboardPage';
import Cliente from '../features/clients/pages/ClientsPage';
import Pagos from '../features/payments/pages/PaymentsPage';

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
