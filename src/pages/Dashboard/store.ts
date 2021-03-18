import { createStore } from 'ice';
import user from './models/user';
import group from './models/group';
const store = createStore({ user,group });

export default store;