export const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

interface IState {
  username: string;
  email: string;
  avatar: string;
  uid: number ;
}

export default {
  state: {
    username: '用户名',
    email:'',
    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1606920074468&di=61667e0de14806a7a26e1e71fb50105f&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201806%2F05%2F20180605193845_kmhss.thumb.700_0.jpeg',
    uid: 0,
  },

  effects: (dispatch) => ({
     async getUserInfo () {
      await delay(1000);
      dispatch.user.update({
        username: 'taobao',
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
