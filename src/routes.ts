import BasicLayout from '@/layouts/BasicLayout';
import Dashboard from '@/pages/Dashboard';
import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login'

const routerConfig = [
  {
    path: '/index',
    component: BasicLayout,
    children: [
      {
        path: '/',
        component: Dashboard,
      }
    ],
  },
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '/user/login',
        component: Login,
      },
      {
        path: '/',
        exact: true,
        redirect: '/user/login',
      },
    ],
  },

];
export default routerConfig;
