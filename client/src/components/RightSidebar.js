import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import './RightSidebar.css';

const RightSidebar = ({ userEmail, friends, navigate }) => {
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    // Filter friends for online status (simplified - can be enhanced with WebSocket)
    setOnlineFriends(friends.slice(0, 5));
    // Load friend requests
    if (userEmail) {
      loadFriendRequests();
    }
  }, [friends, userEmail]);

  // Load friend requests - people who follow you but you don't follow back
  const loadFriendRequests = async () => {
    if (!userEmail) return;
    
    setLoadingRequests(true);
    try {
      // Get followers (people who follow you)
      const followersRes = await fetch(`${API_URL}/api/social/followers/${encodeURIComponent(userEmail)}`);
      const followers = followersRes.ok ? await followersRes.json() : [];
      
      // Get following (people you follow)
      const followingRes = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
      const following = followingRes.ok ? await followingRes.json() : [];
      
      // Friend requests = followers who are not in following list
      const followingEmails = new Set((following || []).map(f => f.email));
      const requests = (followers || []).filter(f => f.email && !followingEmails.has(f.email));
      
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Accept friend request = follow them back
  const handleAcceptRequest = async (requestEmail, requestName) => {
    if (!userEmail) return;
    
    try {
      const res = await authenticatedFetch(`${API_URL}/api/social/follow`, {
        method: 'POST',
        body: JSON.stringify({
          following_email: requestEmail
        })
      });

      if (res.ok) {
        showNotification('Thành công', `Đã kết bạn với ${requestName || requestEmail}`, 'success');
        // Remove from requests list
        setFriendRequests(prev => prev.filter(r => r.email !== requestEmail));
        // Trigger refresh in parent component if callback exists
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('friendRequestAccepted', { detail: { email: requestEmail } }));
        }
      } else {
        const error = await res.json();
        showNotification('Lỗi', error.error || 'Không thể kết bạn', 'error');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    }
  };

  // Delete friend request = remove from list (just hide it, don't unfollow)
  const handleDeleteRequest = async (requestEmail) => {
    // Just remove from UI - they're still following you, you just don't see the request
    setFriendRequests(prev => prev.filter(r => r.email !== requestEmail));
    showNotification('Đã ẩn', 'Đã ẩn lời mời kết bạn', 'info');
  };

  return (
    <aside className="right-sidebar-content">
      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div className="sidebar-widget">
          <div className="widget-header">
            <h3>Lời mời kết bạn</h3>
            <button 
              className="widget-see-all"
              onClick={() => navigate('/friends?tab=requests')}
            >
              Xem tất cả
            </button>
          </div>
          <div className="friend-requests-list">
            {loadingRequests ? (
              <div className="loading-requests">Đang tải...</div>
            ) : (
              friendRequests.slice(0, 5).map((request) => {
                const requestName = request.name || request.display_name || request.email?.split('@')[0] || 'Người dùng';
                const requestInitial = requestName.charAt(0).toUpperCase();
                
                return (
                  <div key={request.email} className="friend-request-item">
                    <Link 
                      to={`/community/profile/${encodeURIComponent(request.email)}`}
                      className="friend-request-link"
                    >
                      <div className="friend-request-avatar">
                        {requestInitial}
                      </div>
                      <div className="friend-request-info">
                        <div className="friend-request-name">{requestName}</div>
                        <div className="friend-request-mutual">
                          {(() => {
                            // Simplified mutual friends - can be enhanced with proper API
                            // For now, just show a generic message
                            return 'Có thể bạn quen biết';
                          })()}
                        </div>
                      </div>
                    </Link>
                    <div className="friend-request-actions">
                      <button 
                        className="friend-request-confirm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAcceptRequest(request.email, requestName);
                        }}
                      >
                        Xác nhận
                      </button>
                      <button 
                        className="friend-request-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteRequest(request.email);
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Birthdays */}
      <div className="sidebar-widget">
        <div className="widget-header">
          <h3>Sinh nhật</h3>
        </div>
        <div className="birthdays-list">
          <div className="birthday-item">
            <span className="birthday-icon">🎁</span>
            <span className="birthday-text">Hôm nay là sinh nhật của <strong>Người dùng</strong> và 2 người khác.</span>
          </div>
        </div>
      </div>

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

      {/* Contacts */}
      {onlineFriends.length > 0 && (
        <div className="sidebar-widget">
          <div className="widget-header">
            <h3>Người liên hệ</h3>
            <div className="contacts-header-actions">
              <button className="contacts-search-btn" title="Tìm kiếm">🔍</button>
              <button className="contacts-menu-btn" title="Menu">⋯</button>
            </div>
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
                  className="contact-chat-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.startMessengerTextChat) {
                      window.startMessengerTextChat(friend.email, friend.name);
                    }
                  }}
                  title="Nhắn tin"
                >
                  💬
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
