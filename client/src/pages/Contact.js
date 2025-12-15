import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_URL}/api/contacts`, formData);
      setSubmitStatus({ type: 'success', message: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Hãy để lại thông tin, chúng tôi sẽ tư vấn miễn phí cho bạn</p>
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
            <h2>Thông tin liên hệ</h2>
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h3>Địa chỉ</h3>
                  <p>219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h3>Điện thoại</h3>
                  <p><a href="tel:0961321930">0961321930</a></p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">⏰</div>
                <div>
                  <h3>Giờ làm việc</h3>
                  <p>Thứ 2 - Thứ 6: 8:00 - 18:00<br />Thứ 7: 8:00 - 12:00</p>
                </div>
              </div>
            </div>

            <div className="map-container">
              <img 
                src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=400&fit=crop&q=80" 
                alt="Bản đồ vị trí văn phòng"
                className="map-image"
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
              <h2>Gửi tin nhắn</h2>
              
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Tin nhắn</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Nhập tin nhắn của bạn (tùy chọn)"
                ></textarea>
              </div>

              {submitStatus && (
                <div className={`submit-status ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

