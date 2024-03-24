import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Register from './Components/Register/Register'
import Login from './Components/Login/Login'
import React, { useEffect, useState } from 'react'
import Home from './Components/Appointments/Appointments'
import Sidebar from './Components/SideBar/sidebar'
import Layout from './layout'


// eslint-disable-next-line react/prop-types
// const LogoutMiddleware = ({ children }) => {
//   const isAuthenticated = !!Cookies.get('jwtToken');

//   if (isAuthenticated) {
//     return children;
//   }

//   return (
//     <Navigate to="/login" />
//   )
// }

// eslint-disable-next-line react/prop-types
// const LoginMiddleware = ({ children }) => {
//   const isAuthenticated = !!Cookies.get('jwtToken');

//   if (!isAuthenticated) {
//     return children;
//   }

//   return (
//     <Navigate to="/" />
//   )
// }

// function SidebarRoutes() {
//   const location = useLocation();
//   const [showSidebar, setShowSidebar] = useState(true);

//   useEffect(() => {
//     // Check if the current route is '/login' or '/register'
//     if (location.pathname === '/login' || location.pathname === '/register') {
//       setShowSidebar(false);
//     } else {
//       setShowSidebar(true);
//     }
//   }, [location]);

//   return (
//     <>
//       {showSidebar && <Sidebar />}
//       <Routes>
//         <Route path='/register' element={<Register />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/home' element={<Home />} />
//         {/* Add more routes and components here */}
//       </Routes>
//     </>
//   );
// }

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;