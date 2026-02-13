import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { showNotification } from './NotificationCenter';
import { isAuthenticated } from '../utils/auth';
import { validateVietnamesePhone, validateEmail, validatePassword } from '../utils/validation';
import { apiPost, getEndpointUrl } from '../utils/api';
import { API_ENDPOINTS, TIMEOUTS } from '../utils/constants';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login', requireAuth = false, onSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (isOpen) {
      setIsLogin(initialMode === 'login');
      setFormData({ email: '', password: '', name: '', phone: '' });
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
    
    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      showNotification('Lỗi', emailValidation.error, 'error');
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      showNotification('Lỗi', passwordValidation.error, 'error');
      return;
    }
    
    // Validate phone for registration
    if (!isLogin) {
      const phoneValidation = validateVietnamesePhone(formData.phone);
      if (!phoneValidation.isValid) {
        showNotification('Lỗi', phoneValidation.error, 'error');
        return;
      }
      // Use cleaned phone number
      formData.phone = phoneValidation.cleanPhone;
    }
    
    setLoading(true);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ [DEBUG] AuthModal: Request timeout after', TIMEOUTS.AUTH / 1000, 'seconds');
      controller.abort();
    }, TIMEOUTS.AUTH);

    try {
      const endpoint = isLogin ? getEndpointUrl('AUTH.LOGIN') : getEndpointUrl('AUTH.REGISTER');
      console.log('🔐 [DEBUG] AuthModal: Submitting form:', { endpoint, isLogin, formData: { ...formData, password: '***' } });
      
      const result = await apiPost(
        endpoint,
        formData,
        false // No auth required for login/register
      );

      // Handle timeout
      if (result.error?.type === 'network' && result.error?.originalError?.name === 'AbortError') {
        clearTimeout(timeoutId);
        showNotification(
          'Lỗi',
          'Request timeout. Server có thể đang xử lý, vui lòng đợi một chút và kiểm tra lại tài khoản đã được tạo chưa.',
          'warning'
        );
        setLoading(false);
        return;
      }

      clearTimeout(timeoutId);
      
      // Use result.data instead of parsing response
      const data = result.data || {};
      const res = result.response;

      console.log('📨 [DEBUG] AuthModal: Response status:', res?.status, res?.statusText);
      console.log('📨 [DEBUG] AuthModal: Response data:', data);

      if (result.success && (res?.ok || res?.status === 201)) { // Accept both 200 and 201
        console.log('✅ [DEBUG] AuthModal: Request successful');
        setLoading(false); // Set loading false immediately after success
        
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
            // Stay on current page, just reload to update navbar state
            // This keeps user on the same page they were viewing
            window.location.reload();
          }
        } else {
          // Registration successful
          console.log('✅ [DEBUG] AuthModal: Registration successful, switching to login form');
          showNotification(
            'Đăng ký thành công!',
            data.message || 'Tài khoản đã được tạo. Bạn có thể đăng nhập ngay.',
            'success'
          );
          setIsLogin(true); // Switch to login form
          setFormData({ email: formData.email, password: '', name: '', phone: '' }); // Keep email, clear password
        }
      } else {
        console.error('❌ [DEBUG] AuthModal: Request failed:', res.status, data);
        setLoading(false); // Set loading false on error
        
        // Handle different error cases
        if (res.status === 400) {
          // Email already registered or validation error
          if (!isLogin) {
            showNotification(
              'Email đã được đăng ký',
              data.message || 'Email này đã được đăng ký. Vui lòng đăng nhập thay vì đăng ký mới.',
              'info'
            );
            setIsLogin(true); // Switch to login form
            setFormData({ email: formData.email, password: '', name: '', phone: '' }); // Keep email, clear password
          } else {
            showNotification(
              'Lỗi',
              data.error || data.message || 'Thông tin đăng nhập không hợp lệ',
              'error'
            );
          }
        } else if (res.status === 401) {
          // Invalid email or password
          showNotification(
            'Đăng nhập thất bại',
            data.error || 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.',
            'error'
          );
          // Clear password field
          setFormData({ ...formData, password: '' });
        } else if (res.status === 403) {
          // Email not verified
          showNotification(
            'Email chưa được xác thực',
            data.error || data.message || 'Vui lòng kiểm tra email và xác thực tài khoản trước khi đăng nhập.',
            'warning'
          );
        } else {
          // Other errors
          showNotification(
            'Lỗi',
            data.error || data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.',
            'error'
          );
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('❌ [DEBUG] AuthModal: Exception:', error);
      setLoading(false);
      
      showNotification(
        'Lỗi',
        error.message || 'Không thể kết nối đến server. Vui lòng thử lại.',
        'error'
      );
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

            {!isLogin && (
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678 hoặc +84912345678"
                  required={!isLogin}
                  pattern="(\+84|0)[0-9]{9,10}"
                  title="Vui lòng nhập số điện thoại hợp lệ (VD: 0912345678 hoặc +84912345678)"
                />
              </div>
            )}

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
                  setFormData({ email: '', password: '', name: '', phone: '' });
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

