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
  socket = new WebSocket('ws://' + '127.0.0.1:9528/p1/client');
  socket.onopen = function () {
    socket.send(JSON.stringify({
      message_type: 'init',
     data:{
       token: storage.token,
     }, 
    }));
  };
  socket.onmessage = function (event) {
    console.log(event)
    var b = JSON.parse(event.data);
  
    switch (b.message_type) {
      case "init":
        heart_im_init();
        socket.send(JSON.stringify({ type: "initcomplete", uid: b.id }));
        return;
      case "chat_message_list":
        let message_id_list : number[] = [];
        for (let v of b.data.list) {
          message_id_list.push(v.cid)
          layui.layim.getMessage(v);
          console.log(v)
        }; 
        socket.send(JSON.stringify({ message_type: "ack_receive", data: { message_id_list: message_id_list} }));
        return
      case "have_new_message":
        var storage = window.localStorage
        let last_user_message_id = storage.last_user_message_id
        let last_group_message_id = storage.last_group_message_id
        socket.send(JSON.stringify({ 
          message_type: "pull_message", data: { 
          last_user_message_id: last_user_message_id, 
          last_group_message_id: last_group_message_id,
         } }));
      case "logout":
      case "hide":
      case "online":
        heart_im_change_online_status(b.id, b.message_type);
        return;
    }
  };
  socket.onclose = heart_im_connect_server;
}

function heart_im_get_message(a) {
  layui.layim.getMessage(a);
  // if (!a.mine) {
  //   return layui.jquery("#chatAudio")[0].play();
  // }
  return;
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
        url: 'http://localhost:9528/p1/web/chatInit' //接口地址（返回的数据格式见下文）
        , type: 'post'
        , headers: { token: storage.token }
      },
      brief: false,
      members: {
        url: 'http://localhost:9528/p1/web/getGroupMembers' //接口地址（返回的数据格式见下文）
        , type: 'post'
        , headers: { token: storage.token }
      },
      title: "标题",
      copyright: true
    });

    layim.on('ready', function (res) {

      heart_im_connect_server()

      // //监听添加列表的socket事件，假设你服务端emit的事件名为：addList
      // socket.onmessage = function (res) {
      //   if (res.emit === 'addList') {
      //     layim.addList(res.data); //如果是在iframe页，如LayIM设定的add面板，则为 parent.layui.layim.addList(data);
      //   }
      // };
      layim.on('sendMessage', function (b) {
       let message = {
         message_type: 'send_to_user',
          data: {
            username: b.mine.username,
            avatar: b.mine.avatar,
            content: b.mine.content,
          },
        }
        if (b.to.type == 'group'){
          message.message_type = 'send_to_group'
          message.data.group_id = b.to.id
        }
        if (b.to.type == 'friend'){
          message.data.receive_uid = b.to.id

        }
        socket.send(JSON.stringify(message));
      });
      layim.on('online', function (b) {
        socket.send(JSON.stringify({ type: b }));
      });
      layim.on('chatChange', function (b) {

      });
      layui.jquery(".heart-im-chat").on("click", function () {
        var b = layui.jquery(this);
        layim.chat({ name: b.attr("username"), type: "friend", avatar: b.attr("avatar"), id: b.attr("uid") });
      });
    });
  });
}

layui.use(["jquery"], function () {
    heart_im_init();
});


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

          <Shell.Content>{children}</Shell.Content>
          <Shell.Footer>
            <Footer />
          </Shell.Footer>
        </Shell>
      </ConfigProvider>
    );
  }
