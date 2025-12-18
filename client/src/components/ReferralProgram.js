import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ReferralProgram.css';

const ReferralProgram = () => {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState(0);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    // Generate or load referral code
    let code = localStorage.getItem('referralCode');
    if (!code) {
      code = 'ANNHIEN' + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('referralCode', code);
    }
    setReferralCode(code);

    // Load referral stats
    const savedReferrals = localStorage.getItem('referralCount') || '0';
    const savedRewards = localStorage.getItem('referralRewards') || '0';
    setReferrals(parseInt(savedReferrals));
    setRewards(parseInt(savedRewards));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnFacebook = () => {
    const url = `https://duhocannhien.vercel.app/?ref=${referralCode}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnZalo = () => {
    const url = `https://duhocannhien.vercel.app/?ref=${referralCode}`;
    window.open(`https://zalo.me/share?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareViaLink = () => {
    const url = `https://duhocannhien.vercel.app/?ref=${referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rewardsList = [
    { count: 1, reward: 'Tài liệu du học miễn phí' },
    { count: 3, reward: 'Tư vấn miễn phí 1 buổi' },
    { count: 5, reward: 'Giảm 10% phí dịch vụ' },
    { count: 10, reward: 'Giảm 20% phí dịch vụ' },
    { count: 20, reward: 'Giảm 50% phí dịch vụ + Quà tặng đặc biệt' }
  ];

  return (
    <div className="referral-program">
      <div className="referral-header">
        <h2>🎁 Chương trình giới thiệu bạn bè</h2>
        <p>Giới thiệu bạn bè, nhận quà tặng hấp dẫn!</p>
      </div>

      <div className="referral-content">
        <div className="referral-card main-card">
          <div className="card-icon">🎯</div>
          <h3>Mã giới thiệu của bạn</h3>
          <div className="referral-code-box">
            <span className="referral-code">{referralCode}</span>
            <button 
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? '✓ Đã copy' : '📋 Copy'}
            </button>
          </div>
          <p className="code-description">
            Chia sẻ mã này với bạn bè. Khi họ đăng ký tư vấn, cả hai đều nhận quà!
          </p>
        </div>

        <div className="referral-stats">
          <div className="stat-item">
            <div className="stat-number">{referrals}</div>
            <div className="stat-label">Bạn đã giới thiệu</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{rewards}</div>
            <div className="stat-label">Phần thưởng đã nhận</div>
          </div>
        </div>

        <div className="referral-share">
          <h3>Chia sẻ mã giới thiệu</h3>
          <div className="share-buttons">
            <button className="share-btn facebook" onClick={shareOnFacebook}>
              <span className="share-icon">📘</span>
              <span>Facebook</span>
            </button>
            <button className="share-btn zalo" onClick={shareOnZalo}>
              <span className="share-icon">💬</span>
              <span>Zalo</span>
            </button>
            <button className="share-btn link" onClick={shareViaLink}>
              <span className="share-icon">🔗</span>
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <div className="referral-rewards">
          <h3>🎁 Bảng phần thưởng</h3>
          <div className="rewards-list">
            {rewardsList.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`reward-item ${referrals >= item.count ? 'unlocked' : ''}`}
              >
                <div className="reward-badge">
                  {referrals >= item.count ? '✓' : item.count}
                </div>
                <div className="reward-content">
                  <div className="reward-count">{item.count} người giới thiệu</div>
                  <div className="reward-text">{item.reward}</div>
                </div>
                {referrals >= item.count && (
                  <div className="reward-status">Đã nhận</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="referral-how">
          <h3>📋 Cách thức hoạt động</h3>
          <div className="how-steps">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Lấy mã giới thiệu</h4>
                <p>Copy mã giới thiệu của bạn ở trên</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Chia sẻ với bạn bè</h4>
                <p>Gửi mã hoặc link cho bạn bè quan tâm du học Hàn Quốc</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Bạn bè đăng ký</h4>
                <p>Khi bạn bè đăng ký tư vấn với mã của bạn</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Nhận phần thưởng</h4>
                <p>Cả bạn và bạn bè đều nhận được quà tặng!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;

