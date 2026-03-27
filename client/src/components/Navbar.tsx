import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import ApiClient from '../api';

interface NavbarProps {
  theme?: 'default' | 'about' | 'dark';
  siteTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme = 'default', siteTheme, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const location = useLocation();
  const currentUser = ApiClient.getUser();
  const isAuthenticated = ApiClient.isAuthenticated();
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Reset clicked state after animation
  useEffect(() => {
    if (clickedLink) {
      const timer = setTimeout(() => {
        setClickedLink(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [clickedLink]);

  const handleLinkClick = (linkName: string) => {
    setClickedLink(linkName);
  };

  const isLinkActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname.startsWith('/admin');
    }

    if (path === '/profile') {
      return location.pathname === '/profile' || location.pathname.startsWith('/portal');
    }

    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Home', path: '/', className: 'home-link' },
    { name: 'About Us', path: '/about', className: 'about-link' },
    { name: 'Tour Guide', path: '/tourguide', className: 'tour-link' },
    { name: 'Contact', path: '/contact', className: 'contact-link' },
  ];
  const authLinks = isAuthenticated
    ? [
        ...(isAdmin
          ? [{ name: 'Admin', label: 'Admin Dashboard', path: '/admin', className: 'admin-btn' }]
          : []),
        { name: 'Profile', label: 'Profile', path: '/profile', className: 'profile-btn' },
      ]
    : [
        { name: 'Login', label: 'Login', path: '/login', className: 'login-link' },
        { name: 'Register', label: 'Register', path: '/signup', className: 'register-btn' },
      ];

  const navbarClass = `modern-navbar ${scrolled ? 'scrolled' : ''} ${theme === 'about' ? 'theme-about' : ''} ${theme === 'dark' ? 'theme-dark' : ''} ${siteTheme === 'dark' ? 'site-theme-dark' : 'site-theme-light'}`;

  return (
    <motion.nav
      className={navbarClass}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        {/* Logo */}
        <motion.div
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link to="/">
            <span className="logo-icon">🌍</span>
            <span className="logo-text">
              <span className="logo-travel">Travel</span>
              <span className="logo-world">World</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <ul className="navbar-links">
          {navLinks.map((link, index) => (
            <motion.li
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
            >
              <Link
                to={link.path}
                className={`${link.className} ${isLinkActive(link.path) ? 'active' : ''} ${clickedLink === link.name ? 'clicked' : ''}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {link.name}
                <span className="link-underline"></span>
              </Link>
            </motion.li>
          ))}
          {authLinks.map((link, index) => (
            <motion.li
              key={link.name}
              className={link.className === 'login-link' ? 'login-link' : undefined}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <Link
                to={link.path}
                className={`${link.className} ${isLinkActive(link.path) ? 'active' : ''} ${clickedLink === link.name ? 'clicked' : ''}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {link.className === 'profile-btn' ? '👤 ' : ''}
                {link.label}
                {link.className === 'login-link' && <span className="link-underline"></span>}
              </Link>
            </motion.li>
          ))}
          <motion.li
            className="theme-toggle-item"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.75 }}
          >
            <button
              type="button"
              className={`theme-toggle-btn ${siteTheme === 'dark' ? 'is-dark' : 'is-light'}`}
              onClick={onToggleTheme}
              aria-pressed={siteTheme === 'dark'}
              aria-label={`Switch to ${siteTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {siteTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </motion.li>
        </ul>

        {/* Mobile Hamburger */}
        <motion.button
          className={`hamburger ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          whileTap={{ scale: 0.95 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="mobile-links">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`${link.className} ${isLinkActive(link.path) ? 'active' : ''}`}
                    onClick={() => handleLinkClick(link.name)}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              {authLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={link.className}
                    onClick={() => handleLinkClick(link.name)}
                  >
                    {link.className === 'profile-btn' ? '👤 ' : ''}
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
              >
                <button
                  type="button"
                  className={`theme-toggle-btn mobile ${siteTheme === 'dark' ? 'is-dark' : 'is-light'}`}
                  onClick={onToggleTheme}
                  aria-pressed={siteTheme === 'dark'}
                  aria-label={`Switch to ${siteTheme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {siteTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

