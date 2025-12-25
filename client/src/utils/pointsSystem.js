/**
 * Hệ thống điểm thưởng
 * Utility functions để quản lý điểm, level và badges
 */

// Định nghĩa điểm thưởng cho từng nhiệm vụ
export const POINTS_REWARDS = {
  QUIZ_COMPLETE: 100,
  VIDEO_WATCH: 15,
  CALCULATOR_USE: 50,
  SCHOOL_COMPARE: 20,
  NEWSLETTER_SUB: 50,
  CONSULTATION_REGISTER: 200,
  RESOURCE_DOWNLOAD: 30,
  PROGRESS_STEP_COMPLETE: 25,
  BLOG_READ: 10,
  EVENT_REGISTER: 100,
  REFERRAL_SIGNUP: 150
};

// Định nghĩa badges
export const BADGES = {
  QUIZ_MASTER: { id: 'quiz-master', name: 'Quiz Master', icon: '🎯', description: 'Hoàn thành Quiz tìm trường', points: 100 },
  VIDEO_EXPERT: { id: 'video-watcher', name: 'Video Expert', icon: '🎥', description: 'Xem 10 video', points: 150 },
  BUDGET_PLANNER: { id: 'calculator-user', name: 'Budget Planner', icon: '💰', description: 'Sử dụng tính chi phí', points: 50 },
  SCHOOL_RESEARCHER: { id: 'school-comparer', name: 'School Researcher', icon: '🏫', description: 'So sánh 5 trường', points: 100 },
  NEWSLETTER_SUB: { id: 'newsletter-sub', name: 'Newsletter Subscriber', icon: '📧', description: 'Đăng ký newsletter', points: 50 },
  CONSULTATION_SEEKER: { id: 'consultation', name: 'Consultation Seeker', icon: '💬', description: 'Đăng ký tư vấn', points: 200 },
  RESOURCE_COLLECTOR: { id: 'resource-collector', name: 'Resource Collector', icon: '📚', description: 'Tải 5 tài liệu', points: 100 },
  PROGRESS_MASTER: { id: 'progress-master', name: 'Progress Master', icon: '📊', description: 'Hoàn thành tất cả bước', points: 200 }
};

/**
 * Lấy điểm hiện tại từ localStorage
 */
export const getPoints = () => {
  return parseInt(localStorage.getItem('userPoints') || '0');
};

/**
 * Lấy level hiện tại từ localStorage
 */
export const getLevel = () => {
  return parseInt(localStorage.getItem('userLevel') || '1');
};

/**
 * Lấy badges đã đạt được từ localStorage
 */
export const getBadges = () => {
  try {
    return JSON.parse(localStorage.getItem('userBadges') || '[]');
  } catch (e) {
    return [];
  }
};

/**
 * Lưu điểm vào localStorage
 */
const savePoints = (points) => {
  localStorage.setItem('userPoints', points.toString());
};

/**
 * Lưu level vào localStorage
 */
const saveLevel = (level) => {
  localStorage.setItem('userLevel', level.toString());
};

/**
 * Lưu badges vào localStorage
 */
const saveBadges = (badges) => {
  localStorage.setItem('userBadges', JSON.stringify(badges));
};

/**
 * Tính level dựa trên điểm
 */
const calculateLevel = (points) => {
  return Math.floor(points / 500) + 1;
};

/**
 * Kiểm tra và cấp badge
 */
const checkAndAwardBadge = (badgeId, currentBadges) => {
  if (!currentBadges.includes(badgeId)) {
    const newBadges = [...currentBadges, badgeId];
    saveBadges(newBadges);
    return { awarded: true, badgeId };
  }
  return { awarded: false };
};

/**
 * Thêm điểm và cập nhật level
 * @param {number} pointsToAdd - Số điểm cần thêm
 * @param {string} action - Hành động gây ra (để tracking)
 * @returns {Object} - { newPoints, newLevel, levelUp, badgeAwarded }
 */
/**
 * Track activity for Dashboard
 */
export const trackActivity = (type, title, points = 0, icon = '📝') => {
  const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
  const newActivity = {
    type,
    title,
    points,
    icon,
    timestamp: new Date().toISOString()
  };
  activities.unshift(newActivity); // Add to beginning
  // Keep only last 100 activities
  const limitedActivities = activities.slice(0, 100);
  localStorage.setItem('userActivities', JSON.stringify(limitedActivities));
};

