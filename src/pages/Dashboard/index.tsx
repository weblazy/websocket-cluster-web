import React from 'react';
import { ResponsiveGrid } from '@alifd/next';
import Guide from './components/Guide';

const { Cell } = ResponsiveGrid;

const Dashboard = () => {
  layui.use('layim', function (layim) {
    //先来个客服
    layim.config({
      brief: false //是否简约模式（如果true则不显示主面板）
    }).chat({
      name: '客服'
      , type: 'friend'
      , avatar: 'http://tp1.sinaimg.cn/5619439268/180/40030060651/1'
      , id: -2
    });
  });
  return (
    <ResponsiveGrid gap={20}>
      <Cell colSpan={12}>
        <Guide />
      </Cell>
    </ResponsiveGrid>
  );
};

export default Dashboard;
