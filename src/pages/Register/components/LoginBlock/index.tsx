/* eslint-disable @iceworks/best-practices/no-secret-info */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Message, Form } from '@alifd/next';

import { useInterval } from './utils';
import styles from './index.module.scss';
import userService from '@/services/user';

const { Item } = Form;

export interface RegisterProps {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
  code: string;
}

export default function RegisterBlock() {
  const [postData, setValue] = useState({
    email: '',
    password: '',
    confirm_password: '',
    username: '',
    code: '',
  });

  const [isRunning, checkRunning] = useState(false);
  const [second, setSecond] = useState(59);

  useInterval(() => {
    setSecond(second - 1);
    if (second <= 0) {
      checkRunning(false);
      setSecond(59);
    }
  }, isRunning ? 1000 : null);

  const formChange = (value: RegisterProps) => {
    setValue(value);
  };

  const sendCode = (values: RegisterProps, errors: []) => {
    if (errors) {
      return;
    }
    var params = { email: values.email}
    userService.sendSmsCode(params).then(function (response) {
      if (response.code == 0){
        Message.success('请求成功');
      }else{
        Message.error('请求失败');
      }
    }).catch(function (e) {
      console.log(e);
      Message.error('请求失败');
    });
    checkRunning(true);
  };

  const checkPass = (rule: any, values: string, callback: (errors?: string) => void) => {
    if (values && values !== postData.password) {
      return callback('密码不一致');
    } else {
      return callback();
    }
  };

  const handleSubmit = (values: RegisterProps, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    var params = { username: values.username, password: values.password, confirm_password: values.confirm_password, email: values.email, code: values.code}
    userService.register(params).then(function (response) {
      if (response.code == 0) {
        Message.success('注册成功');
        location.href = '/login.html#/'　
      } else {
        Message.error('请求失败');
      }
    }).catch(function (e) {
      Message.error('请求失败');
    });
  };

  return (
    <div className={styles.RegisterBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <p className={styles.desc}>注册账号</p>

        <Form value={postData} onChange={formChange} size="large">
          <Item format="username" required requiredMessage="必填">
            <Input name="username" size="large" maxLength={20} placeholder="用户名" />
          </Item>
          <Item required requiredMessage="必填">
            <Input.Password
              name="password"
              size="large"
              htmlType="password"
              placeholder="至少六位密码，区分大小写"
            />
          </Item>
          <Item required requiredTrigger="onFocus" requiredMessage="必填" validator={checkPass}>
            <Input.Password
              name="confirm_password"
              size="large"
              htmlType="password"
              placeholder="确认密码"
            />
          </Item>
          <Item format="email" required requiredMessage="必填">
            <Input name="email" size="large" maxLength={20} placeholder="邮箱" />
          </Item>
          <Item required requiredMessage="必填">
            <Input
              name="code"
              size="large"
              innerAfter={
                <span className={styles.innerAfterInput}>
                  <span className={styles.line} />
                  <Form.Submit
                    text
                    type="primary"
                    style={{ width: 64 }}
                    disabled={!!isRunning}
                    validate={['email']}
                    onClick={sendCode}
                    className={styles.sendCode}
                  >
                    {isRunning ? `${second}秒后再试` : '获取验证码'}
                  </Form.Submit>
                </span>
              }
              maxLength={20}
              placeholder="验证码"
            />
          </Item>
          <Item>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              注册账号
            </Form.Submit>
          </Item>
          <Item style={{ textAlign: 'center' }}>
            <a href="/login.html#/" className={styles.link}>
              使用已有账号登录
            </a>
          </Item>
        </Form>
      </div>
    </div>
  );
}

RegisterBlock.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  value: PropTypes.object,
};

RegisterBlock.defaultProps = {
  value: {},
};
