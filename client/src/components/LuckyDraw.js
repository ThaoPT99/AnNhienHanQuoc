import React, { useState, useEffect } from 'react';
import './LuckyDraw.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

function LuckyDraw() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [rewards, setRewards] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Load rewards and settings
    fetch(`${API_URL}/api/lucky-draw/info`)
      .then(res => res.json())
      .then(data => {
        setRewards(data.rewards || []);
        setSettings(data.settings || { win_rate: 30, is_active: 1 });
      })
      .catch(err => {
        console.error('Error loading lucky draw info:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!email || !phone) {
      setError('Vui lòng nhập đầy đủ email và số điện thoại');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/lucky-draw/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Có lỗi xảy ra');
        setLoading(false);
        return;
      }

      setResult(data);
      setLoading(false);
    } catch (err) {
      console.error('Error participating:', err);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setPhone('');
    setResult(null);
    setError('');
  };

  if (!settings || settings.is_active !== 1) {
    return (
      <div className="lucky-draw-container">
        <div className="lucky-draw-card">
          <h2>🎁 Vòng Quay May Mắn</h2>
          <p className="lucky-draw-message">Chương trình đang tạm dừng. Vui lòng quay lại sau!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lucky-draw-container">
      <div className="lucky-draw-card">
        <div className="lucky-draw-header">
          <h2>🎁 Vòng Quay May Mắn</h2>
          <p className="lucky-draw-subtitle">Nhập thông tin để tham gia và có cơ hội nhận quà tặng!</p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="lucky-draw-form">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0123456789"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="lucky-draw-submit-btn"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : '🎰 Tham gia ngay'}
            </button>
          </form>
        ) : (
          <div className="lucky-draw-result">
            {result.won ? (
              <div className="result-won">
                <div className="result-icon">🎉</div>
                <h3>Chúc mừng!</h3>
                <p className="result-message">{result.message}</p>
                {result.reward && (
                  <div className="reward-info">
                    <div className="reward-name">{result.reward.name}</div>
                    {result.reward.description && (
                      <div className="reward-description">{result.reward.description}</div>
                    )}
                  </div>
                )}
                <p className="result-note">
                  Chúng tôi sẽ liên hệ với bạn qua email hoặc số điện thoại để trao quà.
                </p>
              </div>
            ) : (
              <div className="result-lost">
                <div className="result-icon">😔</div>
                <h3>Chúc bạn may mắn lần sau!</h3>
                <p className="result-message">{result.message}</p>
                <p className="result-note">
                  Cảm ơn bạn đã tham gia. Hãy theo dõi để không bỏ lỡ cơ hội tiếp theo!
                </p>
              </div>
            )}

            {!result.already_participated && (
              <button onClick={handleReset} className="lucky-draw-reset-btn">
                Tham gia lại
              </button>
            )}
          </div>
        )}

        {rewards.length > 0 && (
          <div className="lucky-draw-rewards-preview">
            <h4>🎁 Phần quà có thể nhận được:</h4>
            <div className="rewards-list">
              {rewards.map((reward) => (
                <div key={reward.id} className="reward-item">
                  <span className="reward-name-small">{reward.name}</span>
                  {reward.stock_quantity > 0 && (
                    <span className="reward-stock">Còn {reward.stock_quantity}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LuckyDraw;
