import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

interface NavbarProps {
  theme?: 'default' | 'about' | 'dark';
}

const Navbar: React.FC<NavbarProps> = ({ theme = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clickedLink, setClickedLink] = useState<string | null>(null);
  const location = useLocation();

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

  const navLinks = [
    { name: 'Home', path: '/', className: 'home-link' },
    { name: 'About Us', path: '/about', className: 'about-link' },
    { name: 'Tour Guide', path: '/tourguide', className: 'tour-link' },
    { name: 'Contact', path: '/contact', className: 'contact-link' },
    { name: 'Admin Dashboard', path: '/admin', className: 'admin-link' },
  ];

  const navbarClass = `modern-navbar ${scrolled ? 'scrolled' : ''} ${theme === 'about' ? 'theme-about' : ''} ${theme === 'dark' ? 'theme-dark' : ''}`;

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
                className={`${link.className} ${location.pathname === link.path ? 'active' : ''} ${clickedLink === link.name ? 'clicked' : ''}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {link.name}
                <span className="link-underline"></span>
              </Link>
            </motion.li>
          ))}
          <motion.li
            className="login-link"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link 
              to="/login" 
              className={`login-link ${clickedLink === 'Login' ? 'clicked' : ''}`}
              onClick={() => handleLinkClick('Login')}
            >
              Login
            </Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Link 
              to="/signup" 
              className={`register-btn ${clickedLink === 'Register' ? 'clicked' : ''}`}
              onClick={() => handleLinkClick('Register')}
            >
              Register
            </Link>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
          >
            <Link 
              to="/profile" 
              className={`profile-btn ${clickedLink === 'Profile' ? 'clicked' : ''}`}
              onClick={() => handleLinkClick('Profile')}
            >
              👤 Profile
            </Link>
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
                    className={`${link.className} ${location.pathname === link.path ? 'active' : ''}`}
                    onClick={() => handleLinkClick(link.name)}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  to="/login" 
                  className="login-link"
                  onClick={() => handleLinkClick('Login')}
                >
                  Login
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link 
                  to="/signup" 
                  className="register-btn"
                  onClick={() => handleLinkClick('Register')}
                >
                  Register
                </Link>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Link 
                  to="/profile" 
                  className="profile-btn"
                  onClick={() => handleLinkClick('Profile')}
                >
                  👤 Profile
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

