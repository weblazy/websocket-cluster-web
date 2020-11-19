import UserLayout from '@/layouts/UserLayout';
import Login from './index'

const routerConfig = [
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '/',
        component: Login,
      }
    ],
  },

];
export default routerConfig;

