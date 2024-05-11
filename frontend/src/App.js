import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Changed Router to Routes
import LoginPage from './components/Login';
import Home from './pages/Home';

const WebcamCapture = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes> {/* Changed Router to Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes> {/* Changed Router to Routes */}
      </BrowserRouter>
    </>
  );
}

export default WebcamCapture;
