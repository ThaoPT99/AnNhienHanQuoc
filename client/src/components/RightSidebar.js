import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RightSidebar.css';

const RightSidebar = ({ userEmail, friends, navigate }) => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Filter friends for online status (simplified - can be enhanced with WebSocket)
    setOnlineFriends(friends.slice(0, 5));
    // Set suggestions (can be enhanced with API)
    setSuggestions([]);
  }, [friends]);

  return (
    <aside className="right-sidebar-content">
      {/* Sponsored */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>Được tài trợ</h3>
        </div>
        <div className="sponsored-content">
          <div className="sponsored-item">
            <div className="sponsored-avatar">🎓</div>
            <div className="sponsored-info">
              <div className="sponsored-name">Du học An Nhiên</div>
              <div className="sponsored-tag">Trang được tài trợ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Online Friends */}
      {onlineFriends.length > 0 && (
        <div className="sidebar-widget">
          <div className="widget-header">
            <h3>Bạn bè đang online</h3>
            <button className="widget-see-all">Xem tất cả</button>
          </div>
          <div className="contacts-list">
            {onlineFriends.map((friend) => (
              <div key={friend.email} className="contact-item-wrapper">
                <Link
                  to={`/community/profile/${encodeURIComponent(friend.email)}`}
                  className="contact-item"
                >
                  <div className="contact-avatar-wrapper">
                    {friend.name ? (
                      <div className="contact-avatar">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="contact-avatar">
                        {friend.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="online-indicator"></span>
                  </div>
                  <span className="contact-name">{friend.name || friend.email}</span>
                </Link>
                <button
                  className="contact-video-call-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.startMessengerVideoCall) {
                      window.startMessengerVideoCall(friend.email, friend.name);
                    }
                  }}
                  title="Video call"
                >
                  📞
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="sidebar-widget">
          <div className="widget-header">
            <h3>Gợi ý kết bạn</h3>
          </div>
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.email} className="suggestion-item">
                <div className="suggestion-avatar">
                  {suggestion.name?.charAt(0) || suggestion.email.charAt(0)}
                </div>
                <div className="suggestion-info">
                  <div className="suggestion-name">{suggestion.name || suggestion.email}</div>
                  <button className="suggestion-add-btn">Thêm bạn</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Links */}
      <div className="sidebar-footer">
        <div className="footer-links">
          <a href="/">Trang chủ</a>
          <span>·</span>
          <a href="/about">Giới thiệu</a>
          <span>·</span>
          <a href="/contact">Liên hệ</a>
        </div>
        <div className="footer-copyright">
          <span>© 2025 Du học An Nhiên</span>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
