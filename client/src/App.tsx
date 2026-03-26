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
import Packages from './views/Packages';
import PackageDetails from './views/PackageDetails';
import CustomerPortal from './views/CustomerPortal';
import BookingHistory from './views/BookingHistory';
import DashboardLayout from './views/admin/DashboardLayout';
import DashboardOverview from './views/admin/DashboardOverview';
import PackageManagement from './views/admin/PackageManagement';
import BookingManagement from './views/admin/BookingManagement';

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
      location.pathname.startsWith('/guide/') ||
      location.pathname.startsWith('/packages') ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/portal')
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
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment/:guideId" element={<PaymentIntegration />} />
          
          <Route path="/portal" element={<CustomerPortal />}>
            <Route path="history" element={<BookingHistory />} />
          </Route>

          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="packages" element={<PackageManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
          </Route>
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