export const addPoints = (pointsToAdd, action = '') => {
  const currentPoints = getPoints();
  const currentLevel = getLevel();
  const currentBadges = getBadges();
  
  const newPoints = currentPoints + pointsToAdd;
  const newLevel = calculateLevel(newPoints);
  const levelUp = newLevel > currentLevel;
  
  // Lưu điểm và level mới
  savePoints(newPoints);
  if (levelUp) {
    saveLevel(newLevel);
  }
  
  // Kiểm tra badges
  let badgeAwarded = null;
  
  // Badge: Quiz Master
  if (action === 'quiz_complete' && !currentBadges.includes(BADGES.QUIZ_MASTER.id)) {
    badgeAwarded = checkAndAwardBadge(BADGES.QUIZ_MASTER.id, currentBadges);
  }
  
  // Badge: Video Expert (xem 10 video)
  if (action === 'video_watch') {
    const videoCount = parseInt(localStorage.getItem('videoWatchCount') || '0') + 1;
    localStorage.setItem('videoWatchCount', videoCount.toString());
    if (videoCount >= 10 && !currentBadges.includes(BADGES.VIDEO_EXPERT.id)) {
      badgeAwarded = checkAndAwardBadge(BADGES.VIDEO_EXPERT.id, currentBadges);
    }
  }
  
  // Badge: Budget Planner
  if (action === 'calculator_use' && !currentBadges.includes(BADGES.BUDGET_PLANNER.id)) {
    badgeAwarded = checkAndAwardBadge(BADGES.BUDGET_PLANNER.id, currentBadges);
  }
  
  // Badge: School Researcher (so sánh 5 trường)
  if (action === 'school_compare') {
    const compareCount = parseInt(localStorage.getItem('schoolCompareCount') || '0') + 1;
    localStorage.setItem('schoolCompareCount', compareCount.toString());
    if (compareCount >= 5 && !currentBadges.includes(BADGES.SCHOOL_RESEARCHER.id)) {
      badgeAwarded = checkAndAwardBadge(BADGES.SCHOOL_RESEARCHER.id, currentBadges);
    }
  }
  
  // Badge: Newsletter Subscriber
  if (action === 'newsletter_sub' && !currentBadges.includes(BADGES.NEWSLETTER_SUB.id)) {
    badgeAwarded = checkAndAwardBadge(BADGES.NEWSLETTER_SUB.id, currentBadges);
  }
  
  // Badge: Consultation Seeker
  if (action === 'consultation_register' && !currentBadges.includes(BADGES.CONSULTATION_SEEKER.id)) {
    badgeAwarded = checkAndAwardBadge(BADGES.CONSULTATION_SEEKER.id, currentBadges);
  }
  
  // Badge: Resource Collector (tải 5 tài liệu)
  if (action === 'resource_download') {
    const downloadCount = parseInt(localStorage.getItem('resourceDownloadCount') || '0') + 1;
    localStorage.setItem('resourceDownloadCount', downloadCount.toString());
    if (downloadCount >= 5 && !currentBadges.includes(BADGES.RESOURCE_COLLECTOR.id)) {
      badgeAwarded = checkAndAwardBadge(BADGES.RESOURCE_COLLECTOR.id, currentBadges);
    }
  }
  
  // Badge: Progress Master (hoàn thành tất cả bước)
  if (action === 'progress_complete' && !currentBadges.includes(BADGES.PROGRESS_MASTER.id)) {
    badgeAwarded = checkAndAwardBadge(BADGES.PROGRESS_MASTER.id, currentBadges);
  }
  
  // Sync points to server if user has email
  syncPointsToServer(newPoints, newLevel);

  // Trigger custom event để các component khác có thể lắng nghe
  window.dispatchEvent(new CustomEvent('pointsUpdated', {
    detail: {
      newPoints,
      newLevel,
      levelUp,
      pointsAdded: pointsToAdd,
      badgeAwarded
    }
  }));
  
  return {
    newPoints,
    newLevel,
    levelUp,
    badgeAwarded
  };
};

/**
 * Sync points to server for leaderboard
 */
export const syncPointsToServer = async (points, level) => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) return; // No email, skip sync

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  
  try {
    await fetch(`${API_URL}/api/leaderboard/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: userEmail,
        user_name: localStorage.getItem('userName') || null,
        points,
        level
      })
    });
  } catch (error) {
    console.error('Error syncing points to server:', error);
    // Silent fail - don't interrupt user experience
  }
};

/**
 * Hiển thị thông báo khi nhận điểm
 */
export const showPointsNotification = (pointsAdded, badgeAwarded = null) => {
  // Tạo notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 300px;
  `;
  
  let content = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 24px;">✨</span>
      <div>
        <div style="font-weight: bold; font-size: 18px;">+${pointsAdded} điểm!</div>
        ${badgeAwarded ? `<div style="margin-top: 5px; font-size: 14px;">🏆 Badge mới: ${badgeAwarded.name || 'Badge'}</div>` : ''}
      </div>
    </div>
  `;
  
  notification.innerHTML = content;
  document.body.appendChild(notification);
  
  // Tự động xóa sau 3 giây
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
  
  // Thêm animation CSS nếu chưa có
  if (!document.getElementById('points-notification-style')) {
    const style = document.createElement('style');
    style.id = 'points-notification-style';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

