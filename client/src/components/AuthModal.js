import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { showNotification } from './NotificationCenter';
import { isAuthenticated } from '../utils/auth';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', requireAuth = false, onSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setFormData({ email: '', password: '', name: '' });
    }
  }, [isOpen, initialMode]);

  // Check if already logged in
  useEffect(() => {
    if (isOpen && isAuthenticated()) {
      if (requireAuth && onSuccess) {
        onSuccess();
      }
      if (!requireAuth) {
        onClose();
        navigate('/community');
      }
    }
  }, [isOpen, onClose, navigate, requireAuth, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          // Login successful
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userId', data.user.userId);

          showNotification(
            'Đăng nhập thành công!',
            `Chào mừng ${data.user.email}`,
            'success'
          );

          if (requireAuth && onSuccess) {
            onSuccess();
          }
          
          if (!requireAuth) {
            onClose();
            // Reload page to update navbar state
            window.location.reload();
          }
        } else {
          // Registration successful
          showNotification(
            'Đăng ký thành công!',
            'Tài khoản đã được tạo. Bạn có thể đăng nhập ngay.',
            'success'
          );
          setIsLogin(true); // Switch to login form
          setFormData({ email: formData.email, password: '', name: '' }); // Keep email, clear password
        }
      } else {
        console.error('Registration/Login error:', res.status, data);
        
        // Handle email already registered
        if (res.status === 400) {
          showNotification(
            'Email đã được đăng ký',
            data.message || 'Email này đã được đăng ký. Vui lòng đăng nhập thay vì đăng ký mới.',
            'info'
          );
          setIsLogin(true); // Switch to login form
          setFormData({ email: formData.email, password: '', name: '' }); // Keep email, clear password
        } else {
          showNotification(
            'Lỗi',
            data.error || data.message || 'Có lỗi xảy ra',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      showNotification(
        'Lỗi',
        'Không thể kết nối đến server',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="auth-modal-overlay"
        onClick={requireAuth ? undefined : onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          margin: 0,
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="auth-modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            zIndex: 99999,
            margin: 'auto'
          }}
        >
          {!requireAuth && (
            <button
              className="auth-modal-close"
              onClick={onClose}
              aria-label="Đóng"
            >
              ✕
            </button>
          )}

          <div className="auth-modal-header">
            <h2>{isLogin ? '🔐 Đăng nhập' : '✨ Đăng ký'}</h2>
            <p>{isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới để bắt đầu'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-modal-form">
            {!isLogin && (
              <div className="form-group">
                <label>Tên của bạn</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên của bạn"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="auth-modal-footer">
            <p>
              {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', name: '' });
                }}
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;

