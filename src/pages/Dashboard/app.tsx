import { runApp, IAppConfig } from 'ice'; 
import routes from './routes';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  router: {
    routes
  }
};

runApp(appConfig);
