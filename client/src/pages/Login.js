import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { showNotification } from '../components/NotificationCenter';
import { isAuthenticated } from '../utils/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      const redirectTo = searchParams.get('redirect') || '/community';
      navigate(redirectTo);
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone for registration
    if (!isLogin) {
      if (!formData.phone || formData.phone.trim() === '') {
        showNotification(
          'Lỗi',
          'Vui lòng nhập số điện thoại',
          'error'
        );
        return;
      }
      
      // Validate phone format
      const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
      const cleanPhone = formData.phone.replace(/\s+/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        showNotification(
          'Lỗi',
          'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678 hoặc +84912345678)',
          'error'
        );
        return;
      }
    }
    
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

          // Redirect to previous page or community
          const redirectTo = searchParams.get('redirect') || '/community';
          navigate(redirectTo);
        } else {
          // Registration successful
          showNotification(
            'Đăng ký thành công!',
            'Tài khoản đã được tạo. Bạn có thể đăng nhập ngay.',
            'success'
          );
          setIsLogin(true); // Switch to login form
          setFormData({ email: formData.email, password: '', name: '', phone: '' }); // Keep email, clear password
        }
      } else {
        console.error('Registration/Login error:', res.status, data);
        
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

  return (
    <div className="login-page">
      <SEO
        title={isLogin ? 'Đăng nhập - Du học An Nhiên' : 'Đăng ký - Du học An Nhiên'}
        description={isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản mới'}
      />

      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-card"
        >
          <div className="login-header">
            <h1>{isLogin ? '🔐 Đăng nhập' : '✨ Đăng ký'}</h1>
            <p>{isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới để bắt đầu'}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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

          <div className="login-footer">
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

          <div className="login-info">
            <p>🔒 Tài khoản của bạn được bảo vệ bằng mật khẩu</p>
            <p>✅ Không ai có thể giả mạo danh tính của bạn</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

