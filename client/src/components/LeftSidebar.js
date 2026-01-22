import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import './LeftSidebar.css';

const LeftSidebar = ({ userEmail, userName, userProfile, friends, navigate, activeTab, setActiveTab, searchQuery, setSearchQuery, followingCount, followersCount }) => {
  const displayName = userName || userEmail?.split('@')[0] || 'User';
  const location = useLocation();
  const isFriendsPage = location.pathname === '/community/friends';

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
    }
  };

  return (
    <div className="left-sidebar-content">
      {/* User Profile */}
      <Link 
        to={`/community/profile/${encodeURIComponent(userEmail || '')}`} 
        className="sidebar-user-profile"
      >
        <div className="sidebar-user-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="sidebar-user-name">{displayName}</span>
      </Link>

      {/* Friends Section - Only show on friends page */}
      {isFriendsPage && (
        <>
          <div className="sidebar-friends-title">Bạn bè</div>
          <div className="sidebar-friends-tabs">
            <button
              className={`sidebar-friends-tab ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              <span className="sidebar-friends-tab-icon">👥</span>
              <span className="sidebar-friends-tab-label">Bạn bè đang theo dõi ({followingCount || 0})</span>
            </button>
            <button
              className={`sidebar-friends-tab ${activeTab === 'followers' ? 'active' : ''}`}
              onClick={() => setActiveTab('followers')}
            >
              <span className="sidebar-friends-tab-icon">👥</span>
              <span className="sidebar-friends-tab-label">Người theo dõi ({followersCount || 0})</span>
            </button>
          </div>
          <div className="sidebar-friends-search">
            <input
              type="text"
              placeholder="Tìm kiếm bạn bè..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              className="sidebar-friends-search-input"
            />
          </div>
        </>
      )}

      {/* Menu Items - Chỉ hiển thị những item có chức năng thật */}
      {!isFriendsPage && (
        <Link to="/community/friends" className="sidebar-menu-item">
          <div className="sidebar-menu-icon">👥</div>
          <span className="sidebar-menu-label">Bạn bè</span>
        </Link>
      )}

      {/* Logout Button */}
      <div className="sidebar-menu-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
        <div className="sidebar-menu-icon">🚪</div>
        <span className="sidebar-menu-label">Đăng xuất</span>
      </div>
      
      {/* Additional menu items can be added here when features are implemented */}
      {/* Example:
      <Link to="/ai" className="sidebar-menu-item">
        <div className="sidebar-menu-icon">🤖</div>
        <span className="sidebar-menu-label">Meta AI</span>
      </Link>
      */}
      
      {/* Shortcuts Section - Hidden until API endpoint is ready */}
      {/* Future: Load shortcuts from API or database */}
      {false && (
        <div className="sidebar-shortcuts">
          <div className="sidebar-shortcuts-title">Lối tắt của bạn</div>
        </div>
      )}

      {/* Footer - Hidden until policy pages are created */}
      {/* Future: Add footer links when privacy/terms pages are available */}
      {false && (
        <div className="sidebar-footer">
          <div className="sidebar-footer-links">
            <button type="button" className="sidebar-footer-link">Quyền riêng tư</button>
            <span> · </span>
            <button type="button" className="sidebar-footer-link">Điều khoản</button>
            <span> · </span>
            <button type="button" className="sidebar-footer-link">Quảng cáo</button>
            <span> · </span>
            <button type="button" className="sidebar-footer-link">Lựa chọn quảng cáo</button>
            <span> · </span>
            <button type="button" className="sidebar-footer-link">Cookie</button>
            <span> · </span>
            <button type="button" className="sidebar-footer-link">Xem thêm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
