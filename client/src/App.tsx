import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './views/Home';
import About from './views/about';
import Login from './views/login';
import Register from './views/register';
import Contact from './views/contact';
import TourGuide from './views/tourguide';
import GuideDetails from './views/guide-details';
import ResetPassword from './views/reset-password';
import ForgotPassword from './views/forgot-password';
import Profile from './views/profile';
import Navbar from './components/Navbar';
import PaymentIntegration from './views/PaymentIntegration';
import ProtectedRoute from './ProtectedRoute';  

import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

function App() {
  const location = useLocation();
  const [navbarTheme, setNavbarTheme] = useState<'default' | 'about' | 'dark'>('default');

  useEffect(() => {
    if (location.pathname === '/about' || location.pathname === '/' || location.pathname === '/home') {
      setNavbarTheme('about');
    } else if (
      location.pathname === '/contact' ||
      location.pathname === '/login' ||
      location.pathname === '/signup' ||
      location.pathname === '/forgot-password' ||
      location.pathname === '/reset-password' ||
      location.pathname === '/profile' ||
      location.pathname.startsWith('/payment/') ||
      location.pathname.startsWith('/guide/')
    ) {
      setNavbarTheme('dark');
    } else {
      setNavbarTheme('default');
    }
  }, [location]);


  return (
    <>
      <Navbar theme={navbarTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tourguide" element={<TourGuide />} />
        <Route path="/guide/:id" element={<GuideDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment/:guideId" element={<PaymentIntegration />} />
        </Route>
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          error: {
            duration: 5000,
          },
        }}
      />
    </>
  );
}

export default App;
