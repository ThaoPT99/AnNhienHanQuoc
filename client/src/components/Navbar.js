import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/about', label: 'Về chúng tôi', icon: '👥' },
    { path: '/services', label: 'Dịch vụ', icon: '🎯' },
    { path: '/gallery', label: 'Thư viện ảnh', icon: '📸' },
    { path: '/blog', label: 'Blog', icon: '📚' },
    { path: '/contact', label: 'Liên hệ', icon: '💬' }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-background">
        <div className="navbar-gradient"></div>
        <div className="navbar-particles">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="nav-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
      </div>
      <div className="navbar-container">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="navbar-logo">
            <div className="logo-icon-wrapper">
              <span className="logo-icon">🇰🇷</span>
              <div className="logo-icon-glow"></div>
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-kr">KR</span>
              <span className="logo-main">Du học An Nhiên</span>
            </div>
            <div className="logo-shine"></div>
          </Link>
        </motion.div>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                <div className="nav-link-bg"></div>
                <div className="nav-link-accent"></div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;

