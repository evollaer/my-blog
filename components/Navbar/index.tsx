import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import styles from './index.module.scss';
import { navs } from './config';
import Login from 'components/Login/index';

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  console.log(pathname);
  const handleGotoEditorPage = () => {};
  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {};

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <div className={pathname === nav?.value ? styles.active : ''}>
              {nav?.label}
            </div>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onCLose={handleClose} />
    </div>
  );
};

export default Navbar;
