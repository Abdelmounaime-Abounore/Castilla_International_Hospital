import React from 'react';
import Sidebar from './Components/SideBar/sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const shouldRenderSidebar = location.pathname !== '/register' && location.pathname !== '/login';

  return (
    <div className="app-container">
      {shouldRenderSidebar && <Sidebar />}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
