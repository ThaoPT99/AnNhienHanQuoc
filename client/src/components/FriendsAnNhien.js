import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, getUserEmail, getUserName } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import AuthModal from './AuthModal';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { authenticatedFetch } from '../utils/auth';
import './CommunityFacebook.css';
import './FriendsAnNhien.css';

const FriendsAnNhien = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [activeTab, setActiveTab] = useState('following'); // 'following' or 'followers'
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  const userEmail = getUserEmail();
  const userName = getUserName() || userEmail?.split('@')[0] || 'User';
  const isAuthenticated = isLoggedIn();
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setAuthMode('login');
    } else {
      loadUserProfile();
      loadFriends();
      loadFollowingAndFollowers();
    }
  }, [isAuthenticated, activeTab]);

  // Load user profile
  const loadUserProfile = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`${API_URL}/api/social/profile/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const profile = await res.json();
        setUserProfile(profile);
      } else if (res.status === 404) {
        setUserProfile({ email: userEmail });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setUserProfile({ email: userEmail });
    }
  };

  // Load friends list for right sidebar
  const loadFriends = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setFriends(data || []);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  // Load following and followers
  const loadFollowingAndFollowers = async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      // Load following
      const followingRes = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
      if (followingRes.ok) {
        const followingData = await followingRes.json();
        let followingList = Array.isArray(followingData) ? followingData : [];
        
        // Add demo data if no friends
        if (followingList.length === 0) {
          followingList = getDemoFollowing();
        } else {
          // Merge with demo data for demonstration
          followingList = [...getDemoFollowing(), ...followingList];
        }
        
        setFollowing(followingList);
      } else {
        // Use demo data on error
        setFollowing(getDemoFollowing());
      }

      // Load followers
      const followersRes = await fetch(`${API_URL}/api/social/followers/${encodeURIComponent(userEmail)}`);
      if (followersRes.ok) {
        const followersData = await followersRes.json();
        let followersList = Array.isArray(followersData) ? followersData : [];
        
        // Add demo data if no followers
        if (followersList.length === 0) {
          followersList = getDemoFollowers();
        } else {
          // Merge with demo data for demonstration
          followersList = [...getDemoFollowers(), ...followersList];
        }
        
        setFollowers(followersList);
      } else {
        // Use demo data on error
        setFollowers(getDemoFollowers());
      }
    } catch (error) {
      console.error('Error loading friends:', error);
      // Use demo data on error
      setFollowing(getDemoFollowing());
      setFollowers(getDemoFollowers());
    } finally {
      setLoading(false);
    }
  };

  // Demo following data
  const getDemoFollowing = () => {
    return [
      {
        email: 'demo1@example.com',
        name: 'Nguyễn Văn A',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'demo2@example.com',
        name: 'Trần Thị B',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'demo3@example.com',
        name: 'Lê Văn C',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'demo4@example.com',
        name: 'Phạm Thị D',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'demo5@example.com',
        name: 'Hoàng Văn E',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'demo6@example.com',
        name: 'Vũ Thị F',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // Demo followers data
  const getDemoFollowers = () => {
    return [
      {
        email: 'follower1@example.com',
        name: 'Ngô Văn X',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'follower2@example.com',
        name: 'Đỗ Thị Y',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        email: 'follower3@example.com',
        name: 'Bùi Văn Z',
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // Handle unfollow
  const handleUnfollow = async (followingEmail) => {
    try {
      const res = await authenticatedFetch('/api/social/unfollow', {
        method: 'POST',
        body: JSON.stringify({ following_email: followingEmail })
      });

      if (res.ok) {
        setFollowing(prev => prev.filter(f => f.email !== followingEmail));
        showNotification('Thành công', 'Đã hủy theo dõi', 'success');
      } else {
        const error = await res.json();
        showNotification('Lỗi', error.error || 'Không thể hủy theo dõi', 'error');
      }
    } catch (error) {
      console.error('Error unfollowing:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    }
  };

  // Handle authentication success
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    loadUserProfile();
    loadFriends();
    loadFollowingAndFollowers();
  };

  // Filter friends based on search query
  const filteredFriends = (activeTab === 'following' ? following : followers).filter(friend => {
    if (!searchQuery.trim()) return true;
    const name = friend.name || friend.email?.split('@')[0] || '';
    const email = friend.email || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="community-facebook-page">
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {}}
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          requireAuth={true}
        />
      </div>
    );
  }

  return (
    <div className="community-facebook-page">
      {/* Header - Fixed ở top */}
      <header className="community-header-fb">
        <div className="community-header-fb-container">
          {/* Logo */}
          <Link to="/community" className="community-logo-fb">
            <span>Du Học An Nhiên</span>
          </Link>

          {/* Search bar */}
          <div className="community-search-fb">
            <div className="search-input-fb">
              <span className="search-icon-fb">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm trên An Nhiên" 
                className="search-input-field"
              />
            </div>
          </div>

          {/* Menu icons */}
          <div className="community-menu-fb">
            <Link to="/community" className="menu-icon-fb" title="Trang chủ">
              <span className="menu-icon-symbol">🏠</span>
            </Link>
            <Link to="/community/friends" className="menu-icon-fb active" title="Bạn bè">
              <span className="menu-icon-symbol">👥</span>
            </Link>
            <div className="menu-icon-fb" title="Video">
              <span className="menu-icon-symbol">📹</span>
            </div>
            <div className="menu-icon-fb" title="Marketplace">
              <span className="menu-icon-symbol">🛒</span>
            </div>
            <div className="menu-icon-fb" title="Nhóm">
              <span className="menu-icon-symbol">👥</span>
            </div>
            <div className="menu-icon-fb" title="Trò chơi">
              <span className="menu-icon-symbol">🎮</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="community-facebook-container">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <LeftSidebar 
            userEmail={userEmail}
            userName={userName}
            userProfile={userProfile}
            friends={friends}
            navigate={navigate}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            followingCount={following.length}
            followersCount={followers.length}
          />
        </aside>

        {/* Main Feed - Friends List */}
        <main className="main-feed">

          {/* Friends List */}
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: 'var(--fb-text-secondary)',
              fontSize: '15px'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid var(--fb-border)',
                borderTopColor: 'var(--fb-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              Đang tải danh sách bạn bè...
            </div>
          ) : filteredFriends.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: 'var(--fb-text-secondary)',
              fontSize: '15px'
            }}>
              {searchQuery ? 'Không tìm thấy bạn bè nào' : 
               (activeTab === 'following' ? 'Bạn chưa theo dõi ai' : 'Chưa có ai theo dõi bạn')}
            </div>
          ) : (
            <div className="friends-grid">
              {filteredFriends.map((friend) => (
                <div key={friend.email} className="friend-card">
                  <Link
                    to={`/community/profile/${encodeURIComponent(friend.email)}`}
                    className="friend-card-link"
                  >
                    <div className="friend-avatar-large">
                      {(friend.name || friend.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="friend-info">
                      <div className="friend-name">
                        {friend.name || friend.email?.split('@')[0] || 'Unknown'}
                      </div>
                      {friend.name && (
                        <div className="friend-email">{friend.email}</div>
                      )}
                    </div>
                  </Link>
                  {activeTab === 'following' && (
                    <button
                      className="friend-action-btn unfollow-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnfollow(friend.email);
                      }}
                    >
                      Hủy theo dõi
                    </button>
                  )}
                  {activeTab === 'followers' && (
                    <Link
                      to={`/community/profile/${encodeURIComponent(friend.email)}`}
                      className="friend-action-btn view-profile-btn"
                    >
                      Xem trang cá nhân
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <RightSidebar
            userEmail={userEmail}
            friends={friends}
            navigate={navigate}
          />
        </aside>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal && !isAuthenticated}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        requireAuth={true}
      />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FriendsAnNhien;

