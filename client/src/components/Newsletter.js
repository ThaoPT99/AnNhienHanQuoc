import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Newsletter.css';

const Newsletter = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      // TODO: Replace with actual API endpoint
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Đăng ký thành công! Cảm ơn bạn đã quan tâm.' });
        setEmail('');
        setName('');
      } else {
        throw new Error('Đăng ký thất bại');
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'inline') {
    return (
      <div className="newsletter-inline">
        <form onSubmit={handleSubmit} className="newsletter-form-inline">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="newsletter-input-inline"
          />
          <button type="submit" disabled={isSubmitting} className="newsletter-btn-inline">
            {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
          </button>
        </form>
        {submitStatus && (
          <div className={`newsletter-status ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.section
      className="newsletter-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-icon">📧</div>
          <h2 className="newsletter-title">Đăng ký nhận tin</h2>
          <p className="newsletter-description">
            Nhận thông tin mới nhất về du học Hàn Quốc, học bổng, sự kiện và nhiều nội dung hữu ích khác
          </p>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Họ và tên (tùy chọn)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="newsletter-input"
              />
              <input
                type="email"
                placeholder="Email của bạn *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="newsletter-submit-btn">
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Đang gửi...
                </>
              ) : (
                <>
                  <span>✉️</span>
                  Đăng ký ngay
                </>
              )}
            </button>
          </form>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`newsletter-status ${submitStatus.type}`}
            >
              {submitStatus.message}
            </motion.div>
          )}
          <p className="newsletter-privacy">
            🔒 Chúng tôi cam kết bảo vệ thông tin của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Newsletter;


