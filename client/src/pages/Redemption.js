import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';
import { getPoints, addPoints } from '../utils/pointsSystem';
import './Redemption.css';

const Redemption = () => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    loadRewards();
    loadUserPoints();
    loadUserEmail();
  }, []);

  useEffect(() => {
    filterRewards();
  }, [selectedCategory, rewards]);

  useEffect(() => {
    const handlePointsUpdate = (event) => {
      setUserPoints(event.detail.newPoints);
    };
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, []);

  const loadRewards = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rewards`);
      setRewards(response.data);
      setFilteredRewards(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rewards:', error);
      setLoading(false);
    }
  };

  const loadUserPoints = () => {
    const points = getPoints();
    setUserPoints(points);
  };

  const loadUserEmail = () => {
    const email = localStorage.getItem('userEmail') || '';
    setUserEmail(email);
  };

  const loadRedemptionHistory = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/rewards/redemptions/${email}`);
      setRedemptionHistory(response.data);
    } catch (error) {
      console.error('Error loading redemption history:', error);
    }
  };

  const filterRewards = () => {
    if (selectedCategory === 'all') {
      setFilteredRewards(rewards);
    } else {
      setFilteredRewards(rewards.filter(r => r.category === selectedCategory));
    }
  };

  const handleRedeem = async (reward) => {
    if (userPoints < reward.points_required) {
      alert(`Bạn cần ${reward.points_required} điểm để đổi phần thưởng này. Bạn hiện có ${userPoints} điểm.`);
      return;
    }

    // Check if user has email
    let email = userEmail;
    if (!email) {
      const inputEmail = prompt('Vui lòng nhập email để đổi phần thưởng:');
      if (!inputEmail) return;
      email = inputEmail;
      localStorage.setItem('userEmail', email);
      setUserEmail(email);
    }

    if (!window.confirm(`Bạn có chắc muốn đổi "${reward.name}" với ${reward.points_required} điểm?`)) {
      return;
    }

    setRedeeming(reward.id);

    try {
      const response = await axios.post(`${API_URL}/api/rewards/redeem`, {
        user_email: email,
        reward_id: reward.id
      });

      if (response.data.success) {
        // Deduct points (we'll use negative points to subtract)
        const currentPoints = getPoints();
        const newPoints = currentPoints - reward.points_required;
        localStorage.setItem('userPoints', newPoints.toString());
        
        // Sync to server
        const { syncPointsToServer } = require('../utils/pointsSystem');
        syncPointsToServer(newPoints, Math.floor(newPoints / 500) + 1);
        
        // Trigger points update event
        window.dispatchEvent(new CustomEvent('pointsUpdated', {
          detail: {
            newPoints,
            pointsAdded: -reward.points_required
          }
        }));

        setUserPoints(newPoints);
        
        // Show success message with redemption code
        alert(`✅ Đổi phần thưởng thành công!\n\nMã đổi thưởng: ${response.data.redemption.redemption_code}\n\nVui lòng lưu mã này và liên hệ với chúng tôi để nhận phần thưởng.`);
        
        // Reload redemption history
        loadRedemptionHistory(email);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Có lỗi xảy ra khi đổi phần thưởng. Vui lòng thử lại.');
    } finally {
      setRedeeming(null);
    }
  };

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🎁' },
    { id: 'voucher', name: 'Voucher', icon: '💰' },
    { id: 'document', name: 'Tài liệu', icon: '📚' },
    { id: 'access', name: 'Quyền truy cập', icon: '🔓' }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '🎁';
  };

  return (
    <div className="redemption-page">
      <SEO
        title="Đổi điểm thưởng - Du học An Nhiên"
        description="Đổi điểm thưởng lấy voucher, tài liệu độc quyền và quyền truy cập đặc biệt. Kiếm điểm và nhận phần thưởng ngay hôm nay!"
        keywords="đổi điểm thưởng, voucher, tài liệu, quyền truy cập, phần thưởng"
      />

      <div className="redemption-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="redemption-header"
        >
          <h1>💎 Đổi Điểm Thưởng</h1>
          <div className="points-display-header">
            <div className="points-number-large">{userPoints}</div>
            <div className="points-label-large">điểm</div>
          </div>
          <div className="header-actions">
            <button 
              className="btn-history"
              onClick={() => {
                if (userEmail) {
                  loadRedemptionHistory(userEmail);
                  setShowHistory(true);
                } else {
                  setShowEmailModal(true);
                }
              }}
            >
              📜 Lịch sử đổi thưởng
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="category-filter"
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Rewards Grid */}
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : filteredRewards.length === 0 ? (
          <div className="no-rewards">Không có phần thưởng nào trong danh mục này.</div>
        ) : (
          <div className="rewards-grid">
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`reward-card ${userPoints < reward.points_required ? 'insufficient-points' : ''}`}
              >
                <div className="reward-icon">{getCategoryIcon(reward.category)}</div>
                <h3>{reward.name}</h3>
                <p className="reward-description">{reward.description}</p>
                <div className="reward-points">
                  <span className="points-required">{reward.points_required}</span>
                  <span className="points-label">điểm</span>
                </div>
                {userPoints < reward.points_required ? (
                  <div className="insufficient-message">
                    Cần thêm {reward.points_required - userPoints} điểm
                  </div>
                ) : (
                  <button
                    className="btn-redeem"
                    onClick={() => handleRedeem(reward)}
                    disabled={redeeming === reward.id}
                  >
                    {redeeming === reward.id ? 'Đang xử lý...' : 'Đổi ngay'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Nhập email để xem lịch sử</h3>
            <input
              type="email"
              placeholder="Email của bạn"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userEmail) {
                  localStorage.setItem('userEmail', userEmail);
                  loadRedemptionHistory(userEmail);
                  setShowHistory(true);
                  setShowEmailModal(false);
                }
              }}
            />
            <div className="modal-actions">
              <button onClick={() => setShowEmailModal(false)}>Hủy</button>
              <button
                onClick={() => {
                  if (userEmail) {
                    localStorage.setItem('userEmail', userEmail);
                    loadRedemptionHistory(userEmail);
                    setShowHistory(true);
                    setShowEmailModal(false);
                  }
                }}
                disabled={!userEmail}
              >
                Xem lịch sử
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📜 Lịch sử đổi thưởng</h3>
            {redemptionHistory.length === 0 ? (
              <p>Bạn chưa đổi phần thưởng nào.</p>
            ) : (
              <div className="history-list">
                {redemptionHistory.map((redemption) => (
                  <div key={redemption.id} className="history-item">
                    <div className="history-reward-name">{redemption.reward_name}</div>
                    <div className="history-details">
                      <div>Mã: <strong>{redemption.redemption_code}</strong></div>
                      <div>Điểm đã dùng: {redemption.points_used}</div>
                      <div>Trạng thái: 
                        <span className={`status ${redemption.status}`}>
                          {redemption.status === 'pending' ? '⏳ Đang xử lý' : 
                           redemption.status === 'completed' ? '✅ Hoàn thành' : 
                           '❌ Đã hủy'}
                        </span>
                      </div>
                      <div className="history-date">
                        {new Date(redemption.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-close" onClick={() => setShowHistory(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Redemption;

