import React from 'react';
import { showNotification } from '../components/NotificationCenter';
import { addPoints } from '../utils/pointsSystem';
import SEO from '../components/SEO';
import './TestNotifications.css';

const TestNotifications = () => {
  const testNotifications = [
    {
      title: '🔔 Thông báo thông thường',
      message: 'Đây là một thông báo thông thường để test',
      type: 'info',
      icon: '🔔'
    },
    {
      title: '🎯 Thử thách hàng ngày',
      message: 'Bạn có thử thách mới để kiếm điểm!',
      type: 'quest',
      icon: '🎯'
    },
    {
      title: '🎉 Đạt 1000 điểm!',
      message: 'Chúc mừng! Bạn đã đạt cột mốc 1000 điểm.',
      type: 'milestone',
      icon: '🎉'
    },
    {
      title: '⚠️ Cảnh báo',
      message: 'Đây là thông báo cảnh báo',
      type: 'warning',
      icon: '⚠️'
    },
    {
      title: '❌ Lỗi',
      message: 'Đây là thông báo lỗi',
      type: 'error',
      icon: '❌'
    },
    {
      title: '⭐ Level Up!',
      message: 'Chúc mừng! Bạn đã lên Level 5!',
      type: 'milestone',
      icon: '⭐'
    },
    {
      title: '🏆 Badge mới',
      message: 'Bạn đã nhận được badge "Quiz Master"!',
      type: 'milestone',
      icon: '🏆'
    }
  ];

  const handleTestNotification = (notification) => {
    showNotification(
      notification.title,
      notification.message,
      notification.type,
      notification.icon
    );
  };

  const handleTestPoints = () => {
    addPoints(50, 'test');
  };

  const handleTestLevelUp = () => {
    const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
    const currentLevel = Math.floor(currentPoints / 500) + 1;
    const pointsNeeded = (currentLevel * 500) - currentPoints;
    addPoints(pointsNeeded + 10, 'test');
  };

  const handleTestBadge = () => {
    showNotification(
      '🏆 Badge mới: Quiz Master',
      'Hoàn thành Quiz tìm trường',
      'milestone',
      '🏆'
    );
  };

  return (
    <div className="test-notifications-page">
      <SEO
        title="Test Notifications - Du học An Nhiên"
        description="Test trang thông báo thông minh"
      />

      <div className="test-container">
        <h1>🧪 Test Smart Notifications</h1>
        <p className="description">
          Click vào các button bên dưới để test các loại thông báo khác nhau.
          Thông báo sẽ xuất hiện ở:
        </p>
        <ul className="features-list">
          <li>🔔 Icon chuông ở góc dưới bên phải</li>
          <li>💻 Browser notification (nếu đã cho phép)</li>
          <li>📱 Notification center khi click vào icon chuông</li>
        </ul>

        <div className="test-section">
          <h2>📋 Test các loại thông báo</h2>
          <div className="test-buttons-grid">
            {testNotifications.map((notification, index) => (
              <button
                key={index}
                className={`test-btn ${notification.type}`}
                onClick={() => handleTestNotification(notification)}
              >
                <span className="btn-icon">{notification.icon}</span>
                <span className="btn-text">{notification.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="test-section">
          <h2>💎 Test với hệ thống điểm</h2>
          <div className="test-buttons-grid">
            <button
              className="test-btn points"
              onClick={handleTestPoints}
            >
              <span className="btn-icon">💎</span>
              <span className="btn-text">Kiếm 50 điểm</span>
            </button>
            <button
              className="test-btn level"
              onClick={handleTestLevelUp}
            >
              <span className="btn-icon">⭐</span>
              <span className="btn-text">Level Up!</span>
            </button>
            <button
              className="test-btn badge"
              onClick={handleTestBadge}
            >
              <span className="btn-icon">🏆</span>
              <span className="btn-text">Nhận Badge</span>
            </button>
          </div>
        </div>

        <div className="test-section">
          <h2>ℹ️ Hướng dẫn</h2>
          <div className="info-box">
            <h3>Browser Notifications:</h3>
            <ol>
              <li>Browser sẽ hỏi permission khi lần đầu load trang</li>
              <li>Click "Allow" để nhận browser notifications</li>
              <li>Nếu đã từ chối, cần vào Settings của browser để bật lại</li>
            </ol>

            <h3>In-App Notifications:</h3>
            <ol>
              <li>Click vào icon 🔔 ở góc dưới bên phải</li>
              <li>Xem tất cả notifications trong notification center</li>
              <li>Click vào notification để đánh dấu đã đọc</li>
              <li>Click 🗑️ để xóa notification</li>
            </ol>

            <h3>Scheduled Notifications:</h3>
            <ul>
              <li>Thông báo thử thách hàng ngày sẽ tự động hiện sau 2 giây khi vào trang mới</li>
              <li>Thông báo milestone (100, 500, 1000 điểm...) sẽ tự động hiện khi đạt</li>
            </ul>
          </div>
        </div>

        <div className="test-section">
          <h2>🔧 Debug Info</h2>
          <div className="debug-info">
            <p><strong>Notification Permission:</strong> {
              'Notification' in window 
                ? Notification.permission 
                : 'Not supported'
            }</p>
            <p><strong>Current Points:</strong> {parseInt(localStorage.getItem('userPoints') || '0')}</p>
            <p><strong>Current Level:</strong> {Math.floor(parseInt(localStorage.getItem('userPoints') || '0') / 500) + 1}</p>
            <p><strong>Notifications Count:</strong> {
              JSON.parse(localStorage.getItem('userNotifications') || '[]').length
            }</p>
            <button
              className="test-btn clear"
              onClick={() => {
                localStorage.removeItem('userNotifications');
                window.location.reload();
              }}
            >
              🗑️ Xóa tất cả notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;


