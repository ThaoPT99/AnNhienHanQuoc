import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { isLoggedIn, getUserEmail, getUserName } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import AuthModal from './AuthModal';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import CreatePostBox from './CreatePostBox';
import PostCard from './PostCard';
import './CommunityFacebook.css';

const CommunityAnNhien = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [friends, setFriends] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  
  // Mobile menu states
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mobileMenuTab, setMobileMenuTab] = useState('menu'); // 'menu' or 'contacts'
  const location = useLocation();

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
      loadPosts(true);
    }
  }, [isAuthenticated]);

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

  // Load friends list
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

  // Load posts
  const loadPosts = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    }

    try {
      const params = new URLSearchParams({
        limit: '10',
        offset: reset ? '0' : ((page - 1) * 10).toString(),
        sort: 'newest'
      });

      const res = await fetch(`${API_URL}/api/community/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        let postsData = data || [];
        
        // Only add demo posts if no real posts exist
        if (reset && postsData.length === 0) {
          postsData = getDemoPosts();
        }
        
        if (reset) {
          setPosts(postsData);
        } else {
          setPosts(prev => [...prev, ...(postsData || [])]);
        }
        setHasMore(data && data.length === 10);
      } else {
        // If API fails, use demo posts only if reset
        if (reset) {
          setPosts(getDemoPosts());
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      // On error, use demo posts
      if (reset) {
        setPosts(getDemoPosts());
      } else {
        showNotification('Lỗi', 'Không thể tải bài viết', 'error');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Demo posts with reactions and comments
  const getDemoPosts = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'demo-1',
        title: 'Hàn Lập mất mấy giây để đánh bại Vưu đạo hữu đây các đạo hữu',
        content: 'Các bạn có thấy không, Hàn Lập đã thể hiện sức mạnh tuyệt đối trong trận đấu này. Tôi nghĩ đây là một trong những khoảnh khắc đáng nhớ nhất của series! 😎',
        author_name: 'Zinn Tiên Vực',
        author_email: 'demo1@example.com',
        created_at: oneHourAgo.toISOString(),
        likes_count: 107,
        comments_count: 34,
        category: 'Tất cả',
        type: 'discussion',
        _demo: true,
        _demoReactions: [
          { reaction_type: 'like', count: 65 },
          { reaction_type: 'haha', count: 42 }
        ],
        _demoComments: 34
      },
      {
        id: 'demo-2',
        title: 'Có nên đi du học Hàn Quốc năm 2026? Góc nhìn thực tế cho người mới bắt đầu',
        content: 'Chào mọi người,\n\nTôi muốn chia sẻ một góc nhìn thực tế về việc du học Hàn Quốc năm 2026, đặc biệt là dành cho những người đang phân vân chưa quyết định được.\n\nĐầu tiên, về chi phí...',
        author_name: 'dthuytrang3139',
        author_email: 'demo2@example.com',
        created_at: twoDaysAgo.toISOString(),
        likes_count: 45,
        comments_count: 12,
        category: 'Tất cả',
        type: 'experience',
        _demo: true,
        _demoReactions: [
          { reaction_type: 'like', count: 30 },
          { reaction_type: 'love', count: 15 }
        ],
        _demoComments: 12
      },
      {
        id: 'demo-3',
        title: 'Du học An Nhiên tư vấn nhiệt tình',
        content: 'Mình vừa được tư vấn tại Du học An Nhiên và thấy rất hài lòng. Các bạn tư vấn viên giải thích rất rõ ràng về lộ trình du học, cách chọn trường phù hợp, chuẩn bị hồ sơ và chi phí minh bạch. Cảm ơn team An Nhiên rất nhiều!',
        author_name: 'phantruongthao199',
        author_email: 'demo3@example.com',
        created_at: twoDaysAgo.toISOString(),
        likes_count: 28,
        comments_count: 8,
        category: 'Tất cả',
        type: 'discussion',
        _demo: true,
        _demoReactions: [
          { reaction_type: 'like', count: 20 },
          { reaction_type: 'love', count: 8 }
        ],
        _demoComments: 8
      }
    ];
  };

  // Load more posts on scroll
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        if (!loadingMore && hasMore && !loading) {
          setLoadingMore(true);
          setPage(prev => prev + 1);
          loadPosts(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, loading, isAuthenticated]);

  // Handle post creation
  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    showNotification('Thành công', 'Đã đăng bài viết', 'success');
  };

  // Handle post update
  const handlePostUpdate = (postId, updates) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  // Handle authentication success
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    loadUserProfile();
    loadFriends();
    loadPosts(true);
  };

  // Show login modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="community-an-nhien-page">
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
            <Link to="/community" className="menu-icon-fb active" title="Trang chủ">
              <span className="menu-icon-symbol">🏠</span>
            </Link>
            <Link to="/community/friends" className="menu-icon-fb" title="Bạn bè">
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
      <div className="community-an-nhien-container">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <LeftSidebar 
            userEmail={userEmail}
            userName={userName}
            userProfile={userProfile}
            friends={friends}
            navigate={navigate}
          />
        </aside>

        {/* Main Feed */}
        <main className="main-feed">
          {/* Mobile Menu Modal */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mobile-menu-overlay"
                onClick={() => setShowMobileMenu(false)}
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
                      onClick={() => setMobileMenuTab('menu')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: 'none',
                        borderBottom: mobileMenuTab === 'menu' ? '3px solid #1877f2' : '3px solid transparent',
                        backgroundColor: 'transparent',
                        fontSize: '15px',
                        fontWeight: '600',
                        color: mobileMenuTab === 'menu' ? '#1877f2' : '#65676b',
                        cursor: 'pointer'
                      }}
                    >
                      📋 Menu
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
                      👥 Liên hệ
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px' }}>
                    {mobileMenuTab === 'menu' ? (
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
                            color: location.pathname === `/community/profile/${encodeURIComponent(userEmail || '')}` ? '#1877f2' : '#333',
                            backgroundColor: location.pathname === `/community/profile/${encodeURIComponent(userEmail || '')}` ? '#e7f3ff' : '#f0f2f5',
                            marginBottom: '8px',
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
                        
                        <div style={{ height: '8px' }}></div>
                        
                        <Link
                          to="/community"
                          onClick={() => setShowMobileMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: location.pathname === '/community' ? '#1877f2' : '#333',
                            backgroundColor: location.pathname === '/community' ? '#e7f3ff' : '#f0f2f5',
                            marginBottom: '8px',
                            fontWeight: '600'
                          }}
                        >
                          <span>🏠</span>
                          <span>Trang chủ</span>
                        </Link>
                        <Link
                          to="/community/friends"
                          onClick={() => setShowMobileMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: location.pathname === '/community/friends' ? '#1877f2' : '#333',
                            backgroundColor: location.pathname === '/community/friends' ? '#e7f3ff' : '#f0f2f5',
                            marginBottom: '8px',
                            fontWeight: '600'
                          }}
                        >
                          <span>👥</span>
                          <span>Bạn bè</span>
                        </Link>
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
              </motion.div>
            )}
          </AnimatePresence>

          <CreatePostBox
            userEmail={userEmail}
            userName={userName}
            userProfile={userProfile}
            onPostCreated={handlePostCreated}
          />

          {/* Posts Feed */}
          {loading && posts.length === 0 ? (
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
              Đang tải bài viết...
            </div>
          ) : posts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px', 
              color: 'var(--fb-text-secondary)',
              fontSize: '15px'
            }}>
              Chưa có bài viết nào. Hãy bắt đầu chia sẻ! ✨
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  userEmail={userEmail}
                  userName={userName}
                  onUpdate={handlePostUpdate}
                  navigate={navigate}
                />
              ))}
              {loadingMore && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--fb-text-secondary)', fontSize: '15px' }}>
                  Đang tải thêm...
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--fb-text-secondary)', fontSize: '15px' }}>
                  Đã hiển thị tất cả bài viết 🎉
                </div>
              )}
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

export default CommunityAnNhien;
