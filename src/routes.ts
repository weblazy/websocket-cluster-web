import BasicLayout from '@/layouts/BasicLayout';
import Dashboard from '@/pages/Dashboard';
import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login'

const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      }
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/index',
        component: Dashboard,
      },
      {
        path: '/',
        exact: true,
        redirect: '/user/login',
      },
    ],
  }
];
export default routerConfig;
