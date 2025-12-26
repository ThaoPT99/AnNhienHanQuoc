import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { isLoggedIn, getUserEmail, getUserName } from '../utils/auth';
import { authenticatedFetch } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import AuthModal from './AuthModal';
import CreatePostBox from './CreatePostBox';
import PostCard from './PostCard';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
// MessengerChat is now rendered globally in App.js to maintain WebSocket connection
// import MessengerChat from './MessengerChat';
import './CommunityFacebook.css';

const CommunityFacebook = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
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
        // Profile doesn't exist yet, create empty one
        setUserProfile({ email: userEmail });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Set empty profile on error
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
        if (reset) {
          setPosts(data || []);
        } else {
          setPosts(prev => [...prev, ...(data || [])]);
        }
        setHasMore(data && data.length === 10);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      showNotification('Lỗi', 'Không thể tải bài viết', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
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

  // Handle post update (like, comment, etc)
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
      {/* Facebook-style Header Menu */}
      <header className="community-header-fb">
        <div className="community-header-fb-container">
          {/* Left: Logo */}
          <Link to="/community" className="community-logo-fb">
            <div className="community-logo-icon-fb">🇰🇷</div>
            <span className="community-logo-text-fb">Du học An Nhiên</span>
          </Link>

          {/* Center: Search (placeholder for now) */}
          <div className="community-search-fb">
            <div className="search-input-fb">
              <span className="search-icon-fb">🔍</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm trên Cộng đồng" 
                className="search-input-field"
                disabled
              />
            </div>
          </div>

          {/* Right: Menu Icons */}
          <div className="community-menu-fb">
            <Link 
              to="/community" 
              className="menu-icon-fb active"
              title="Trang chủ"
            >
              <span className="menu-icon-symbol">🏠</span>
            </Link>
            {/* Placeholder for future menu items */}
            <div className="menu-icon-fb" title="Video" style={{ opacity: 0.3 }}>
              <span className="menu-icon-symbol">📹</span>
            </div>
            <div className="menu-icon-fb" title="Marketplace" style={{ opacity: 0.3 }}>
              <span className="menu-icon-symbol">🛒</span>
            </div>
            <div className="menu-icon-fb" title="Nhóm" style={{ opacity: 0.3 }}>
              <span className="menu-icon-symbol">👥</span>
            </div>
            <div className="menu-icon-fb" title="Menu" style={{ opacity: 0.3 }}>
              <span className="menu-icon-symbol">☰</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="community-facebook-container">
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
          {/* Create Post Box */}
          <CreatePostBox
            userEmail={userEmail}
            userName={userName}
            userProfile={userProfile}
            onPostCreated={handlePostCreated}
          />

          {/* Posts Feed */}
          {loading && posts.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải bài viết...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <p>Chưa có bài viết nào. Hãy bắt đầu chia sẻ!</p>
            </div>
          ) : (
            <div className="posts-feed">
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
                <div className="loading-more">
                  <div className="loading-spinner"></div>
                  <span>Đang tải thêm...</span>
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <div className="no-more-posts">
                  <p>Đã hiển thị tất cả bài viết</p>
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

      {/* Auth Modal - hidden if authenticated */}
      <AuthModal
        isOpen={showAuthModal && !isAuthenticated}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        requireAuth={true}
      />

      {/* Messenger Chat - now rendered globally in App.js to maintain WebSocket connection */}
    </div>
  );
};

export default CommunityFacebook;
