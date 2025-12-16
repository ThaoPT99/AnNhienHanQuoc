import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🇰🇷 Du học An Nhiên</h3>
            <p>Đồng hành cùng bạn trên hành trình du học Hàn Quốc</p>
          </div>
          
          <div className="footer-section">
            <h4>Liên hệ</h4>
            <p>📍 219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</p>
            <p>📞 <a href="tel:0961321930">0961321930</a></p>
            <p>📧 <a href="mailto:annhienduhochan@gmail.com">annhienduhochan@gmail.com</a></p>
          </div>
          
          <div className="footer-section">
            <h4>Liên kết nhanh</h4>
            <Link to="/">Trang chủ</Link>
            <Link to="/about">Về chúng tôi</Link>
            <Link to="/services">Dịch vụ</Link>
            <Link to="/gallery">Thư viện ảnh</Link>
            <Link to="/contact">Liên hệ</Link>
          </div>
          
          <div className="footer-section">
            <h4>Theo dõi chúng tôi</h4>
            <div className="social-links">
              <a href="https://www.facebook.com/duhocannhien/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">📘 Facebook</a>
              <a href="#" aria-label="Instagram">📷 Instagram</a>
              <a href="https://www.tiktok.com/@hoanghannhat" target="_blank" rel="noopener noreferrer" aria-label="TikTok">🎵 TikTok</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Du học An Nhiên. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

