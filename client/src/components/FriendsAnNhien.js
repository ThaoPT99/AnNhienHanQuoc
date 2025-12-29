import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  
  // User search states
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  
  // Mobile menu states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileMenuTab, setMobileMenuTab] = useState('friends'); // 'friends' or 'contacts'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

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

  // Update isMobile on resize and on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        setShowSearchForm(false);
        // Refresh friends list
        loadFollowingAndFollowers();
        loadFriends();
      } else {
        const data = await res.json();
        showNotification('Lỗi', data.error || 'Không thể follow user này', 'error');
      }
    } catch (error) {
      console.error('Error following user:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    }
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
            {/* Mobile Menu Button - In header */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="menu-icon-fb mobile-menu-btn"
              title="Menu"
              style={{
                backgroundColor: showMobileMenu ? '#1877f2' : 'transparent',
                color: showMobileMenu ? 'white' : 'inherit'
              }}
            >
              <span className="menu-icon-symbol">☰</span>
            </button>
            <Link to="/community" className="menu-icon-fb" title="Trang chủ">
              <span className="menu-icon-symbol">🏠</span>
            </Link>
            <Link to="/community/friends" className="menu-icon-fb active" title="Bạn bè">
              <span className="menu-icon-symbol">👥</span>
            </Link>
            <div className="menu-icon-fb menu-icon-hidden-mobile" title="Video">
              <span className="menu-icon-symbol">📹</span>
            </div>
            <div className="menu-icon-fb menu-icon-hidden-mobile" title="Marketplace">
              <span className="menu-icon-symbol">🛒</span>
            </div>
            <div className="menu-icon-fb menu-icon-hidden-mobile" title="Nhóm">
              <span className="menu-icon-symbol">👥</span>
            </div>
            <div className="menu-icon-fb menu-icon-hidden-mobile" title="Trò chơi">
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
          {/* Mobile Menu Button - Large button for mobile */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="mobile-menu-button-large"
          >
            <span style={{ fontSize: '20px' }}>☰</span>
            <span>Menu - Tìm kiếm bạn bè & Danh sách liên hệ</span>
          </button>

          {/* Mobile Menu Modal */}
          {showMobileMenu && (
            <div
              onClick={() => setShowMobileMenu(false)}
              className="mobile-menu-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999
              }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '280px',
                  maxWidth: '80%',
                  backgroundColor: 'white',
                  zIndex: 10000,
                  overflowY: 'auto',
                  boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid #e4e6eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Menu</h3>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '0',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e4e6eb' }}>
                  <button
                    onClick={() => setMobileMenuTab('friends')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderBottom: mobileMenuTab === 'friends' ? '3px solid #1877f2' : '3px solid transparent',
                      backgroundColor: 'transparent',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: mobileMenuTab === 'friends' ? '#1877f2' : '#65676b',
                      cursor: 'pointer'
                    }}
                  >
                    👥 Bạn bè
                  </button>
                  <button
                    onClick={() => setMobileMenuTab('contacts')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      borderBottom: mobileMenuTab === 'contacts' ? '3px solid #1877f2' : '3px solid transparent',
                      backgroundColor: 'transparent',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: mobileMenuTab === 'contacts' ? '#1877f2' : '#65676b',
                      cursor: 'pointer'
                    }}
                  >
                    📋 Liên hệ
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  {mobileMenuTab === 'friends' ? (
                    <div>
                      {/* User Profile Link */}
                      <Link
                        to={`/community/profile/${encodeURIComponent(userEmail || '')}`}
                        onClick={() => setShowMobileMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: '#333',
                          backgroundColor: '#f0f2f5',
                          marginBottom: '16px',
                          fontWeight: '600',
                          border: '1px solid #e4e6eb'
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#667eea',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {(userName || userEmail?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: '600' }}>
                            {userName || userEmail?.split('@')[0] || 'Trang cá nhân'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#65676b' }}>
                            Xem trang cá nhân
                          </div>
                        </div>
                      </Link>
                      
                      {/* Friends tabs */}
                      <div style={{ marginBottom: '16px' }}>
                        <button
                          onClick={() => {
                            setActiveTab('following');
                            setShowMobileMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '8px',
                            backgroundColor: activeTab === 'following' ? '#e7f3ff' : '#f0f2f5',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: activeTab === 'following' ? '#1877f2' : '#333',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span>👥</span>
                          <span>Đang theo dõi ({following.length})</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('followers');
                            setShowMobileMenu(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: activeTab === 'followers' ? '#e7f3ff' : '#f0f2f5',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '15px',
                            fontWeight: '600',
                            color: activeTab === 'followers' ? '#1877f2' : '#333',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <span>👥</span>
                          <span>Người theo dõi ({followers.length})</span>
                        </button>
                      </div>

                      {/* Search friends */}
                      <div style={{ marginBottom: '16px' }}>
                        <input
                          type="text"
                          placeholder="Tìm kiếm bạn bè..."
                          value={searchQuery || ''}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #ccd0d5',
                            borderRadius: '20px',
                            fontSize: '15px',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Contacts list */}
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                        Người liên hệ ({friends.length})
                      </h4>
                      {friends.length > 0 ? (
                        <div>
                          {friends.slice(0, 10).map((friend, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                if (window.startMessengerTextChat && friend.email) {
                                  window.startMessengerTextChat(friend.email, friend.name || friend.email.split('@')[0]);
                                  setShowMobileMenu(false);
                                }
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                marginBottom: '8px',
                                backgroundColor: '#f0f2f5'
                              }}
                            >
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#667eea',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600'
                              }}>
                                {(friend.name || friend.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontSize: '15px', color: '#333' }}>
                                {friend.name || friend.email?.split('@')[0] || 'Unknown'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#65676b' }}>
                          Chưa có bạn bè
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Search User Section */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => setShowSearchForm(!showSearchForm)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: showSearchForm ? '#667eea' : '#f0f2f5',
                color: showSearchForm ? 'white' : '#333',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>🔍</span>
              <span>{showSearchForm ? 'Ẩn tìm kiếm' : 'Tìm kiếm người dùng bằng email'}</span>
            </button>

            {showSearchForm && (
              <div style={{ marginTop: '16px' }}>
                <form onSubmit={handleSearchUser} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="email"
                      placeholder="Nhập email để tìm kiếm (ví dụ: user@example.com)"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      disabled={isSearching}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: '1px solid #ccd0d5',
                        borderRadius: '20px',
                        fontSize: '15px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isSearching || !searchEmail.trim()}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: isSearching || !searchEmail.trim() ? 'not-allowed' : 'pointer',
                        opacity: isSearching || !searchEmail.trim() ? 0.6 : 1
                      }}
                    >
                      {isSearching ? 'Đang tìm...' : 'Tìm'}
                    </button>
                  </div>
                </form>

                {/* Search Result */}
                {searchResult && (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f2f5',
                    borderRadius: '8px',
                    border: '1px solid #ccd0d5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {searchResult.name ? searchResult.name.charAt(0).toUpperCase() : searchResult.email.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                          {searchResult.name || searchResult.email.split('@')[0]}
                        </div>
                        <div style={{ fontSize: '14px', color: '#65676b' }}>
                          {searchResult.email}
                        </div>
                        {searchResult.bio && (
                          <div style={{ fontSize: '13px', color: '#8a8d91', marginTop: '4px' }}>
                            {searchResult.bio}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleFollowFromSearch(searchResult.email)}
                        disabled={following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase()) 
                            ? '#e4e6eb' 
                            : '#1877f2',
                          color: following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())
                            ? '#65676b'
                            : 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())
                            ? 'not-allowed'
                            : 'pointer'
                        }}
                      >
                        {following.some(f => f.email?.toLowerCase() === searchResult.email.toLowerCase())
                          ? 'Đã follow'
                          : 'Follow'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

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

