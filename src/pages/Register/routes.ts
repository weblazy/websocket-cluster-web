import UserLayout from '@/layouts/UserLayout';
import LoginBlock from '../Register/components/LoginBlock';
import Login from './index'

const routerConfig = [
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '/',
        component: LoginBlock,
      }
    ],
  },

];
export default routerConfig;

