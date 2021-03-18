import React, { useState } from 'react';
import { Shell, ConfigProvider } from '@alifd/next';
import PageNav from './components/PageNav';
import Logo from './components/Logo';
import Footer from './components/Footer';
import HeaderAvatar from './components/HeaderAvatar';

var storage = window.localStorage

var socket
var heart_im_inited = false


function heart_im_connect_server() {
  socket = new WebSocket('ws://' + '' + window.location.hostname+':9528/client');

  var timer
  socket.onopen = function () {
    socket.send(JSON.stringify({
      msg_type: 'init',
      data: {
        token: storage.token,
      },
    }));
    timer = setInterval(function () {
      if (socket != null) {
        socket.send(JSON.stringify({
          msg_type: "ping",
        }))
      }
    }, 120000);
  };
  socket.onmessage = function (event) {
    var b = JSON.parse(event.data);
    switch (b.msg_type) {
      case "init":
        let last_user_msg_id = 0
        if (storage["max_user_msg_id_" + storage.uid] != undefined) {
          last_user_msg_id = parseInt(storage["max_user_msg_id_" + storage.uid])
        }
        if (last_user_msg_id < b.data.max_user_msg_id) {
          socket.send(JSON.stringify({ msg_type: "sync_user_msg", data: { last_user_msg_id: last_user_msg_id } }));
        }
        for (let v of b.data.user_group_list) {
          let last_group_msg_id = 0
          if (v.max_group_msg_id > 0) {
            let max_group_msg_id = "max_group_msg_id_" + storage.uid + "_" + v.group_id
            if (storage[max_group_msg_id] == undefined || storage[max_group_msg_id] < v.max_group_msg_id) {
              if (storage[max_group_msg_id] != undefined){
                last_group_msg_id = parseInt(storage[max_group_msg_id])
              }
              socket.send(JSON.stringify({ msg_type: "pull_group_msg", data: { group_id: v.group_id, last_group_msg_id: last_group_msg_id, sort: "asc" } }));
             }     
          }
        }
        break;
      case "chat_message_list":
        let message_id_list: number[] = [];
        for (let v of b.data.list) {
          message_id_list.push(v.cid)
          layui.layim.getMessage(v);
          console.log(v)
        };
        socket.send(JSON.stringify({ message_type: "ack_receive", data: { message_id_list: message_id_list } }));
        break;
      case "sync_user_msg":
        if (b.data.user_msg_list.length == 0) {
          break
        }
        for (let v of b.data.user_msg_list) {
          if (storage["max_user_msg_id_" + storage.uid] == undefined || storage["max_user_msg_id_" + storage.uid] < v.user_msg_id) {
            storage["max_user_msg_id_" + storage.uid] = v.user_msg_id
            v.id = v.send_uid
            v.type = "friend"
            v.cid = v.user_msg_id
            v.fromid = v.send_uid
            v.mine = false
            if (v.fromid == storage.uid) {
              v.mine = true
            }
            if (v.mine) {
              v.id = v.receive_uid
            }
            v.timestamp = v.created_at * 1000
            heart_im_get_message(v)
          }
        }
        last_user_msg_id = 0
        if (storage["max_user_msg_id_" + storage.uid] != undefined) {
          last_user_msg_id = parseInt(storage["max_user_msg_id_" + storage.uid])
        }
        socket.send(JSON.stringify({ msg_type: "sync_user_msg", data: { last_user_msg_id: last_user_msg_id } }));
        break
      case "pull_group_msg":
        if (b.data.group_msg_list.length == 0) {
          break
        }
        let group_id = 0
        let last_group_msg_id = 0
        for (let v of b.data.group_msg_list) {
          group_id = v.group_id
          let max_group_msg_id = "max_group_msg_id_" + storage.uid + "_" + v.group_id
          if (storage[max_group_msg_id] == undefined || storage[max_group_msg_id] < v.group_msg_id) {
            storage[max_group_msg_id] = v.group_msg_id
            v.id = v.group_id
            v.type = "group"
            v.cid = v.group_msg_id
            v.fromid = v.send_uid
            v.mine = false
            if (v.fromid == storage.uid) {
              v.mine = true
            }
            v.timestamp = v.created_at * 1000
            heart_im_get_message(v)
          }

          if (storage[max_group_msg_id] != undefined) {
            last_group_msg_id = parseInt(storage[max_group_msg_id])
          }

        }
        socket.send(JSON.stringify({ msg_type: "pull_group_msg", data: { group_id: group_id, last_group_msg_id: last_group_msg_id, sort: "asc" } }));
        break;
      case "have_new_msg":
        if (b.data.max_user_msg_id != undefined) {
          last_user_msg_id = 0
          if (storage["max_user_msg_id_" + storage.uid] != undefined) {
            last_user_msg_id = parseInt(storage["max_user_msg_id_" + storage.uid])
          }
          if (b.data.max_user_msg_id > last_user_msg_id) {
            socket.send(JSON.stringify({ msg_type: "sync_user_msg", data: { last_user_msg_id: last_user_msg_id } }));
          }
        }
        if (b.data.max_group_msg_id != undefined) {
          let max_group_msg_id = "max_group_msg_id_" + storage.uid + "_" + + b.data.group_id
          let last_group_msg_id = 0
          if (storage[max_group_msg_id] != undefined) {
            last_group_msg_id = parseInt(storage[max_group_msg_id])
          }
          if (b.data.max_group_msg_id > last_group_msg_id) {
            socket.send(JSON.stringify({ msg_type: "pull_group_msg", data: { group_id: b.data.group_id, last_group_msg_id: last_group_msg_id, sort: "asc" } }));
          }
        }
        break;
      case "add_friend":
        layui.layim.msgbox(b.data.count);
        break;
      case "manage_add_friend":
        //将好友追加到主面板
        layui.layim.addList({
          type: 'friend'
          , avatar: b.data.avatar //好友头像
          , username: b.data.username //好友昵称
          , groupid: b.data.group_id //所在的分组id
          , id: b.data.id //好友ID
          , sign: b.data.sign //好友签名
        });
        break;
      case "join_group":
        layui.layim.msgbox(b.data.count);
        console.log(b.data.count)
        break;
      case "manage_join_group":
        layui.layim.addList({
          type: 'group'
          , avatar: b.data.avatar //好友头像
          , groupname: b.data.group_name //好友昵称
          , id: b.data.id //好友ID
        });
        break;
      case "read_system_msg":
        break;
      case "logout":
        break;
      case "hide":
        break;
      case "online":
        heart_im_change_online_status(b.id, b.message_type);
        break;
      case "create_group":
        layui.layim.addList(b.data);
        break;
    }
  };
  socket.onclose = function () {
    clearTimeout(timer);
    heart_im_connect_server();
  }
}

