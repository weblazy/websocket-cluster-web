import * as React from 'react';
import { Button } from '@alifd/next';
import { request } from 'ice';
import qs from 'query-string';
import styles from './index.module.scss';


const Guide = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to icejs!</h2>

      <p className={styles.description}>This is a awesome project, enjoy it!</p>

      <div className={styles.action}>
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
      </div>
    </div>
  );
};

export default Guide;

async function getList() {
  try {
    const data = await request({
      url: 'http://localhost:9528/p1/web'
    });
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getList();
var listenPayResult = ({ success, fail }: any): WebSocket => {
  const params = qs.stringify({});
  const wsUrl = 'ws://127.0.0.1:9528/p1/client?' + params;
  let ws = new WebSocket(wsUrl);
  setInterval(() => {
    const pr = {
      mType: 'keepAlive',
      mRes: 'success',
      msg: '连接正常',
      mData: {},
    }
    ws.send(JSON.stringify(pr))
  }, 18000);

  ws.onclose = function (e) {
    console.log(e);
    ws = new WebSocket(wsUrl);
  }
  ws.onerror = function (e) {
    console.log(e);
  }

  ws.onopen = function (e) {
    console.log(e);
  }
  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
    if (json.mRes === 'success' && json.mType === 'payStatus') {
      if (json.mData.payStatus === 1) {
        success();
      } else if (json.mData.payStatus === 2) {
        fail();
      }
    }
  }
  return ws
}
listenPayResult({ success: () => { console.log('sucess1') }, fail: () => { console.log('fail1') } });