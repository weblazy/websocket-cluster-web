export const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

interface IState {
  username: string;
  email: string;
  department: string;
  avatar: string;
  uid: number | null;
  token: string;
}

export default {
  state: {
    username: '小强',
    email:'',
    department: '',
    avatar: '',
    token: '',
    uid: null,
  },

  effects: (dispatch) => ({
     async getUserInfo () {
      await delay(1000);
      dispatch.user.update({
        name: 'taobao',
        id: '123',
      });
    },
  }),

  reducers: {
    update(prevState: IState, payload: IState) {
      return { ...prevState, ...payload };
    },
  },
};
