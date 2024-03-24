import { Routes, Route, useLocation } from 'react-router-dom';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import React, { useEffect, useState } from 'react';
import Sidebar from './Components/SideBar/sidebar';
import Appointments from './Components/Appointments/Appointments';

function Layout() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [location]);

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <div className="flex flex-1 justify-center items-center">
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/appointments' element={<Appointments />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;