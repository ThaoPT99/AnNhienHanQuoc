import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { showNotification } from '../components/NotificationCenter';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

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
        // Save token and email
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userId', data.user.userId);

        showNotification(
          'Đăng nhập thành công!',
          `Chào mừng ${data.user.email}`,
          'success'
        );

        // Redirect to dashboard or previous page
        const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        navigate(redirectTo);
      } else {
        showNotification(
          'Lỗi',
          data.error || 'Có lỗi xảy ra',
          'error'
        );
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

