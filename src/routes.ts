import Summary from './pages/Summary';
import Calendar from './pages/Calendar';
import Settings from './pages/Configuration';

const routes = [
  {
    path: '/',
    component: Summary,
  },
  {
    path: '/summary/',
    component: Summary,
  },
  {
    path: '/calendar/',
    component: Calendar,
  },
  {
    path: '/settings/',
    component: Settings,
  },
];

export default routes;
