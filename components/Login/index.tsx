import styles from './index.module.scss';
import { useState } from 'react';
interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  console.log(props);

  const { isShow = false } = props;

  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const handleClose = () => {};

  const handleGetVerifyCode = () => {};

  const handleLogin = () => {};

  const handleOAuthLogin = () => {};

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input type="text" name="phone" placeholder="请输入手机号" value={form.phone} />
        <div className={styles.verifyCodeArea}>
          <input type="text" name="phone" placeholder="请输入验证码" value={form.verify} />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            获取验证码
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.othersLogin} onClick={handleOAuthLogin}>
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

export default Login;
