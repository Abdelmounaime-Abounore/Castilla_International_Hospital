import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Register from './Components/Register'
import React from 'react'


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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App