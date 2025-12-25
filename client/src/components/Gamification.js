import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Gamification.css';

const Gamification = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Load user stats from localStorage
    const loadStats = () => {
      const savedPoints = localStorage.getItem('userPoints') || '0';
      const savedLevel = localStorage.getItem('userLevel') || '1';
      const savedBadges = JSON.parse(localStorage.getItem('userBadges') || '[]');
      
      setPoints(parseInt(savedPoints));
      setLevel(parseInt(savedLevel));
      setBadges(savedBadges);
    };
    
    loadStats();
    
    // Listen for points updates
    const handlePointsUpdate = (event) => {
      setPoints(event.detail.newPoints);
      setLevel(event.detail.newLevel);
      if (event.detail.badgeAwarded && event.detail.badgeAwarded.awarded) {
        const currentBadges = JSON.parse(localStorage.getItem('userBadges') || '[]');
        const newBadges = [...currentBadges, event.detail.badgeAwarded.badgeId];
        setBadges(newBadges);
      }
    };
    
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);

    // Generate mock leaderboard
    const mockLeaderboard = [
      { rank: 1, name: 'Nguyễn Văn A', points: 1250, avatar: '👨‍🎓' },
      { rank: 2, name: 'Trần Thị B', points: 980, avatar: '👩‍🎓' },
      { rank: 3, name: 'Lê Văn C', points: 850, avatar: '👨‍🎓' },
      { rank: 4, name: 'Phạm Thị D', points: 720, avatar: '👩‍🎓' },
      { rank: 5, name: 'Hoàng Văn E', points: 650, avatar: '👨‍🎓' }
    ];
    setLeaderboard(mockLeaderboard);
  }, []);

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
          <h3>📊 Bảng xếp hạng</h3>
          <div className="leaderboard-list">
            {leaderboard.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`leaderboard-item ${user.rank <= 3 ? 'top-three' : ''}`}
              >
                <div className="rank-badge">{user.rank}</div>
                <div className="user-avatar-small">{user.avatar}</div>
                <div className="user-name">{user.name}</div>
                <div className="user-points">{user.points} điểm</div>
              </motion.div>
            ))}
          </div>
          <div className="your-rank">
            <div className="rank-badge">?</div>
            <div className="user-avatar-small">👤</div>
            <div className="user-name">Bạn</div>
            <div className="user-points">{points} điểm</div>
          </div>
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
    </div>
  );
};

export default Gamification;

