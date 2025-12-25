import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './Gamification.css';

const Gamification = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    // Load user stats from localStorage
    const loadStats = async () => {
      const savedPoints = localStorage.getItem('userPoints') || '0';
      const savedLevel = localStorage.getItem('userLevel') || '1';
      const savedBadges = JSON.parse(localStorage.getItem('userBadges') || '[]');
      const savedEmail = localStorage.getItem('userEmail') || '';
      
      const pointsNum = parseInt(savedPoints);
      const levelNum = parseInt(savedLevel);
      
      setPoints(pointsNum);
      setLevel(levelNum);
      setBadges(savedBadges);
      setUserEmail(savedEmail);
      
      // Auto-sync points to server if email exists
      if (savedEmail && pointsNum >= 0) {
        try {
          await axios.post(`${API_URL}/api/leaderboard/sync`, {
            user_email: savedEmail,
            user_name: localStorage.getItem('userName') || null,
            points: pointsNum,
            level: levelNum
          });
          console.log('✅ Points auto-synced to server');
        } catch (error) {
          console.error('Error auto-syncing points:', error);
        }
      }
      
      // Show email modal if no email and has points
      if (!savedEmail && pointsNum > 0) {
        setShowEmailModal(true);
      }
    };
    
    loadStats().then(() => {
      // Wait a bit for sync to complete, then load leaderboard
      setTimeout(() => {
        loadLeaderboard();
      }, 500);
    });
    
    // Listen for points updates
    const handlePointsUpdate = (event) => {
      setPoints(event.detail.newPoints);
      setLevel(event.detail.newLevel);
      if (event.detail.badgeAwarded && event.detail.badgeAwarded.awarded) {
        const currentBadges = JSON.parse(localStorage.getItem('userBadges') || '[]');
        const newBadges = [...currentBadges, event.detail.badgeAwarded.badgeId];
        setBadges(newBadges);
      }
      
      // Show email modal if earned points but no email
      if (!userEmail && event.detail.newPoints > 0) {
        setShowEmailModal(true);
      }
    };
    
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, [userEmail]);

  const loadLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const response = await axios.get(`${API_URL}/api/leaderboard?limit=10`);
      setLeaderboard(response.data);
      
      // Load user rank if has email
      const email = localStorage.getItem('userEmail');
      if (email) {
        try {
          const rankResponse = await axios.get(`${API_URL}/api/leaderboard/rank/${email}`);
          setUserRank(rankResponse.data);
        } catch (error) {
          console.error('Error loading user rank:', error);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Fallback to empty array
      setLeaderboard([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }

    const email = emailInput.trim();
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
    setShowEmailModal(false);
    
    // Sync current points to server
    try {
      setLoadingLeaderboard(true);
      const syncResponse = await axios.post(`${API_URL}/api/leaderboard/sync`, {
        user_email: email,
        user_name: null,
        points,
        level
      });
      
      // Wait a bit to ensure database is updated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload leaderboard and rank
      await loadLeaderboard();
      
      if (points > 0) {
        alert(`✅ Đã tham gia bảng xếp hạng! Điểm của bạn (${points} điểm) đã được đồng bộ.`);
      } else {
        alert('✅ Đã tham gia bảng xếp hạng! Bắt đầu kiếm điểm để xuất hiện trên bảng xếp hạng nhé!');
      }
    } catch (error) {
      console.error('Error syncing points:', error);
      alert('Đã lưu email nhưng có lỗi khi đồng bộ điểm. Vui lòng thử lại sau.');
      setLoadingLeaderboard(false);
    }
  };

  const availableBadges = [
    { id: 'quiz-master', name: 'Quiz Master', icon: '🎯', description: 'Hoàn thành Quiz tìm trường', points: 100 },
    { id: 'video-watcher', name: 'Video Expert', icon: '🎥', description: 'Xem 10 video', points: 150 },
    { id: 'calculator-user', name: 'Budget Planner', icon: '💰', description: 'Sử dụng tính chi phí', points: 50 },
    { id: 'school-comparer', name: 'School Researcher', icon: '🏫', description: 'So sánh 5 trường', points: 100 },
    { id: 'newsletter-sub', name: 'Newsletter Subscriber', icon: '📧', description: 'Đăng ký newsletter', points: 50 },
    { id: 'consultation', name: 'Consultation Seeker', icon: '💬', description: 'Đăng ký tư vấn', points: 200 }
  ];

  const pointsToNextLevel = level * 500;
  const progress = (points % 500) / 500 * 100;

  const checkBadgeEarned = (badgeId) => {
    return badges.includes(badgeId);
  };

  const getLevelTitle = (lvl) => {
    if (lvl <= 2) return 'Người mới bắt đầu';
    if (lvl <= 5) return 'Người tìm hiểu';
    if (lvl <= 10) return 'Chuyên gia';
    return 'Bậc thầy';
  };

  return (
    <div className="gamification-section">
      <div className="gamification-header">
        <h2>🎮 Hệ thống điểm thưởng</h2>
        <p>Kiếm điểm, nhận badge và lên cấp khi sử dụng website!</p>
      </div>

      <div className="gamification-content">
        {/* User Stats */}
        <div className="user-stats-card">
          <div className="stats-header">
            <div className="user-avatar">👤</div>
            <div className="user-info">
              <h3>Hồ sơ của bạn</h3>
              <p className="user-level-title">{getLevelTitle(level)}</p>
            </div>
          </div>

          <div className="points-display">
            <div className="points-number">{points}</div>
            <div className="points-label">Điểm</div>
          </div>

          <div className="level-progress">
            <div className="level-info">
              <span>Cấp {level}</span>
              <span>Cấp {level + 1}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="progress-text">
              {points % 500} / {pointsToNextLevel} điểm đến cấp tiếp theo
            </div>
          </div>
          <button 
            className="btn-redeem-points"
            onClick={() => navigate('/redemption')}
          >
            💎 Đổi điểm thưởng
          </button>
        </div>

        {/* Badges */}
        <div className="badges-section">
          <h3>🏆 Badge của bạn</h3>
          <div className="badges-grid">
            {availableBadges.map((badge, index) => {
              const isEarned = checkBadgeEarned(badge.id);
              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`badge-card ${isEarned ? 'earned' : 'locked'}`}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-description">{badge.description}</div>
                  <div className="badge-points">+{badge.points} điểm</div>
                  {isEarned && <div className="badge-check">✓</div>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <div className="leaderboard-header">
            <h3>📊 Bảng xếp hạng</h3>
            <button 
              className="btn-refresh"
              onClick={loadLeaderboard}
              disabled={loadingLeaderboard}
              title="Làm mới bảng xếp hạng"
            >
              🔄
            </button>
          </div>
          {loadingLeaderboard ? (
            <div className="loading-leaderboard">Đang tải...</div>
          ) : leaderboard.length === 0 ? (
            <div className="no-leaderboard">
              <p>Chưa có dữ liệu bảng xếp hạng.</p>
              {userEmail ? (
                <>
                  <p className="hint" style={{ marginTop: '10px', color: '#667eea' }}>
                    Bạn đã có email: <strong>{userEmail}</strong>
                  </p>
                  <p className="hint" style={{ marginTop: '5px' }}>
                    Điểm hiện tại: <strong>{points} điểm</strong>
                  </p>
                  {points === 0 ? (
                    <p className="hint" style={{ marginTop: '10px', color: '#ff6b6b' }}>
                      Hãy kiếm điểm để xuất hiện trên bảng xếp hạng!
                    </p>
                  ) : (
                    <>
                      <p className="hint" style={{ marginTop: '10px', color: '#667eea' }}>
                        Điểm của bạn đã được đồng bộ. Nếu chưa thấy, hãy click nút refresh (🔄) ở trên.
                      </p>
                      <button 
                        className="btn-sync-manual"
                        onClick={async () => {
                          try {
                            setLoadingLeaderboard(true);
                            await axios.post(`${API_URL}/api/leaderboard/sync`, {
                              user_email: userEmail,
                              user_name: null,
                              points,
                              level
                            });
                            await new Promise(resolve => setTimeout(resolve, 500));
                            await loadLeaderboard();
                            alert('✅ Đã đồng bộ điểm thành công!');
                          } catch (error) {
                            console.error('Error syncing:', error);
                            alert('❌ Có lỗi khi đồng bộ. Vui lòng thử lại.');
                          } finally {
                            setLoadingLeaderboard(false);
                          }
                        }}
                      >
                        🔄 Đồng bộ điểm ngay
                      </button>
                    </>
                  )}
                </>
              ) : (
                <p className="hint">Nhập email để tham gia bảng xếp hạng!</p>
              )}
            </div>
          ) : (
            <>
              <div className="leaderboard-list">
                {leaderboard.map((user, index) => {
                  const avatar = user.display_name ? user.display_name.charAt(0).toUpperCase() : '👤';
                  return (
                    <motion.div
                      key={user.user_email || index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className={`leaderboard-item ${user.rank <= 3 ? 'top-three' : ''}`}
                    >
                      <div className="rank-badge">{user.rank}</div>
                      <div className="user-avatar-small">{avatar}</div>
                      <div className="user-name">{user.display_name || user.user_email}</div>
                      <div className="user-points">{user.points} điểm</div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="your-rank">
                <div className="rank-badge">{userRank?.rank || '?'}</div>
                <div className="user-avatar-small">👤</div>
                <div className="user-name">Bạn</div>
                <div className="user-points">{points} điểm</div>
                {userRank && (
                  <div className="rank-info">
                    Hạng {userRank.rank} / {userRank.total_users} người
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* How to Earn Points */}
        <div className="earn-points-section">
          <h3>💡 Cách kiếm điểm</h3>
          <div className="earn-points-list">
            <div className="earn-item">
              <span className="earn-icon">🎯</span>
              <div>
                <div className="earn-action">Hoàn thành Quiz tìm trường</div>
                <div className="earn-points">+100 điểm</div>
              </div>
            </div>
            <div className="earn-item">
              <span className="earn-icon">🎥</span>
              <div>
                <div className="earn-action">Xem video (mỗi video)</div>
                <div className="earn-points">+15 điểm</div>
              </div>
            </div>
            <div className="earn-item">
              <span className="earn-icon">💰</span>
              <div>
                <div className="earn-action">Sử dụng tính chi phí</div>
                <div className="earn-points">+50 điểm</div>
              </div>
            </div>
            <div className="earn-item">
              <span className="earn-icon">🏫</span>
              <div>
                <div className="earn-action">So sánh trường (mỗi lần)</div>
                <div className="earn-points">+20 điểm</div>
              </div>
            </div>
            <div className="earn-item">
              <span className="earn-icon">📧</span>
              <div>
                <div className="earn-action">Đăng ký newsletter</div>
                <div className="earn-points">+50 điểm</div>
              </div>
            </div>
            <div className="earn-item">
              <span className="earn-icon">💬</span>
              <div>
                <div className="earn-action">Đăng ký tư vấn</div>
                <div className="earn-points">+200 điểm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📧 Nhập email để tham gia bảng xếp hạng</h3>
            <p className="modal-description">
              Nhập email của bạn để đồng bộ điểm và tham gia bảng xếp hạng. Email chỉ dùng để hiển thị trên leaderboard.
            </p>
            <input
              type="email"
              placeholder="Email của bạn (ví dụ: yourname@email.com)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleEmailSubmit();
                }
              }}
              autoFocus
              className="email-input"
            />
            <div className="modal-actions">
              <button onClick={() => setShowEmailModal(false)} className="btn-cancel">
                Bỏ qua
              </button>
              <button 
                onClick={handleEmailSubmit}
                disabled={!emailInput || !emailInput.includes('@')}
                className="btn-submit"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamification;

