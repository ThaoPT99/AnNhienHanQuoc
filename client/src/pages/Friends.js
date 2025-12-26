import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { showNotification } from '../components/NotificationCenter';
import { authenticatedFetch } from '../utils/auth';
import './Friends.css';

const Friends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('following'); // 'following' or 'followers'
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (!userEmail) {
      alert('Vui lòng nhập email để xem danh sách bạn bè');
      navigate('/');
      return;
    }
    loadFriends();
  }, [userEmail, activeTab]);

  // Load both following and followers on mount
  useEffect(() => {
    if (!userEmail) return;
    
    const loadAllFriends = async () => {
      try {
        // Load following
        const followingRes = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
        if (followingRes.ok) {
          const followingData = await followingRes.json();
          const validFollowing = (followingData || []).filter(f => f && f.email);
          setFollowing(validFollowing);
          console.log('Loaded following on mount:', validFollowing.length);
        }

        // Load followers
        const followersRes = await fetch(`${API_URL}/api/social/followers/${encodeURIComponent(userEmail)}`);
        if (followersRes.ok) {
          const followersData = await followersRes.json();
          const validFollowers = (followersData || []).filter(f => f && f.email);
          setFollowers(validFollowers);
          console.log('Loaded followers on mount:', validFollowers.length);
        }
      } catch (error) {
        console.error('Error loading all friends:', error);
      }
    };

    loadAllFriends();
  }, [userEmail]);

  const loadFriends = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      if (activeTab === 'following') {
        const res = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          const validFriends = (data || []).filter(f => f && f.email);
          console.log('Loaded following:', validFriends.length, validFriends);
          setFollowing(validFriends);
        } else {
          console.error('Failed to load following:', res.status);
          setFollowing([]);
        }
      } else {
        const res = await fetch(`${API_URL}/api/social/followers/${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          const validFollowers = (data || []).filter(f => f && f.email);
          console.log('Loaded followers:', validFollowers.length, validFollowers);
          setFollowers(validFollowers);
        } else {
          console.error('Failed to load followers:', res.status);
          setFollowers([]);
        }
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      if (activeTab === 'following') {
        setFollowing([]);
      } else {
        setFollowers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (friendEmail) => {
    if (!window.confirm(`Bạn có chắc muốn unfollow ${friendEmail}?`)) return;

    try {
      const res = await authenticatedFetch('/api/social/unfollow', {
        method: 'POST',
        body: JSON.stringify({
          following_email: friendEmail
        })
      });

      if (res.ok) {
        showNotification('Thành công', `Đã unfollow ${friendEmail}`, 'success');
        loadFriends();
      } else {
        const data = await res.json();
        showNotification('Lỗi', data.error || 'Không thể unfollow', 'error');
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
      showNotification('Lỗi', 'Không thể unfollow user này', 'error');
    }
  };

  const handleFollow = async (followerEmail) => {
    try {
      const res = await authenticatedFetch('/api/social/follow', {
        method: 'POST',
        body: JSON.stringify({
          following_email: followerEmail
        })
      });

      if (res.ok) {
        showNotification('Thành công', `Đã follow ${followerEmail}`, 'success');
        loadFriends();
      } else {
        const data = await res.json();
        showNotification('Lỗi', data.error || 'Không thể follow user này', 'error');
      }
    } catch (error) {
      console.error('Error following:', error);
      showNotification('Lỗi', 'Không thể follow user này', 'error');
    }
  };

  const handleAddFriendByEmail = async (e) => {
    e.preventDefault();
    
    if (!friendEmail.trim()) {
      showNotification('Lỗi', 'Vui lòng nhập email', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(friendEmail.trim())) {
      showNotification('Lỗi', 'Email không hợp lệ', 'error');
      return;
    }

    // Check if trying to follow self
    if (friendEmail.trim().toLowerCase() === userEmail.toLowerCase()) {
      showNotification('Lỗi', 'Bạn không thể follow chính mình', 'error');
      return;
    }

    // Check if already following
    const isAlreadyFollowing = following.some(
      f => f.email?.toLowerCase() === friendEmail.trim().toLowerCase()
    );
    if (isAlreadyFollowing) {
      showNotification('Thông báo', 'Bạn đã follow user này rồi', 'info');
      return;
    }

    setAddingFriend(true);
    try {
      const res = await authenticatedFetch('/api/social/follow', {
        method: 'POST',
        body: JSON.stringify({
          following_email: friendEmail.trim()
        })
      });

      if (res.ok) {
        showNotification('Thành công', `Đã thêm bạn bè ${friendEmail.trim()}`, 'success');
        setFriendEmail('');
        setShowAddFriendForm(false);
        // Refresh friends list
        loadFriends();
      } else {
        const data = await res.json();
        showNotification('Lỗi', data.error || 'Không thể thêm bạn bè. Email có thể không tồn tại.', 'error');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
      setAddingFriend(false);
    }
  };

  const filteredList = activeTab === 'following' 
    ? following.filter(f => 
        f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : followers.filter(f => 
        f.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  if (loading) {
    return <div className="friends-page"><div className="loading">Đang tải...</div></div>;
  }

  return (
    <div className="friends-page">
      <SEO
        title="Bạn bè - Du học An Nhiên"
        description="Xem danh sách bạn bè và người follow bạn"
      />

      <div className="friends-container">
        <div className="friends-header">
          <h1>👥 Bạn bè</h1>
          <p>Quản lý danh sách bạn bè và kết nối với cộng đồng</p>
        </div>

        <div className="friends-tabs">
          <button
            className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            👤 Đang follow ({following.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            👥 Followers ({followers.length})
          </button>
        </div>

        <div className="friends-actions">
          <button
            className="btn-add-friend"
            onClick={() => setShowAddFriendForm(!showAddFriendForm)}
          >
            <span>➕</span>
            <span>Thêm bạn bè bằng email</span>
          </button>
        </div>

        {showAddFriendForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="add-friend-form-container"
          >
            <form onSubmit={handleAddFriendByEmail} className="add-friend-form">
              <div className="form-group">
                <label htmlFor="friend-email">Nhập email người bạn muốn kết bạn:</label>
                <div className="input-with-button">
                  <input
                    id="friend-email"
                    type="email"
                    placeholder="example@email.com"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    className="friend-email-input"
                    disabled={addingFriend}
                  />
                  <button
                    type="submit"
                    className="btn-submit-add"
                    disabled={addingFriend || !friendEmail.trim()}
                  >
                    {addingFriend ? 'Đang thêm...' : 'Thêm'}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="btn-cancel-add"
                onClick={() => {
                  setShowAddFriendForm(false);
                  setFriendEmail('');
                }}
                disabled={addingFriend}
              >
                Hủy
              </button>
            </form>
          </motion.div>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="friends-list-section">
          {activeTab === 'following' ? (
            <>
              <h2>Đang follow ({following.length})</h2>
              {following.length === 0 ? (
                <div className="empty-state">
                  <p>Bạn chưa follow ai</p>
                  <Link to="/community" className="go-to-community-btn">
                    Đi đến Community để tìm bạn bè
                  </Link>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="empty-state">
                  <p>Không tìm thấy bạn bè nào phù hợp với từ khóa "{searchQuery}"</p>
                  <button
                    className="go-to-community-btn"
                    onClick={() => setSearchQuery('')}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              ) : (
                <div className="friends-grid">
                  {filteredList.map((friend) => (
                    <motion.div
                      key={friend.email}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="friend-card"
                    >
                      <Link to={`/profile/${encodeURIComponent(friend.email)}`} className="friend-link">
                        <div className="friend-avatar">
                          {(friend.name || friend.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="friend-info">
                          <div className="friend-name">{friend.name || friend.email}</div>
                          <div className="friend-email">{friend.email}</div>
                        </div>
                      </Link>
                      <div className="friend-actions">
                        <button
                          className="btn-call-friend-small"
                          onClick={() => navigate(`/video-call?call=${encodeURIComponent(friend.email)}`)}
                          title="Gọi video"
                        >
                          📞
                        </button>
                        <button
                          className="btn-unfollow"
                          onClick={() => handleUnfollow(friend.email)}
                          title="Unfollow"
                        >
                          Unfollow
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <h2>Followers ({followers.length})</h2>
              {followers.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có ai follow bạn</p>
                  <p className="hint">Hãy tham gia Community và chia sẻ để có thêm followers!</p>
                </div>
              ) : filteredList.length === 0 ? (
                <div className="empty-state">
                  <p>Không tìm thấy follower nào phù hợp với từ khóa "{searchQuery}"</p>
                  <button
                    className="go-to-community-btn"
                    onClick={() => setSearchQuery('')}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              ) : (
                <div className="friends-grid">
                  {filteredList.map((follower) => (
                    <motion.div
                      key={follower.email}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="friend-card"
                    >
                      <Link to={`/profile/${encodeURIComponent(follower.email)}`} className="friend-link">
                        <div className="friend-avatar">
                          {(follower.name || follower.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="friend-info">
                          <div className="friend-name">{follower.name || follower.email}</div>
                          <div className="friend-email">{follower.email}</div>
                        </div>
                      </Link>
                      <div className="friend-actions">
                        <button
                          className="btn-call-friend-small"
                          onClick={() => navigate(`/video-call?call=${encodeURIComponent(follower.email)}`)}
                          title="Gọi video"
                        >
                          📞
                        </button>
                        <button
                          className="btn-follow-back"
                          onClick={() => handleFollow(follower.email)}
                          title="Follow back"
                        >
                          Follow back
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;



