import styles from './index.module.scss';
import { ChangeEvent, useState } from 'react';
import request from 'service/fetch';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store/index';
import CountDown from '../CountDown/index';
import { message } from 'antd';
interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();

  console.log(store, 'store');

  const { isShow, onClose } = props;

  const [idShowVerifyCode, setIsShowVerifyCode] = useState(false);

  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const handleClose = () => {
    onClose();
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleGetVerifyCode = () => {
    if (!form?.phone) {
      message.warning('请输入手机号!');
      return;
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res?.code == 0) {
          console.log(res);
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  const handleLogin = () => {
    console.log(form);
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          //登录成功
          store.user.setUserInfo(res?.data);
          onClose && onClose();
          message.success('登录成功！');
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  const handleOAuthLoginByGithub = () => {
    //client ID：7187451ed8ddaa3cf0ec
    //client-secret：5bf791f4bad2636c25275c8cba6f664197be15df
  };

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input type="text" name="phone" placeholder="请输入手机号" value={form.phone} onChange={handleFormChange} />
        <div className={styles.verifyCodeArea}>
          <input type="text" name="verify" placeholder="请输入验证码" value={form.verify} onChange={handleFormChange} />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {idShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd} /> : '获取验证码'}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.othersLogin} onClick={handleOAuthLoginByGithub}>
          使用 Github 登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a href="https://moco.imooc.com/privacy.html" target="_blank">
            《隐私政策》
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
