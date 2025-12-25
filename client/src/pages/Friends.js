import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Friends.css';

const Friends = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('following'); // 'following' or 'followers'
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const loadFriends = async () => {
    if (!userEmail) return;
    
    setLoading(true);
    try {
      if (activeTab === 'following') {
        const res = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setFollowing(data || []);
        }
      } else {
        const res = await fetch(`${API_URL}/api/social/followers/${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setFollowers(data || []);
        }
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (friendEmail) => {
    if (!confirm(`Bạn có chắc muốn unfollow ${friendEmail}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/social/unfollow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_email: userEmail,
          following_email: friendEmail
        })
      });

      if (res.ok) {
        loadFriends();
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
    }
  };

  const handleFollow = async (followerEmail) => {
    try {
      const res = await fetch(`${API_URL}/api/social/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_email: userEmail,
          following_email: followerEmail
        })
      });

      if (res.ok) {
        loadFriends();
      }
    } catch (error) {
      console.error('Error following:', error);
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
              <h2>Đang follow ({filteredList.length})</h2>
              {filteredList.length === 0 ? (
                <div className="empty-state">
                  <p>Bạn chưa follow ai</p>
                  <Link to="/community" className="go-to-community-btn">
                    Đi đến Community để tìm bạn bè
                  </Link>
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
              <h2>Followers ({filteredList.length})</h2>
              {filteredList.length === 0 ? (
                <div className="empty-state">
                  <p>Chưa có ai follow bạn</p>
                  <p className="hint">Hãy tham gia Community và chia sẻ để có thêm followers!</p>
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

