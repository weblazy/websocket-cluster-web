import React from 'react';
import { ResponsiveGrid, Search, Message, Button, Avatar } from '@alifd/next';
// import Guide from './components/Guide';
import store from '@/pages/Dashboard/store';
import userService from '@/services/user';
import { Tag, Icon } from '@alifd/next';

const { Group: TagGroup } = Tag;
const { Cell } = ResponsiveGrid;
const Dashboard = () => {
  const [userState, userDispatchers] = store.useModel('user');
  const [group, groupDispatchers] = store.useModel('group');

  const onSearchEmail = (v): void => {
    var params = {
      keyword: v,
      search_type: "email"
    }
    let storage = window.localStorage
    let headers = { token: storage.token }

    userService.search(headers, params).then(function (response) {
      if (response.code != 0) {
        Message.error(response.msg);
        return
      }
      userDispatchers.setState({ username: response.data.name, avatar: response.data.avatar, email: response.data.avatar, uid: response.data.uid })
      Message.success('请求成功');

    }).catch(function (e) {
      console.log(e);
      Message.error('请求失败');
    });
  };

  const onSearchGroup = (v): void => {
    var params = {
      keyword: v,
      search_type: "goup"
    }
    let storage = window.localStorage
    let headers = { token: storage.token }

    userService.search(headers, params).then(function (response) {
      if (response.code != 0) {
        Message.error(response.msg);
        return
      }
      groupDispatchers.setState({ groupName: response.data.name, avatar: response.data.avatar, groupId: response.data.group_id })
      Message.success('请求成功');
    }).catch(function (e) {
      console.log(e);
      Message.error('请求失败');
    });
  }

  const onAddGroup = (v): void => {
    if (group.groupId == 0) {
      Message.error('请输入群ID');
      return
    }
    layui.layim.add({
      type: 'group' //friend：申请加好友、group：申请加群
      , username: group.groupName //好友昵称，若申请加群，参数为：groupname
      , avatar: group.avatar //头像
      , submit: function (friendGroup, remark, index) { //一般在此执行Ajax和WS，以通知对方
        var params = {
          group_id: group.groupId,
          remark: remark
        }
        let storage = window.localStorage
        let headers = { token: storage.token }

        userService.addGroup(headers, params).then(function (response) {
          if (response.code != 0) {
            Message.error(response.msg);
            return
          }
          Message.success('请求成功');
          layer.close(index); //关闭改面板

        }).catch(function (e) {
          console.log(e);
          Message.error('请求失败');
        });
      }
    });

  };

  const onAddFriend = (v): void => {
    if (userState.uid == 0) {
      Message.error('请输入邮箱地址');
      return
    }
    // if document.getElementById('searchEmail').value == ""{

    // }
    layui.layim.add({
      type: 'friend' //friend：申请加好友、group：申请加群
      , username: userState.username //好友昵称，若申请加群，参数为：groupname
      , avatar: userState.avatar //头像
      , submit: function (group, remark, index) { //一般在此执行Ajax和WS，以通知对方
        var params = {
          friend_uid: userState.uid,
          remark: remark
        }
        let storage = window.localStorage
        let headers = { token: storage.token }

        userService.addFriend(headers, params).then(function (response) {
          if (response.code != 0) {
            Message.error(response.msg);
            return
          }
          Message.success('请求成功');
          layer.close(index); //关闭改面板

        }).catch(function (e) {
          console.log(e);
          Message.error('请求失败');
        });
      }
    });

  };

  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <div className="layui-card">
          <div className="layui-card-header">
            <Search type="normal" id="searchEmail" placeholder="请输入邮箱" onSearch={onSearchEmail} style={{ width: '400px' }} />
            <br /> <br />
          </div>

          <div className="layui-card-body">
            <Avatar size="small" src={userState.avatar} alt="用户头像" />
            <span style={{ marginLeft: 10 }}>{userState.username}</span>
            &nbsp;&nbsp;<Button type="primary" size="small" htmlType="button" onClick={onAddFriend}>加好友</Button>
          </div>
        </div>
        <div className="layui-card">
          <div className="layui-card-header">
            <Search type="normal" placeholder="请输入群ID" onSearch={onSearchGroup} style={{ width: '400px' }} />
            <br /> <br />
          </div>

          <div className="layui-card-body">
            <Avatar size="small" src={group.avatar} alt="用户头像" />
            <span style={{ marginLeft: 10 }}>{group.groupName}</span>
              &nbsp;&nbsp;<Button type="primary" size="small" htmlType="button" onClick={onAddGroup}>加群</Button>
          </div>
        </div>

        <TagGroup>
          <Tag size="medium"><a href="https://github.com/weblazy/websocket-cluster-web" target="_blank"><Icon type="smile" /> webSocket-cluster-web</a></Tag>
        </TagGroup>
        <TagGroup>
          <Tag size="medium"><a href="https://github.com/weblazy/websocket-cluster" target="_blank"><Icon type="smile" /> webSocket-cluster</a></Tag>
        </TagGroup>
        <TagGroup>
          <Tag size="medium"><a href="https://github.com/weblazy/lazygodoc" target="_blank"><Icon type="smile" /> webSocket-cluster-doc</a></Tag>
        </TagGroup>
        <a
          href="https://ice.work/docs/guide/about"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: 20,
          }}
        >
          <Button type="primary" size="large">
            使用文档
          </Button>
        </a>
        <a
          href="https://github.com/ice-lab/icejs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="secondary" size="large">
            GitHub
          </Button>
        </a>
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;
