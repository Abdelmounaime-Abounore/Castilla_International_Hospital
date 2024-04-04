import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import React from 'react';
import DoctorsList from './Components/DoctorsList/DoctorsList';
import Layout from './layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><DoctorsList /></Layout>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
