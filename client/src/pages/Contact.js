import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import { addPoints, POINTS_REWARDS, showPointsNotification } from '../utils/pointsSystem';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Use env if set; fallback to deployed backend to avoid localhost in production
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_URL}/api/contacts`, formData);
      setSubmitStatus({ type: 'success', message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Add points for contacting/consultation (only once)
      const consultationRegistered = localStorage.getItem('consultationRegistered');
      if (!consultationRegistered) {
        const result = addPoints(POINTS_REWARDS.CONSULTATION_REGISTER, 'consultation_register');
        showPointsNotification(POINTS_REWARDS.CONSULTATION_REGISTER, result.badgeAwarded);
        localStorage.setItem('consultationRegistered', 'true');
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Liên hệ - Du học An Nhiên",
    "description": "Liên hệ với Du học An Nhiên để được tư vấn du học Hàn Quốc miễn phí",
    "url": "https://duhocannhien.vercel.app/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Du học An Nhiên",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "219 P. Trung Kính, Trung Hòa",
        "addressLocality": "Cầu Giấy",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84-961-321-930",
        "contactType": "customer service",
        "email": "annhienduhochan@gmail.com",
        "areaServed": "VN",
        "availableLanguage": "Vietnamese"
      }
    }
  };

  return (
    <div className="contact-page">
      <SEO
        title="Liên hệ - Du học An Nhiên"
        description="Liên hệ với Du học An Nhiên để được tư vấn du học Hàn Quốc miễn phí. Địa chỉ: 219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội. Hotline: 0961321930"
        keywords="liên hệ du học Hàn Quốc, tư vấn du học miễn phí, địa chỉ du học An Nhiên, hotline du học Hàn Quốc"
        url="https://duhocannhien.vercel.app/contact"
        structuredData={structuredData}
      />
      <div className="page-header">
        <div className="header-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-emoji">💬</div>
          <h1 className="header-title">
            <span className="gradient-text-header">Liên hệ</span> với chúng tôi
          </h1>
          <p className="header-subtitle">
            <span className="subtitle-icon">🚀</span>
            Hãy để lại thông tin, chúng tôi sẽ tư vấn miễn phí cho bạn
            <span className="subtitle-icon">🚀</span>
          </p>
        </motion.div>
      </div>

      <section className="contact-section section">
        <div className="contact-container">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-icon">📋</span>
              Thông tin liên hệ
            </motion.h2>
            <div className="info-items">
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="info-icon-wrapper">
                  <div className="info-icon">📍</div>
                  <div className="info-icon-glow"></div>
                </div>
                <div>
                  <h3>Địa chỉ</h3>
                  <p>219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</p>
                </div>
              </motion.div>
              
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="info-icon-wrapper">
                  <div className="info-icon">📞</div>
                  <div className="info-icon-glow"></div>
                </div>
                <div>
                  <h3>Điện thoại</h3>
                  <p><a href="tel:0961321930">0961321930</a></p>
                </div>
              </motion.div>
              
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="info-icon-wrapper">
                  <div className="info-icon">📧</div>
                  <div className="info-icon-glow"></div>
                </div>
                <div>
                  <h3>Email</h3>
                  <p><a href="mailto:annhienduhochan@gmail.com">annhienduhochan@gmail.com</a></p>
                </div>
              </motion.div>
              
              <motion.div
                className="info-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="info-icon-wrapper">
                  <div className="info-icon">⏰</div>
                  <div className="info-icon-glow"></div>
                </div>
                <div>
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 6: 8:00 - 18:00<br />Thứ 7: 8:00 - 12:00</p>
                </div>
              </motion.div>
            </div>

            <div className="map-container">
              <OptimizedImage 
                src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=400&fit=crop&q=80" 
                alt="Bản đồ vị trí văn phòng Du học An Nhiên - 219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội"
                className="map-image"
                loading="lazy"
                width="800"
                height="400"
              />
              <div className="map-overlay">
                <p>📍 219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="form-icon">✉️</span>
                Gửi tin nhắn
              </motion.h2>
              
              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label htmlFor="name">
                  <span className="label-icon">👤</span>
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email của bạn"
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="phone">
                  <span className="label-icon">📞</span>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại của bạn"
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label htmlFor="message">
                  <span className="label-icon">💬</span>
                  Tin nhắn
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Nhập tin nhắn của bạn (tùy chọn)"
                ></textarea>
              </motion.div>

              {submitStatus && (
                <motion.div
                  className={`submit-status ${submitStatus.type}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="status-icon">
                    {submitStatus.type === 'success' ? '✅' : '❌'}
                  </span>
                  {submitStatus.message}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="contact-submit-button"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="button-text">
                  {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </span>
                <span className="button-icon">
                  {isSubmitting ? '⏳' : '🚀'}
                </span>
                <div className="button-shine"></div>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

