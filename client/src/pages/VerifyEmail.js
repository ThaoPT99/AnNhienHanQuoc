import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { showNotification } from '../components/NotificationCenter';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Thiếu thông tin xác thực. Vui lòng kiểm tra lại link trong email.');
    }
  }, [token, email]);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Email đã được xác thực thành công!');
        showNotification('Thành công', 'Email đã được xác thực! Bạn có thể đăng nhập ngay.', 'success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Không thể xác thực email. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      showNotification('Lỗi', 'Không tìm thấy email', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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
    <div className="verify-email-page">
      <SEO
        title="Xác thực email - Du học An Nhiên"
        description="Xác thực email của bạn để hoàn tất đăng ký"
      />

      <div className="verify-email-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="verify-email-card"
        >
          {status === 'verifying' && (
            <>
              <div className="verify-icon">⏳</div>
              <h1>Đang xác thực email...</h1>
              <p>Vui lòng đợi trong giây lát</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verify-icon success">✅</div>
              <h1>Xác thực thành công!</h1>
              <p>{message}</p>
              <p className="redirect-message">Đang chuyển đến trang đăng nhập...</p>
              <Link to="/login" className="btn-primary">
                Đăng nhập ngay
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="verify-icon error">❌</div>
              <h1>Xác thực thất bại</h1>
              <p>{message}</p>
              <div className="verify-actions">
                <button 
                  onClick={resendVerification} 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Đang gửi...' : 'Gửi lại email xác thực'}
                </button>
                <Link to="/login" className="btn-secondary">
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;



