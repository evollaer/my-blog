import '/styles/globals.css';
import { StoreProvider } from 'store/index';
import ErrorBoundary from 'components/ErrorBoundary';
import Layout from 'components/Layout/index';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {

    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };

  return (
    <ErrorBoundary>
      <StoreProvider initialValue={initialValue}>
        {renderLayout()}
      </StoreProvider>
    </ErrorBoundary>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  // console.log('+++++++++++++');
  // console.log(ctx?.req?.cookies);
  const { userId, nickname, avatar } = ctx?.req?.cookies || {};

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
