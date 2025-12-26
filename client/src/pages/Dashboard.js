import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import { getPoints } from '../utils/pointsSystem';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    rank: null,
    totalUsers: 0,
    badges: [],
    achievements: []
  });
  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    loadDashboardData();
    
    // Listen for points updates
    const handlePointsUpdate = (event) => {
      loadDashboardData();
    };
    
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const points = getPoints();
      const level = Math.floor(points / 500) + 1;
      const badges = JSON.parse(localStorage.getItem('userBadges') || '[]');
      
      // Load rank if email exists
      let rank = null;
      let totalUsers = 0;
      if (userEmail) {
        try {
          const rankResponse = await axios.get(`${API_URL}/api/leaderboard/rank/${encodeURIComponent(userEmail)}`);
          rank = rankResponse.data?.rank || null;
          totalUsers = rankResponse.data?.total_users || 0;
        } catch (err) {
          console.error('Error loading rank:', err);
        }
      }

      // Load activities (from localStorage for now)
      const savedActivities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      
      // Generate recommendations
      const recs = generateRecommendations(points, level, badges, savedActivities);
      
      // Load goals
      const savedGoals = JSON.parse(localStorage.getItem('userGoals') || '[]');
      
      // Generate insights
      const insightsData = generateInsights(points, level, savedActivities);

      setStats({
        points,
        level,
        rank,
        totalUsers,
        badges,
        achievements: calculateAchievements(points, level, badges, savedActivities)
      });
      setActivities(savedActivities.slice(0, 10)); // Last 10 activities
      setRecommendations(recs);
      setGoals(savedGoals);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (points, level, badges, activities) => {
    const recs = [];
    
    // Check what user hasn't done
    const hasDoneQuiz = activities.some(a => a.type === 'quiz');
    const hasWatchedVideo = activities.some(a => a.type === 'video');
    const hasReadBlog = activities.some(a => a.type === 'blog');
    const hasJoinedCommunity = activities.some(a => a.type === 'community');
    
    if (!hasDoneQuiz) {
      recs.push({
        type: 'quiz',
        title: 'Làm Quiz đầu tiên',
        description: 'Kiếm điểm bằng cách làm quiz về du học Hàn Quốc',
        action: () => navigate('/quiz'),
        icon: '📝',
        points: '+50 điểm'
      });
    }
    
    if (!hasWatchedVideo) {
      recs.push({
        type: 'video',
        title: 'Xem Video',
        description: 'Học hỏi từ các video về du học Hàn Quốc',
        action: () => navigate('/videos'),
        icon: '🎥',
        points: '+30 điểm'
      });
    }
    
    if (!hasReadBlog) {
      recs.push({
        type: 'blog',
        title: 'Đọc Blog',
        description: 'Cập nhật thông tin mới nhất về du học',
        action: () => navigate('/blog'),
        icon: '📰',
        points: '+20 điểm'
      });
    }
    
    if (!hasJoinedCommunity) {
      recs.push({
        type: 'community',
        title: 'Tham gia Community',
        description: 'Kết nối với cộng đồng du học sinh',
        action: () => navigate('/community'),
        icon: '👥',
        points: '+40 điểm'
      });
    }
    
    // Level-based recommendations
    if (level < 5) {
      recs.push({
        type: 'level',
        title: `Đạt Level ${level + 1}`,
        description: `Cần thêm ${500 - (points % 500)} điểm để lên level`,
        action: () => navigate('/gamification'),
        icon: '⭐',
        points: `+${500 - (points % 500)} điểm`
      });
    }
    
    // Badge recommendations
    if (badges.length < 5) {
      recs.push({
        type: 'badge',
        title: 'Kiếm thêm Badge',
        description: 'Hoàn thành các thử thách để nhận badge',
        action: () => navigate('/gamification'),
        icon: '🏆',
        points: 'Badge mới'
      });
    }
    
    return recs.slice(0, 6);
  };

  const generateInsights = (points, level, activities) => {
    const insights = [];
    
    // Calculate stats
    const quizCount = activities.filter(a => a.type === 'quiz').length;
    const videoCount = activities.filter(a => a.type === 'video').length;
    const blogCount = activities.filter(a => a.type === 'blog').length;
    const totalActivities = activities.length;
    
    if (quizCount > 0) {
      insights.push({
        type: 'quiz',
        title: 'Quiz Master',
        description: `Bạn đã hoàn thành ${quizCount} quiz${quizCount > 1 ? 's' : ''}`,
        icon: '📝'
      });
    }
    
    if (videoCount > 0) {
      insights.push({
        type: 'video',
        title: 'Video Learner',
        description: `Bạn đã xem ${videoCount} video${videoCount > 1 ? 's' : ''}`,
        icon: '🎥'
      });
    }
    
    if (blogCount > 0) {
      insights.push({
        type: 'blog',
        title: 'Blog Reader',
        description: `Bạn đã đọc ${blogCount} bài blog${blogCount > 1 ? 's' : ''}`,
        icon: '📰'
      });
    }
    
    if (totalActivities > 10) {
      insights.push({
        type: 'activity',
        title: 'Active User',
        description: `Bạn đã có ${totalActivities} hoạt động trên website`,
        icon: '🔥'
      });
    }
    
    if (level >= 5) {
      insights.push({
        type: 'level',
        title: 'High Level',
        description: `Bạn đã đạt level ${level} - rất ấn tượng!`,
        icon: '⭐'
      });
    }
    
    return insights;
  };

  const calculateAchievements = (points, level, badges, activities) => {
    const achievements = [];
    
    // Points achievements
    if (points >= 1000) achievements.push({ id: 'points_1k', name: '1K Points', icon: '💎', unlocked: true });
    if (points >= 5000) achievements.push({ id: 'points_5k', name: '5K Points', icon: '💎💎', unlocked: true });
    if (points >= 10000) achievements.push({ id: 'points_10k', name: '10K Points', icon: '💎💎💎', unlocked: true });
    
    // Level achievements
    if (level >= 5) achievements.push({ id: 'level_5', name: 'Level 5', icon: '⭐', unlocked: true });
    if (level >= 10) achievements.push({ id: 'level_10', name: 'Level 10', icon: '⭐⭐', unlocked: true });
    
    // Activity achievements
    const quizCount = activities.filter(a => a.type === 'quiz').length;
    if (quizCount >= 10) achievements.push({ id: 'quiz_10', name: '10 Quizzes', icon: '📝', unlocked: true });
    
    const videoCount = activities.filter(a => a.type === 'video').length;
    if (videoCount >= 20) achievements.push({ id: 'video_20', name: '20 Videos', icon: '🎥', unlocked: true });
    
    return achievements;
  };

  const addGoal = () => {
    const goalText = prompt('Nhập mục tiêu mới:');
    if (goalText) {
      const newGoal = {
        id: Date.now(),
        text: goalText,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
    }
  };

  const toggleGoal = (goalId) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  const deleteGoal = (goalId) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    localStorage.setItem('userGoals', JSON.stringify(updatedGoals));
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Đang tải dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <SEO
        title="Dashboard cá nhân - Du học An Nhiên"
        description="Xem thống kê, tiến độ và nhận đề xuất cá nhân hóa"
      />

      <div className="dashboard-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-header"
        >
          <h1>📊 Dashboard Cá Nhân</h1>
          {!userEmail && (
            <div className="email-prompt">
              <p>💡 Đăng nhập email để lưu tiến độ và tham gia bảng xếp hạng</p>
              <button onClick={() => navigate('/gamification')} className="btn-primary">
                Thêm Email
              </button>
            </div>
          )}
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stats-overview"
        >
          <div className="stat-card points-card">
            <div className="stat-icon">💎</div>
            <div className="stat-value">{stats.points.toLocaleString()}</div>
            <div className="stat-label">Điểm thưởng</div>
          </div>
          
          <div className="stat-card level-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">Level {stats.level}</div>
            <div className="stat-label">
              {stats.points % 500} / 500 đến level {stats.level + 1}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(stats.points % 500) / 500 * 100}%` }}
              />
            </div>
          </div>
          
          {stats.rank && (
            <div className="stat-card rank-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-value">#{stats.rank}</div>
              <div className="stat-label">Trên {stats.totalUsers} người</div>
            </div>
          )}
          
          <div className="stat-card badges-card">
            <div className="stat-icon">🎖️</div>
            <div className="stat-value">{stats.badges.length}</div>
            <div className="stat-label">Badges</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={selectedTab === 'overview' ? 'active' : ''}
            onClick={() => setSelectedTab('overview')}
          >
            📊 Tổng quan
          </button>
          <button
            className={selectedTab === 'achievements' ? 'active' : ''}
            onClick={() => setSelectedTab('achievements')}
          >
            🏆 Thành tựu
          </button>
          <button
            className={selectedTab === 'goals' ? 'active' : ''}
            onClick={() => setSelectedTab('goals')}
          >
            🎯 Mục tiêu
          </button>
          <button
            className={selectedTab === 'insights' ? 'active' : ''}
            onClick={() => setSelectedTab('insights')}
          >
            💡 Insights
          </button>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {selectedTab === 'overview' && (
            <div className="overview-tab">
              {/* Recommendations */}
              <div className="section recommendations-section">
                <h2>💡 Đề xuất cho bạn</h2>
                <div className="recommendations-grid">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="recommendation-card"
                      onClick={rec.action}
                    >
                      <div className="rec-icon">{rec.icon}</div>
                      <h3>{rec.title}</h3>
                      <p>{rec.description}</p>
                      <div className="rec-points">{rec.points}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="section activities-section">
                <h2>📝 Hoạt động gần đây</h2>
                {activities.length === 0 ? (
                  <div className="empty-state">
                    <p>Chưa có hoạt động nào. Hãy bắt đầu khám phá website!</p>
                    <button onClick={() => navigate('/quiz')} className="btn-primary">
                      Làm Quiz ngay
                    </button>
                  </div>
                ) : (
                  <div className="activities-list">
                    {activities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-icon">{activity.icon || '📝'}</div>
                        <div className="activity-content">
                          <div className="activity-title">{activity.title || activity.type}</div>
                          <div className="activity-time">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleString('vi-VN') : 'Vừa xong'}
                          </div>
                        </div>
                        {activity.points && (
                          <div className="activity-points">+{activity.points}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'achievements' && (
            <div className="achievements-tab">
              <h2>🏆 Thành tựu của bạn</h2>
              {stats.achievements.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có thành tựu nào. Hãy tiếp tục khám phá để mở khóa thành tựu!</p>
                </div>
              ) : (
                <div className="achievements-grid">
                  {stats.achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card unlocked">
                      <div className="achievement-icon">{achievement.icon}</div>
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-badge">✅ Đã mở khóa</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'goals' && (
            <div className="goals-tab">
              <div className="goals-header">
                <h2>🎯 Mục tiêu của bạn</h2>
                <button onClick={addGoal} className="btn-primary">
                  + Thêm mục tiêu
                </button>
              </div>
              {goals.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có mục tiêu nào. Hãy thêm mục tiêu để theo dõi tiến độ!</p>
                </div>
              ) : (
                <div className="goals-list">
                  {goals.map((goal) => (
                    <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={goal.completed}
                        onChange={() => toggleGoal(goal.id)}
                        className="goal-checkbox"
                      />
                      <div className="goal-text">{goal.text}</div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="goal-delete"
                        title="Xóa mục tiêu"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'insights' && (
            <div className="insights-tab">
              <h2>💡 Insights về bạn</h2>
              {insights.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có insights. Hãy sử dụng website nhiều hơn để nhận insights!</p>
                </div>
              ) : (
                <div className="insights-grid">
                  {insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="insight-card"
                    >
                      <div className="insight-icon">{insight.icon}</div>
                      <h3>{insight.title}</h3>
                      <p>{insight.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;




