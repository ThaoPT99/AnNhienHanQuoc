import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter(n => !n.read).length);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Listen for new notifications
    const handleNewNotification = (event) => {
      addNotification(event.detail);
    };

    window.addEventListener('newNotification', handleNewNotification);

    // Check for scheduled notifications
    checkScheduledNotifications();

    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  const addNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      type: notificationData.type || 'info',
      title: notificationData.title,
      message: notificationData.message,
      icon: notificationData.icon || '🔔',
      read: false,
      timestamp: new Date().toISOString(),
      action: notificationData.action || null
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only last 50 notifications
      const limited = updated.slice(0, 50);
      localStorage.setItem('userNotifications', JSON.stringify(limited));
      setUnreadCount(limited.filter(n => !n.read).length);
      return limited;
    });

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: newNotification.id.toString()
      });
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('userNotifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('userNotifications', JSON.stringify(updated));
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    setUnreadCount(updated.filter(n => !n.read).length);
    localStorage.setItem('userNotifications', JSON.stringify(updated));
  };

  const checkScheduledNotifications = () => {
    // Check for daily quests
    const lastQuestCheck = localStorage.getItem('lastQuestCheck');
    const now = new Date();
    const today = now.toDateString();
    
    if (lastQuestCheck !== today) {
      // New day - show daily quest notification
      setTimeout(() => {
        addNotification({
          type: 'quest',
          title: '🎯 Thử thách hàng ngày mới!',
          message: 'Bạn có thử thách mới để kiếm điểm. Hãy xem ngay!',
          icon: '🎯',
          action: () => window.location.href = '/dashboard'
        });
      }, 2000); // Show after 2 seconds
      localStorage.setItem('lastQuestCheck', today);
    }

    // Check for points milestones
    const points = parseInt(localStorage.getItem('userPoints') || '0');
    const milestones = [100, 500, 1000, 2000, 5000, 10000];
    const lastMilestone = parseInt(localStorage.getItem('lastMilestone') || '0');
    
    for (const milestone of milestones) {
      if (points >= milestone && lastMilestone < milestone) {
        setTimeout(() => {
          addNotification({
            type: 'milestone',
            title: `🎉 Đạt ${milestone.toLocaleString()} điểm!`,
            message: `Chúc mừng! Bạn đã đạt cột mốc ${milestone.toLocaleString()} điểm.`,
            icon: '🎉'
          });
        }, 1000);
        localStorage.setItem('lastMilestone', milestone.toString());
        break;
      }
    }
  };

  return (
    <>
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Thông báo"
        title="Thông báo"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="notification-center"
          >
            <div className="notification-header">
              <h3>🔔 Thông báo</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="mark-all-read">
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="close-notifications">
                ✕
              </button>
            </div>

            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="no-notifications">
                  <p>Không có thông báo nào</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.action) {
                        notification.action();
                      }
                    }}
                  >
                    <div className="notification-icon">{notification.icon}</div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        {new Date(notification.timestamp).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <div className="notification-actions">
                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="delete-notification"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;

// Re-export showNotification from NotificationCenterAnNhien for backward compatibility
export { showNotification } from './NotificationCenterFacebook';

