import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateVietnamesePhone, validateEmail } from '../utils/validation';
import { apiPost, getEndpointUrl } from '../utils/api';
import './Newsletter.css';

const Newsletter = ({ variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setSubmitStatus({ type: 'error', message: emailValidation.error });
      setIsSubmitting(false);
      return;
    }

    // Validate phone number
    const phoneValidation = validateVietnamesePhone(phone);
    if (!phoneValidation.isValid) {
      setSubmitStatus({ type: 'error', message: phoneValidation.error });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await apiPost(
        getEndpointUrl('NEWSLETTER.SUBSCRIBE'),
        { email, name, phone: phoneValidation.cleanPhone }
      );

      if (result.success) {
        setSubmitStatus({ type: 'success', message: 'Đăng ký thành công! Cảm ơn bạn đã quan tâm.' });
        setEmail('');
        setName('');
        setPhone('');
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.error?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' 
        });
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
          <form onSubmit={handleSubmit} className="newsletter-form-inline" aria-label="Form đăng ký nhận tin">
            <label htmlFor="newsletter-email-inline" className="sr-only">
              Email đăng ký nhận tin
            </label>
            <input
              id="newsletter-email-inline"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="newsletter-input-inline"
              aria-label="Email đăng ký nhận tin"
              aria-describedby={submitStatus ? 'newsletter-status-inline' : undefined}
            />
            <label htmlFor="newsletter-phone-inline" className="sr-only">
              Số điện thoại đăng ký nhận tin
            </label>
            <input
              id="newsletter-phone-inline"
              type="tel"
              placeholder="Số điện thoại *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              pattern="(\+84|0)[0-9]{9,10}"
              className="newsletter-input-inline"
              aria-label="Số điện thoại đăng ký nhận tin (bắt buộc)"
              aria-describedby={submitStatus ? 'newsletter-status-inline' : undefined}
            />
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="newsletter-btn-inline"
              aria-label={isSubmitting ? 'Đang gửi đăng ký' : 'Đăng ký nhận tin'}
            >
              {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
            </button>
          </form>
          {submitStatus && (
            <div 
              id="newsletter-status-inline"
              className={`newsletter-status ${submitStatus.type}`}
              role={submitStatus.type === 'error' ? 'alert' : 'status'}
              aria-live={submitStatus.type === 'error' ? 'assertive' : 'polite'}
            >
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
          <div className="newsletter-icon" aria-hidden="true">📧</div>
          <h2 className="newsletter-title">Đăng ký nhận tin</h2>
          <p className="newsletter-description">
            Nhận thông tin mới nhất về du học Hàn Quốc, học bổng, sự kiện và nhiều nội dung hữu ích khác
          </p>
          <form onSubmit={handleSubmit} className="newsletter-form" aria-label="Form đăng ký nhận tin">
            <div className="form-row">
              <label htmlFor="newsletter-name" className="sr-only">
                Họ và tên (tùy chọn)
              </label>
              <input
                id="newsletter-name"
                type="text"
                placeholder="Họ và tên (tùy chọn)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="newsletter-input"
                aria-label="Họ và tên (tùy chọn)"
              />
              <label htmlFor="newsletter-email" className="sr-only">
                Email của bạn (bắt buộc)
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email của bạn *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
                aria-label="Email của bạn (bắt buộc)"
                aria-describedby={submitStatus ? 'newsletter-status' : undefined}
              />
              <label htmlFor="newsletter-phone" className="sr-only">
                Số điện thoại của bạn (bắt buộc)
              </label>
              <input
                id="newsletter-phone"
                type="tel"
                placeholder="Số điện thoại *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="(\+84|0)[0-9]{9,10}"
                className="newsletter-input"
                aria-label="Số điện thoại của bạn (bắt buộc)"
                aria-describedby={submitStatus ? 'newsletter-status' : undefined}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="newsletter-submit-btn"
              aria-label={isSubmitting ? 'Đang gửi đăng ký' : 'Đăng ký nhận tin ngay'}
              aria-describedby={submitStatus ? 'newsletter-status' : undefined}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Đang gửi...
                </>
              ) : (
                <>
                  <span aria-hidden="true">✉️</span>
                  Đăng ký ngay
                </>
              )}
            </button>
          </form>
          {submitStatus && (
            <motion.div
              id="newsletter-status"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`newsletter-status ${submitStatus.type}`}
              role={submitStatus.type === 'error' ? 'alert' : 'status'}
              aria-live={submitStatus.type === 'error' ? 'assertive' : 'polite'}
              aria-atomic="true"
            >
              {submitStatus.message}
            </motion.div>
          )}
          <p className="newsletter-privacy">
            <span aria-hidden="true">🔒</span> Chúng tôi cam kết bảo vệ thông tin của bạn. Bạn có thể hủy đăng ký bất cứ lúc nào.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Newsletter;


