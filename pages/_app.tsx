import '/styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider } from 'store/index';
import Layout from 'components/Layout/index';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  console.log('+++++++++++++');
  console.log(ctx?.req.cookies);
  const { userId, nickname, avatar } = ctx?.req.cookies || {};
  console.log(userId, nickname, avatar);

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};

export default MyApp;
