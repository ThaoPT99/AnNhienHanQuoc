import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '../utils/timezone';
import './NotificationCenterFacebook.css';

const NotificationCenterAnNhien = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load notifications from localStorage
    const savedNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter(n => !n.read).length);

    // Listen for new notifications
    const handleNewNotification = (event) => {
      addNotification(event.detail);
    };

    window.addEventListener('newNotification', handleNewNotification);

    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const addNotification = (notificationData) => {
    const newNotification = {
      id: Date.now(),
      type: notificationData.type || 'info',
      title: notificationData.title,
      message: notificationData.message,
      icon: notificationData.icon || '🔔',
      read: false,
      timestamp: new Date().toISOString(),
      action: notificationData.action || null,
      userEmail: notificationData.userEmail || null,
      userAvatar: notificationData.userAvatar || null
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
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

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.action) {
      notification.action();
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '👍';
      case 'comment': return '💬';
      case 'friend': return '👥';
      case 'message': return '💌';
      case 'video-call': return '📞';
      default: return '🔔';
    }
  };

  return (
    <div className="notification-center-an-nhien" ref={dropdownRef}>
      <button
        className="notification-icon-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Thông báo"
      >
        <span className="notification-icon-symbol">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge-fb">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="notification-dropdown"
          >
            <div className="notification-dropdown-header">
              <h3>Thông báo</h3>
              {unreadCount > 0 && (
                <button className="mark-all-read-btn" onClick={markAllAsRead}>
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>

            <div className="notification-dropdown-content">
              {notifications.length === 0 ? (
                <div className="no-notifications-fb">
                  <div className="no-notifications-icon">🔔</div>
                  <p>Không có thông báo nào</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item-fb ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-item-avatar">
                      {notification.userAvatar ? (
                        <img src={notification.userAvatar} alt="" />
                      ) : (
                        <div className="notification-avatar-placeholder">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="notification-item-content">
                      <div className="notification-item-text">
                        <strong>{notification.title}</strong>
                        {notification.message && <span> {notification.message}</span>}
                      </div>
                      <div className="notification-item-time">
                        {getRelativeTime(notification.timestamp)}
                      </div>
                    </div>
                    {!notification.read && <div className="unread-indicator"></div>}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="notification-dropdown-footer">
                <button className="see-all-notifications" onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}>
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export showNotification function for compatibility
export const showNotification = (title, message, type = 'info', icon = '🔔', action = null, userEmail = null, userAvatar = null) => {
  window.dispatchEvent(new CustomEvent('newNotification', {
    detail: { title, message, type, icon, action, userEmail, userAvatar }
  }));
};

export default NotificationCenterAnNhien;
