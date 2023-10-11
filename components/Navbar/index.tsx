import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { useStore } from 'store/index';
import styles from './index.module.scss';
import { navs } from './config';
import Login from 'components/Login/index';
import request from 'service/fetch';

const Navbar: NextPage = () => {
  const store = useStore();
  console.log(store.user.userInfo, '55');

  const { userId, avatar } = store.user.userInfo;
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  console.log(pathname);
  const handleGotoEditorPage = () => {};
  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleGotoPersonalPage = () => {};

  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
        console.log(111);
        console.log(store.user.userInfo, '55');
      }
    });
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined />
          &nbsp;个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp;退出系统
        </Menu.Item>
      </Menu>
    );
  };
  // const items = [
  //   { label: '个人主页', key: 'item-1' }, // 菜单项务必填写 key
  //   { label: '退出系统', key: 'item-2' },
  // ];

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <div className={pathname === nav?.value ? styles.active : ''}>{nav?.label}</div>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar}></Avatar>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