function heart_im_change_online_status(b, a) {
  if (a === "hide" || a === "logout") {
    return layui.jquery("#layim-friend" + b + " img").addClass("gray_icon");
  }
  return layui.jquery("#layim-friend" + b + " img").removeClass("gray_icon");
}


function heart_im_init() {
  if (heart_im_inited) {
    return;
  }
  heart_im_inited = true;
  layui.use('layim', function (layim) {
    layim.config({
      init: {
        url: 'http://' + window.location.hostname+':80/p1/web/chatInit' //接口地址（返回的数据格式见下文）
        , type: 'post'
        , headers: { token: storage.token }
      },
      brief: false,
      members: {
        url: 'http://' + window.location.hostname+':80/p1/web/getGroupMembers' //接口地址（返回的数据格式见下文）
        , type: 'post'
        , headers: { token: storage.token }
        , data: {}
      },
      title: "标题",
      msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html',
      chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html',
      find: layui.cache.dir + 'css/modules/layim/html/creat_group.html',
      copyright: false
    });

    layim.on('sendMessage', function (b) {
      let msg = {
        msg_type: 'send_to_user',
        data: {
          username: b.mine.username,
          avatar: b.mine.avatar,
          content: b.mine.content,
        },
      }
      if (b.to.type == 'group') {
        msg.msg_type = 'send_to_group'
        msg.data.group_id = b.to.id
      }
      if (b.to.type == 'friend') {
        msg.data.receive_uid = b.to.id
      }
      socket.send(JSON.stringify(msg));
    });
    layim.on('online', function (b) {
      socket.send(JSON.stringify({ type: b }));
    });
    layim.on('chatChange', function (b) {
      if (b.data.type == "group") {
        let max_group_msg_id = "max_group_msg_id_" + storage.uid + "_" + b.data.id
        let last_group_msg_id = 0
        if (storage[max_group_msg_id] != undefined) {
          last_group_msg_id = parseInt(storage[max_group_msg_id])
        }
        // socket.send(JSON.stringify({ msg_type: "pull_group_msg", data: { group_id: b.data.id, last_group_msg_id: last_group_msg_id, sort: "asc" } }));
      }
    });
    layui.jquery(".heart-im-chat").on("click", function () {
      console.log("click")
      // var b = layui.jquery(this);
      // layim.chat({ name: b.attr("username"), type: "friend", avatar: b.attr("avatar"), id: b.attr("uid") });
    });
    layim.on('ready', function (res) {
      heart_im_connect_server()
      // layim.add({
      //   type: 'friend' //friend：申请加好友、group：申请加群
      //   , username: 'xxx' //好友昵称，若申请加群，参数为：groupname
      //   , avatar: 'a.jpg' //头像
      //   , submit: function (group, remark, index) { //一般在此执行Ajax和WS，以通知对方
      //     console.log(group); //获取选择的好友分组ID，若为添加群，则不返回值
      //     console.log(remark); //获取附加信息
      //     layui.layer.close(index); //关闭改面板
      //   }
      // });

    });
  });
}

