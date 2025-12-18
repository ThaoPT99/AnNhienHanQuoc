import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Newsletter from './Newsletter';
import './Footer.css';

const Footer = () => {
  const quickLinks = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/about', label: 'Về chúng tôi', icon: '👥' },
    { path: '/services', label: 'Dịch vụ', icon: '🎯' },
    { path: '/blog', label: 'Blog', icon: '📚' },
    { path: '/faq', label: 'FAQ', icon: '❓' },
    { path: '/calculator', label: 'Tính chi phí', icon: '💰' },
    { path: '/contact', label: 'Liên hệ', icon: '💬' }
  ];

  const socialLinks = [
    { url: 'https://www.facebook.com/duhocannhien/', icon: '📘', label: 'Facebook', color: '#1877F2' },
    { url: '#', icon: '📷', label: 'Instagram', color: '#E4405F' },
    { url: 'https://www.tiktok.com/@hoanghannhat', icon: '🎵', label: 'TikTok', color: '#000000' }
  ];

  return (
    <footer className="footer">
      <div className="footer-background">
        <div className="footer-blob footer-blob-1"></div>
        <div className="footer-blob footer-blob-2"></div>
        <div className="footer-blob footer-blob-3"></div>
        <div className="footer-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="footer-particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-content">
          <motion.div
            className="footer-section footer-brand"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="brand-logo-wrapper">
              <div className="brand-icon-wrapper">
                <span className="brand-icon">🇰🇷</span>
                <div className="brand-icon-glow"></div>
              </div>
              <h3 className="brand-title">
                <span className="brand-kr">KR</span>
                <span className="brand-main">Du học An Nhiên</span>
              </h3>
            </div>
            <p className="brand-tagline">
              <span className="tagline-icon">✨</span>
              Đồng hành cùng bạn trên hành trình du học Hàn Quốc
              <span className="tagline-icon">✨</span>
            </p>
          </motion.div>
          
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="section-title">
              <span className="title-icon">💬</span>
              Liên hệ
            </h4>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <a href="tel:0961321930">0961321930</a>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:annhienduhochan@gmail.com">annhienduhochan@gmail.com</a>
            </div>
          </motion.div>
          
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="section-title">
              <span className="title-icon">🔗</span>
              Liên kết nhanh
            </h4>
            <div className="quick-links">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Link to={link.path} className="quick-link">
                    <span className="link-icon">{link.icon}</span>
                    <span className="link-text">{link.label}</span>
                    <div className="link-accent"></div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="section-title">
              <span className="title-icon">🌟</span>
              Theo dõi chúng tôi
            </h4>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target={social.url !== '#' ? "_blank" : undefined}
                  rel={social.url !== '#' ? "noopener noreferrer" : undefined}
                  className="social-link"
                  style={{ '--social-color': social.color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-label">{social.label}</span>
                  <div className="social-glow"></div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section in Footer */}
        <div className="footer-newsletter">
          <Newsletter variant="inline" />
        </div>
        
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="footer-divider"></div>
          <p className="copyright">
            <span className="copyright-icon">©</span>
            2025 Du học An Nhiên. All rights reserved.
            <span className="copyright-heart">💜</span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

