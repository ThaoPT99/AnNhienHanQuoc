import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserEmail } from '../utils/auth';
import { showNotification } from './NotificationCenterFacebook';
import CreatePostBox from './CreatePostBox';
import PostCard from './PostCard';
import './ProfilePageFacebook.css';
import './CommunityFacebook.css';

const ProfilePageAnNhien = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followCounts, setFollowCounts] = useState({ followers_count: 156, following_count: 89 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const currentUserEmail = getUserEmail() || '';
  const profileEmail = email ? decodeURIComponent(email) : currentUserEmail;

  // Demo data
  const getDemoProfile = () => ({
    email: profileEmail,
    display_name: profileEmail?.split('@')[0] || 'User',
    bio: 'Du học sinh Hàn Quốc | Yêu thích văn hóa và ngôn ngữ Hàn | Đang theo đuổi ước mơ học tập tại Seoul ✨',
    location: 'Seoul, Hàn Quốc',
    interests: 'Du học, Tiếng Hàn, K-Pop, Ẩm thực Hàn Quốc'
  });

  const getDemoPosts = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    
    return [
      {
        id: 'demo-post-1',
        title: 'Kinh nghiệm apply học bổng tại Hàn Quốc',
        content: 'Mình vừa nhận được học bổng 100% tại đại học Seoul! Chia sẻ với các bạn một số tips:\n\n1. Chuẩn bị hồ sơ thật kỹ\n2. Viết essay hay và chân thành\n3. Chuẩn bị phỏng vấn tốt\n\nGood luck các bạn! 🎓✨',
        author_name: profileEmail?.split('@')[0] || 'User',
        author_email: profileEmail,
        created_at: oneHourAgo.toISOString(),
        likes_count: 245,
        comments_count: 18,
        _demo: true
      },
      {
        id: 'demo-post-2',
        title: 'Cuộc sống du học sinh tại Seoul',
        content: 'Đã 6 tháng rồi kể từ ngày mình đặt chân đến Hàn Quốc. Cuộc sống ở đây thật sự rất thú vị! Ẩm thực, văn hóa, con người... tất cả đều tuyệt vời. Dù có những lúc nhớ nhà nhưng mình không hối hận về quyết định này. Các bạn đang có ý định du học thì cứ mạnh dạn lên nhé! 💪🇰🇷',
        author_name: profileEmail?.split('@')[0] || 'User',
        author_email: profileEmail,
        created_at: twoDaysAgo.toISOString(),
        likes_count: 189,
        comments_count: 25,
        _demo: true
      },
      {
        id: 'demo-post-3',
        title: 'Topik 6 đạt được sau 1 năm học tiếng Hàn',
        content: 'Cuối cùng cũng đạt được mục tiêu! TOPIK 6 không dễ nhưng nếu bạn chăm chỉ và có phương pháp đúng thì chắc chắn làm được. Mình sẽ chia sẻ lộ trình học trong bài viết tiếp theo. Các bạn muốn biết gì thì comment nhé! 📚🎯',
        author_name: profileEmail?.split('@')[0] || 'User',
        author_email: profileEmail,
        created_at: fiveDaysAgo.toISOString(),
        likes_count: 312,
        comments_count: 42,
        _demo: true
      }
    ];
  };

  useEffect(() => {
    setIsOwnProfile(profileEmail === currentUserEmail);
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, profileEmail]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profileRes = await fetch(`${API_URL}/api/social/profile/${encodeURIComponent(profileEmail)}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      } else {
        setProfile(getDemoProfile());
      }

      const countsRes = await fetch(`${API_URL}/api/social/follow-counts/${encodeURIComponent(profileEmail)}`);
      if (countsRes.ok) {
        const counts = await countsRes.json();
        setFollowCounts(counts);
      }

      if (currentUserEmail && profileEmail !== currentUserEmail) {
        const followRes = await fetch(
          `${API_URL}/api/social/follow-status/${encodeURIComponent(currentUserEmail)}/${encodeURIComponent(profileEmail)}`
        );
        if (followRes.ok) {
          const { isFollowing: following } = await followRes.json();
          setIsFollowing(following);
        }
      }

      loadUserPosts();
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(getDemoProfile());
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/community/posts?author_email=${encodeURIComponent(profileEmail)}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        let postsData = Array.isArray(data) ? data : [];
        if (postsData.length === 0) {
          postsData = getDemoPosts();
        }
        setPosts(postsData);
      } else {
        setPosts(getDemoPosts());
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts(getDemoPosts());
    }
  };

  const handleFollow = async () => {
    if (!currentUserEmail) {
      showNotification('Lỗi', 'Vui lòng đăng nhập để follow', 'error');
      return;
    }
    try {
      const endpoint = isFollowing ? '/api/social/unfollow' : '/api/social/follow';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_email: currentUserEmail,
          following_email: profileEmail
        })
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        loadProfile();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (loading) {
    return (
      <div className="profile-page-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const displayName = profile?.display_name || profileEmail?.split('@')[0] || 'User';
  const avatarInitial = (profile?.display_name || profileEmail || 'U').charAt(0).toUpperCase();

  return (
    <div className="profile-page-an-nhien">
      {/* Header */}
      <header className="community-header-fb">
        <div className="community-header-fb-container">
          <Link to="/community" className="community-logo-fb">
            <span>Du Học An Nhiên</span>
          </Link>
          <div className="community-search-fb">
            <div className="search-input-fb">
              <span className="search-icon-fb">🔍</span>
              <input type="text" placeholder="Tìm kiếm trên An Nhiên" className="search-input-field" />
            </div>
          </div>
          <div className="community-menu-fb">
            <Link to="/community" className="menu-icon-fb" title="Trang chủ">
              <span className="menu-icon-symbol">🏠</span>
            </Link>
            <Link to="/community/friends" className="menu-icon-fb" title="Bạn bè">
              <span className="menu-icon-symbol">👥</span>
            </Link>
            <div className="menu-icon-fb" title="Video"><span className="menu-icon-symbol">📹</span></div>
            <div className="menu-icon-fb" title="Marketplace"><span className="menu-icon-symbol">🛒</span></div>
            <div className="menu-icon-fb" title="Nhóm"><span className="menu-icon-symbol">👥</span></div>
            <div className="menu-icon-fb" title="Trò chơi"><span className="menu-icon-symbol">🎮</span></div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="profile-main-container">
        {/* Cover Photo */}
        <div className="profile-cover">
          <div className="cover-placeholder"></div>
          {isOwnProfile && (
            <button className="edit-cover-btn" onClick={() => showNotification('Thông báo', 'Tính năng đang phát triển', 'info')}>
              📷 Thêm ảnh bìa
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="profile-info-section">
          <div className="profile-avatar-large">
            <div className="profile-avatar-circle">{avatarInitial}</div>
            {isOwnProfile && (
              <button className="edit-avatar-btn" onClick={() => showNotification('Thông báo', 'Tính năng đang phát triển', 'info')}>
                📷
              </button>
            )}
          </div>

          <div className="profile-details">
            <h1 className="profile-name">{displayName}</h1>
            {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
            
            <div className="profile-stats-row">
              <div className="stat-item">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Bài viết</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{followCounts.followers_count || 0}</span>
                <span className="stat-label">Người theo dõi</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{followCounts.following_count || 0}</span>
                <span className="stat-label">Đang theo dõi</span>
              </div>
            </div>

            <div className="profile-actions-row">
              {isOwnProfile ? (
                <Link to="/community" className="btn-primary-action">
                  🏠 Về trang chủ
                </Link>
              ) : (
                <>
                  <button className={`btn-follow ${isFollowing ? 'following' : ''}`} onClick={handleFollow}>
                    {isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi'}
                  </button>
                  <Link to="/community" className="btn-secondary-action">
                    🏠 Trang chủ
                  </Link>
                </>
              )}
            </div>

            {profile?.location && (
              <div className="profile-info-item">
                <span className="info-icon">📍</span>
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.interests && (
              <div className="profile-info-item">
                <span className="info-icon">❤️</span>
                <span>{profile.interests}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs-container">
          <button
            className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Bài viết
          </button>
          <button
            className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            Giới thiệu
          </button>
        </div>

        {/* Content */}
        <div className="profile-content-area">
          {activeTab === 'posts' && (
            <div className="posts-section">
              {isOwnProfile && (
                <CreatePostBox
                  userEmail={currentUserEmail}
                  userName={displayName}
                  userProfile={profile}
                  onPostCreated={handlePostCreated}
                />
              )}
              
              {posts.length === 0 ? (
                <div className="no-posts-message">
                  <p>Chưa có bài viết nào</p>
                </div>
              ) : (
                <div className="posts-list">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      userEmail={currentUserEmail}
                      userName={displayName}
                      onUpdate={() => loadUserPosts()}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="about-section">
              <div className="about-card">
                <h2>Giới thiệu</h2>
                {profile?.bio ? (
                  <p className="about-bio">{profile.bio}</p>
                ) : (
                  <p className="no-info">Chưa có thông tin giới thiệu</p>
                )}
              </div>

              {profile?.location && (
                <div className="about-card">
                  <h3>📍 Địa điểm</h3>
                  <p>{profile.location}</p>
                </div>
              )}

              {profile?.interests && (
                <div className="about-card">
                  <h3>❤️ Sở thích</h3>
                  <div className="interests-tags">
                    {profile.interests.split(',').map((interest, i) => (
                      <span key={i} className="interest-tag">{interest.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageAnNhien;
