import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

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
          // Registration successful - email verification required
          showNotification(
            'Đăng ký thành công!',
            data.message || 'Vui lòng kiểm tra email để xác thực tài khoản.',
            'success'
          );
          setUnverifiedEmail(formData.email);
          setIsLogin(true); // Switch to login form
          setFormData({ email: formData.email, password: '', name: '' }); // Keep email, clear password
        }
      } else {
        console.error('Registration/Login error:', res.status, data);
        
        // Handle unverified email error
        if (res.status === 403 && data.email_verified === false) {
          setUnverifiedEmail(formData.email);
          showNotification(
            'Email chưa được xác thực',
            data.error || 'Vui lòng kiểm tra email và click vào link xác thực.',
            'warning'
          );
        } else {
          showNotification(
            'Lỗi',
            data.error || 'Có lỗi xảy ra',
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
    // Clear unverified email message when user types
    if (unverifiedEmail) {
      setUnverifiedEmail(null);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail })
      });

      const data = await res.json();

      if (res.ok) {
        showNotification('Thành công', data.message || 'Email xác thực đã được gửi lại!', 'success');
      } else {
        showNotification('Lỗi', data.error || 'Không thể gửi email. Vui lòng thử lại.', 'error');
      }
    } catch (error) {
      console.error('Resend error:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
      setLoading(false);
    }
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

          {unverifiedEmail && (
            <div className="unverified-email-alert">
              <p>⚠️ Email <strong>{unverifiedEmail}</strong> chưa được xác thực.</p>
              <p>Vui lòng kiểm tra email và click vào link xác thực.</p>
              <button
                type="button"
                className="btn-resend"
                onClick={handleResendVerification}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi lại email xác thực'}
              </button>
            </div>
          )}

          <div className="login-footer">
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

