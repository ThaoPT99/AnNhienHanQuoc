import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SocialProof.css';

const SocialProof = () => {
  const [viewers, setViewers] = useState(0);
  const [registrations, setRegistrations] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Simulate real-time data (in production, this would come from API)
    const generateRandomViewers = () => {
      return Math.floor(Math.random() * 20) + 10; // 10-30 viewers
    };

    const generateRandomRegistrations = () => {
      return Math.floor(Math.random() * 5) + 1; // 1-5 registrations today
    };

    const generateRecentActivity = () => {
      const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E'];
      const schools = ['Đại học Yonsei', 'Đại học Korea', 'Đại học SNU', 'Đại học Hanyang', 'Đại học Sungkyunkwan'];
      const activities = [
        { name: names[Math.floor(Math.random() * names.length)], action: 'đã đăng ký tư vấn', time: '5 phút trước' },
        { name: names[Math.floor(Math.random() * names.length)], action: `đã chọn ${schools[Math.floor(Math.random() * schools.length)]}`, time: '10 phút trước' },
        { name: names[Math.floor(Math.random() * names.length)], action: 'đã tải tài liệu', time: '15 phút trước' },
      ];
      return activities;
    };

    // Initial values
    setViewers(generateRandomViewers());
    setRegistrations(generateRandomRegistrations());
    setRecentActivity(generateRecentActivity());

    // Update every 30 seconds
    const interval = setInterval(() => {
      setViewers(generateRandomViewers());
      setRegistrations(generateRandomRegistrations());
      setRecentActivity(generateRecentActivity());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle scroll to auto-hide when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > scrollY && currentScrollY > 200) {
        setIsVisible(false);
      } else if (currentScrollY < scrollY || currentScrollY < 200) {
        setIsVisible(true);
      }
      
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`social-proof-container ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
          {/* Toggle button */}
          <button 
            className="social-proof-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? '▼' : '▲'}
          </button>

          {/* Main stats - always visible */}
          <div className="social-proof-main">
            <AnimatePresence mode="wait">
              <motion.div
                key="viewers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="social-proof-item compact"
              >
                <span className="proof-icon">👁️</span>
                <span className="proof-text">
                  <strong>{viewers}</strong> đang xem
                </span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key="registrations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="social-proof-item compact"
              >
                <span className="proof-icon">📝</span>
                <span className="proof-text">
                  <strong>{registrations}</strong> đăng ký hôm nay
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Expanded content - only show when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="social-proof-expanded"
              >
                <div className="recent-activity">
                  <div className="activity-header">Hoạt động gần đây:</div>
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="activity-item"
                    >
                      <span className="activity-icon">✨</span>
                      <span className="activity-text">
                        <strong>{activity.name}</strong> {activity.action}
                      </span>
                      <span className="activity-time">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProof;
