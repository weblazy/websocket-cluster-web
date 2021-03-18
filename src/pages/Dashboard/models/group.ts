export const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

interface IState {
  groupName: string;
  avatar: string;
  groupId: number;
}

export default {
  state: {
    groupName: '群名',
    avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
    groupId: 0,
  },
};

