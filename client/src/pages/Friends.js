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
  
  // User search states
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);

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

  // Search user by email
  const handleSearchUser = async (e) => {
    e.preventDefault();
    
    if (!searchEmail.trim()) {
      showNotification('Lỗi', 'Vui lòng nhập email để tìm kiếm', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchEmail.trim())) {
      showNotification('Lỗi', 'Email không hợp lệ', 'error');
      return;
    }

    // Check if searching self
    if (searchEmail.trim().toLowerCase() === userEmail.toLowerCase()) {
      showNotification('Thông báo', 'Đây là email của bạn', 'info');
      return;
    }

    setIsSearching(true);
    setSearchResult(null);
    
    try {
      const res = await fetch(`${API_URL}/api/social/search/user?email=${encodeURIComponent(searchEmail.trim())}`);
      
      if (res.ok) {
        const userData = await res.json();
        setSearchResult(userData);
      } else {
        const data = await res.json();
        showNotification('Không tìm thấy', data.error || 'Không tìm thấy user với email này', 'info');
        setSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching user:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Follow user from search result
  const handleFollowFromSearch = async (email) => {
    // Check if already following
    const isAlreadyFollowing = following.some(
      f => f.email?.toLowerCase() === email.toLowerCase()
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
          following_email: email
        })
      });

      if (res.ok) {
        showNotification('Thành công', `Đã follow ${email}`, 'success');
        setSearchResult(null);
        setSearchEmail('');
        // Refresh friends list
        loadFriends();
      } else {
        const data = await res.json();
        showNotification('Lỗi', data.error || 'Không thể follow user này', 'error');
      }
    } catch (error) {
      console.error('Error following user:', error);
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
            onClick={() => {
              setShowAddFriendForm(!showAddFriendForm);
              setShowSearchForm(false);
            }}
          >
            <span>➕</span>
            <span>Thêm bạn bè bằng email</span>
          </button>
          <button
            className="btn-add-friend"
            onClick={() => {
              setShowSearchForm(!showSearchForm);
              setShowAddFriendForm(false);
            }}
            style={{ marginLeft: '10px' }}
          >
            <span>🔍</span>
            <span>Tìm kiếm người dùng</span>
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

        {/* User Search Form */}
        {showSearchForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="add-friend-form-container"
          >
            <form onSubmit={handleSearchUser} className="add-friend-form">
              <div className="form-group">
                <label htmlFor="search-email">🔍 Tìm kiếm người dùng bằng email:</label>
                <div className="input-with-button">
                  <input
                    id="search-email"
                    type="email"
                    placeholder="example@email.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="friend-email-input"
                    disabled={isSearching}
                  />
                  <button
                    type="submit"
                    className="btn-submit-add"
                    disabled={isSearching || !searchEmail.trim()}
                  >
                    {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="btn-cancel-add"
                onClick={() => {
                  setShowSearchForm(false);
                  setSearchEmail('');
                  setSearchResult(null);
                }}
                disabled={isSearching}
              >
                Hủy
              </button>
            </form>

            {/* Search Result */}
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="search-result-card"
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}
                  >
                    {searchResult.name ? searchResult.name.charAt(0).toUpperCase() : searchResult.email.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>
                      {searchResult.name || searchResult.email.split('@')[0]}
                    </h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      {searchResult.email}
                    </p>
                    {searchResult.bio && (
                      <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '13px' }}>
                        {searchResult.bio}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleFollowFromSearch(searchResult.email)}
                    disabled={addingFriend || following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())}
                    style={{
                      padding: '8px 20px',
                      backgroundColor: following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase()) 
                        ? '#ccc' 
                        : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: addingFriend || following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())
                        ? 'not-allowed'
                        : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    {following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())
                      ? 'Đã follow'
                      : addingFriend
                      ? 'Đang thêm...'
                      : 'Follow'}
                  </button>
                </div>
              </motion.div>
            )}
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