layui.use(["jquery"], function () {
  var storage = window.localStorage
  if (storage.token == undefined) {
    location.href = '/login.html#/'
  }
  heart_im_init();
});

function heart_im_get_message(a) {
  a.id = parseInt(a.id)
  layui.layim.getMessage(a);
  return;
}



(function () {
  const throttle = function (type: string, name: string, obj: Window = window) {
    let running = false;

    const func = () => {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  if (typeof window !== 'undefined') {
    throttle('resize', 'optimizedResize');
  }
})();

interface IGetDevice {
  (width: number): 'phone' | 'tablet' | 'desktop';
}
export default function BasicLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const getDevice: IGetDevice = (width) => {
    const isPhone =
      typeof navigator !== 'undefined' &&
      navigator &&
      navigator.userAgent.match(/phone/gi);

    if (width < 680 || isPhone) {
      return 'phone';
    } else if (width < 1280 && width > 680) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  const [device, setDevice] = useState(getDevice(NaN));

  if (typeof window !== 'undefined') {
    window.addEventListener('optimizedResize', (e) => {
      const deviceWidth =
        (e && e.target && (e.target as Window).innerWidth) || NaN;
      setDevice(getDevice(deviceWidth));
    });
  }
  return (

    <ConfigProvider device={device}>
      <Shell
        style={{
          minHeight: '100vh',
        }}
        type="brand"
        fixedHeader={false}
      >
        <Shell.Branding>
          <Logo
            image="https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png"
            text="Logo"
          />
        </Shell.Branding>
        <Shell.Navigation
          direction="hoz"
          style={{
            marginRight: 10,
          }}
        />
        <Shell.Action>
          <HeaderAvatar />
        </Shell.Action>
        <Shell.Navigation>
          <PageNav />
        </Shell.Navigation>
        <Shell.Content>{children}
        </Shell.Content>
        <Shell.Footer>
          <Footer />
        </Shell.Footer>
      </Shell>
    </ConfigProvider>
  );
}
