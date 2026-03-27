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
import AdminRoute from './AdminRoute';
import './css/frontend-theme.css';

import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

type SiteTheme = 'light' | 'dark';
type ThemePalette = {
  primaryDark: string;
  primaryBlue: string;
  tealDark: string;
  tealLight: string;
  tealAccent: string;
  accent: string;
  accentGlow: string;
  accentDark: string;
  accentHover: string;
  glassBg: string;
  glassBgHover: string;
  glassBorder: string;
  glassShadow: string;
  glassBlur: string;
  textLight: string;
  textMuted: string;
  textWhite: string;
};

const SITE_THEME_KEY = 'travelworld_site_theme';

const lightPalette: ThemePalette = {
  primaryDark: '#1f3550',
  primaryBlue: '#edf6ff',
  tealDark: '#e6f7f2',
  tealLight: '#fff8ef',
  tealAccent: '#139c8f',
  accent: '#ff9a3d',
  accentGlow: '#ffc37d',
  accentDark: '#e9771a',
  accentHover: '#f5891f',
  glassBg: 'rgba(255, 255, 255, 0.74)',
  glassBgHover: 'rgba(255, 255, 255, 0.9)',
  glassBorder: 'rgba(119, 138, 160, 0.22)',
  glassShadow: 'rgba(31, 53, 80, 0.12)',
  glassBlur: '20px',
  textLight: '#284560',
  textMuted: '#6d8194',
  textWhite: '#1f3550',
};

const darkPalette: ThemePalette = {
  primaryDark: '#030812',
  primaryBlue: '#091423',
  tealDark: '#0b2230',
  tealLight: '#0e3642',
  tealAccent: '#52d3ff',
  accent: '#ffb347',
  accentGlow: '#ffd27a',
  accentDark: '#f28c18',
  accentHover: '#ff9f1c',
  glassBg: 'rgba(7, 18, 33, 0.72)',
  glassBgHover: 'rgba(9, 24, 44, 0.88)',
  glassBorder: 'rgba(148, 163, 184, 0.18)',
  glassShadow: 'rgba(0, 0, 0, 0.45)',
  glassBlur: '22px',
  textLight: '#edf4ff',
  textMuted: '#a7b9d2',
  textWhite: '#ffffff',
};

const buildThemeVariables = (palette: ThemePalette): Record<string, string> => ({
  '--primary-dark': palette.primaryDark,
  '--primary-blue': palette.primaryBlue,
  '--teal-dark': palette.tealDark,
  '--teal-light': palette.tealLight,
  '--teal-accent': palette.tealAccent,
  '--accent': palette.accent,
  '--accent-glow': palette.accentGlow,
  '--accent-dark': palette.accentDark,
  '--accent-hover': palette.accentHover,
  '--glass-bg': palette.glassBg,
  '--glass-bg-hover': palette.glassBgHover,
  '--glass-border': palette.glassBorder,
  '--glass-shadow': palette.glassShadow,
  '--glass-blur': palette.glassBlur,
  '--text-light': palette.textLight,
  '--text-muted': palette.textMuted,
  '--text-white': palette.textWhite,
  '--login-primary-dark': palette.primaryDark,
  '--login-primary-blue': palette.primaryBlue,
  '--login-teal-dark': palette.tealDark,
  '--login-teal-light': palette.tealLight,
  '--login-teal-accent': palette.tealAccent,
  '--login-accent': palette.accent,
  '--login-accent-glow': palette.accentGlow,
  '--login-accent-dark': palette.accentDark,
  '--login-glass-bg': palette.glassBg,
  '--login-glass-bg-hover': palette.glassBgHover,
  '--login-glass-border': palette.glassBorder,
  '--login-glass-shadow': palette.glassShadow,
  '--login-glass-blur': palette.glassBlur,
  '--login-text-light': palette.textLight,
  '--login-text-muted': palette.textMuted,
  '--login-text-white': palette.textWhite,
  '--register-primary-dark': palette.primaryDark,
  '--register-primary-blue': palette.primaryBlue,
  '--register-teal-dark': palette.tealDark,
  '--register-teal-light': palette.tealLight,
  '--register-teal-accent': palette.tealAccent,
  '--register-accent': palette.accent,
  '--register-accent-glow': palette.accentGlow,
  '--register-accent-dark': palette.accentDark,
  '--register-glass-bg': palette.glassBg,
  '--register-glass-bg-hover': palette.glassBgHover,
  '--register-glass-border': palette.glassBorder,
  '--register-glass-shadow': palette.glassShadow,
  '--register-glass-blur': palette.glassBlur,
  '--register-text-light': palette.textLight,
  '--register-text-muted': palette.textMuted,
  '--register-text-white': palette.textWhite,
  '--forgot-primary-dark': palette.primaryDark,
  '--forgot-primary-blue': palette.primaryBlue,
  '--forgot-teal-dark': palette.tealDark,
  '--forgot-teal-light': palette.tealLight,
  '--forgot-teal-accent': palette.tealAccent,
  '--forgot-accent': palette.accent,
  '--forgot-accent-glow': palette.accentGlow,
  '--forgot-accent-dark': palette.accentDark,
  '--forgot-glass-bg': palette.glassBg,
  '--forgot-glass-bg-hover': palette.glassBgHover,
  '--forgot-glass-border': palette.glassBorder,
  '--forgot-glass-shadow': palette.glassShadow,
  '--forgot-glass-blur': palette.glassBlur,
  '--forgot-text-light': palette.textLight,
  '--forgot-text-muted': palette.textMuted,
  '--forgot-text-white': palette.textWhite,
});

const getInitialSiteTheme = (): SiteTheme => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(SITE_THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const location = useLocation();
  const [navbarTheme, setNavbarTheme] = useState<'default' | 'about' | 'dark'>('default');
  const [siteTheme, setSiteTheme] = useState<SiteTheme>(getInitialSiteTheme);
  const isAdminRoute = location.pathname.startsWith('/admin');

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(SITE_THEME_KEY, siteTheme);
  }, [siteTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    const palette = siteTheme === 'dark' ? darkPalette : lightPalette;
    const themeVariables = buildThemeVariables(palette);

    root.dataset.siteTheme = siteTheme;
    body.dataset.siteTheme = siteTheme;
    root.style.colorScheme = siteTheme;

    Object.entries(themeVariables).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });
  }, [siteTheme]);

  const toggleSiteTheme = () => {
    setSiteTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const appRoutes = (
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
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="packages" element={<PackageManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
        </Route>
      </Route>
    </Routes>
  );


  return (
    <>
      {!isAdminRoute && (
        <Navbar
          theme={navbarTheme}
          siteTheme={siteTheme}
          onToggleTheme={toggleSiteTheme}
        />
      )}

      {isAdminRoute ? (
        appRoutes
      ) : (
        <div className="frontend-app" data-site-theme={siteTheme}>
          {appRoutes}
        </div>
      )}

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
