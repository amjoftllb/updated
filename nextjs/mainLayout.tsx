import React from 'react';
import Navbar from '../components/Navbar';

const MainLayout: React.FC = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
