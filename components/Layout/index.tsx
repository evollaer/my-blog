import React from 'react';
import type { NextPage } from 'next';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
