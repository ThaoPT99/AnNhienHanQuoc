import React from 'react';
import { Link } from 'react-router-dom';
import './LeftSidebar.css';

const LeftSidebar = ({ userEmail, userName, userProfile, friends, navigate }) => {
  const userAvatar = userProfile?.avatar_url || null;
  const displayName = userProfile?.display_name || userName;

  return (
    <aside className="left-sidebar-content">
      {/* Profile Shortcut */}
      <Link to={`/profile/${encodeURIComponent(userEmail)}`} className="sidebar-profile-link">
        <div className="sidebar-profile">
          {userAvatar ? (
            <img src={userAvatar} alt={displayName} className="sidebar-avatar" />
          ) : (
            <div className="sidebar-avatar-placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="sidebar-profile-name">{displayName}</span>
        </div>
      </Link>

      {/* Friends Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="sidebar-icon">👥</span>
          <h3>Bạn bè</h3>
        </div>
        <Link to="/friends" className="sidebar-menu-item">
          <span className="sidebar-icon">👤</span>
          <span>Tìm bạn bè</span>
        </Link>
        <Link to="/friends" className="sidebar-menu-item">
          <span className="sidebar-icon">👥</span>
          <span>Đang follow ({friends.length})</span>
        </Link>
        <Link to="/friends?tab=followers" className="sidebar-menu-item">
          <span className="sidebar-icon">👥</span>
          <span>Followers</span>
        </Link>
      </div>

      {/* Groups Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="sidebar-icon">👥</span>
          <h3>Nhóm</h3>
        </div>
        <div className="sidebar-menu-item">
          <span className="sidebar-icon">🏫</span>
          <span>Du học Hàn Quốc</span>
        </div>
        <div className="sidebar-menu-item">
          <span className="sidebar-icon">📚</span>
          <span>Học bổng</span>
        </div>
        <div className="sidebar-menu-item">
          <span className="sidebar-icon">🏠</span>
          <span>Cuộc sống Hàn Quốc</span>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="sidebar-icon">⚡</span>
          <h3>Lối tắt</h3>
        </div>
        <Link to="/video-call" className="sidebar-menu-item">
          <span className="sidebar-icon">📞</span>
          <span>Video Call</span>
        </Link>
        <Link to="/dashboard" className="sidebar-menu-item">
          <span className="sidebar-icon">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/ai-matching" className="sidebar-menu-item">
          <span className="sidebar-icon">🤖</span>
          <span>AI Matching</span>
        </Link>
      </div>
    </aside>
  );
};

export default LeftSidebar;
