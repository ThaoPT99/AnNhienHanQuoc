import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Search from './Search';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainNavItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/about', label: 'Về chúng tôi', icon: '👥' },
    { path: '/services', label: 'Dịch vụ', icon: '🎯' },
    { path: '/blog', label: 'Blog', icon: '📚' },
    { path: '/contact', label: 'Liên hệ', icon: '💬' }
  ];

  const moreNavItems = [
    { path: '/gallery', label: 'Thư viện ảnh', icon: '📸' },
    { path: '/faq', label: 'FAQ', icon: '❓' },
    { path: '/testimonials', label: 'Đánh giá', icon: '⭐' },
    { path: '/calculator', label: 'Tính chi phí', icon: '💰' },
    { path: '/school-comparison', label: 'So sánh trường', icon: '🏫' },
    { path: '/quiz', label: 'Quiz tìm trường', icon: '🎯' },
    { path: '/resources', label: 'Tài liệu miễn phí', icon: '📥' },
    { path: '/events', label: 'Sự kiện', icon: '📅' },
    { path: '/videos', label: 'Video', icon: '🎥' },
    { path: '/recruitment', label: 'Tuyển dụng', icon: '💼' }
  ];

  const allNavItems = [...mainNavItems, ...moreNavItems];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
          <Link to="/" className="navbar-logo" onClick={scrollToTop}>
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

        <div className="navbar-search">
          <Search />
        </div>
        
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {/* Main Navigation Items */}
          {mainNavItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToTop();
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
                <div className="nav-link-bg"></div>
                <div className="nav-link-accent"></div>
              </Link>
            </motion.div>
          ))}

          {/* More Menu Dropdown (Desktop) */}
          <div className="more-menu-wrapper" ref={moreMenuRef}>
            <motion.button
              className={`more-menu-btn ${isMoreMenuOpen ? 'active' : ''} ${moreNavItems.some(item => location.pathname === item.path) ? 'has-active' : ''}`}
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">⋯</span>
              <span className="nav-text">Thêm</span>
              <div className="nav-link-bg"></div>
              <div className="nav-link-accent"></div>
              <motion.svg
                className="dropdown-arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                animate={{ rotate: isMoreMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {isMoreMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="more-menu-dropdown"
                >
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`dropdown-item ${location.pathname === item.path ? 'active' : ''}`}
                      onClick={() => {
                        setIsMoreMenuOpen(false);
                        setIsMobileMenuOpen(false);
                        scrollToTop();
                      }}
                    >
                      <span className="dropdown-icon">{item.icon}</span>
                      <span className="dropdown-text">{item.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: Show all items */}
          {isMobileMenuOpen && (
            <div className="mobile-more-items">
              {moreNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToTop();
                  }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  <div className="nav-link-bg"></div>
                  <div className="nav-link-accent"></div>
                </Link>
              ))}
            </div>
          )}
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

