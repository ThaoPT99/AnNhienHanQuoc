import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isLoggedIn, getUserEmail, getUserName } from '../utils/auth';
import { getPoints } from '../utils/pointsSystem';
import { showNotification } from './NotificationCenterFacebook';
import CreatePostBox from './CreatePostBox';
import PostCard from './PostCard';
import './ProfilePageFacebook.css';

const ProfilePageFacebook = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followCounts, setFollowCounts] = useState({ followers_count: 0, following_count: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('posts'); // posts, about, friends, photos, dashboard
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    rank: null,
    badges: []
  });

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const currentUserEmail = getUserEmail() || '';
  const profileEmail = email ? decodeURIComponent(email) : currentUserEmail;

  useEffect(() => {
    setIsOwnProfile(profileEmail === currentUserEmail);
    loadProfile();
    if (isOwnProfile) {
      loadDashboardData();
    }
  }, [email, profileEmail]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Load profile
      const profileRes = await fetch(`${API_URL}/api/social/profile/${encodeURIComponent(profileEmail)}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        setEditForm(profileData);
      } else if (profileRes.status === 404) {
        setProfile({ email: profileEmail });
        setEditForm({ email: profileEmail });
      }

      // Load follow counts
      const countsRes = await fetch(`${API_URL}/api/social/follow-counts/${encodeURIComponent(profileEmail)}`);
      if (countsRes.ok) {
        const counts = await countsRes.json();
        setFollowCounts(counts);
      }

      // Check follow status
      if (currentUserEmail && profileEmail !== currentUserEmail) {
        const followRes = await fetch(
          `${API_URL}/api/social/follow-status/${encodeURIComponent(currentUserEmail)}/${encodeURIComponent(profileEmail)}`
        );
        if (followRes.ok) {
          const { isFollowing: following } = await followRes.json();
          setIsFollowing(following);
        }
      }

      // Load user posts
      loadUserPosts();
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/community/posts?author_email=${encodeURIComponent(profileEmail)}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const points = getPoints();
      const level = Math.floor(points / 500) + 1;
      const badges = JSON.parse(localStorage.getItem('userBadges') || '[]');
      
      let rank = null;
      if (profileEmail) {
        try {
          const rankResponse = await fetch(`${API_URL}/api/leaderboard/rank/${encodeURIComponent(profileEmail)}`);
          if (rankResponse.ok) {
            const rankData = await rankResponse.json();
            rank = rankData?.rank || null;
          }
        } catch (err) {
          console.error('Error loading rank:', err);
        }
      }

      setStats({ points, level, rank, badges });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/social/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setEditForm(updated);
        setEditing(false);
        showNotification('Thành công', 'Đã cập nhật profile', 'success');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Lỗi', 'Không thể lưu profile', 'error');
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
    <div className="profile-page-facebook">
      {/* Cover Photo */}
      <div className="profile-cover">
        {profile?.cover_photo ? (
          <img src={profile.cover_photo} alt="Cover" />
        ) : (
          <div className="cover-placeholder"></div>
        )}
        {isOwnProfile && (
          <button className="edit-cover-btn" onClick={() => showNotification('Thông báo', 'Tính năng đang phát triển', 'info')}>
            📷 Thêm ảnh bìa
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="profile-header-container">
        <div className="profile-info-section">
          <div className="profile-picture-container">
            <div className="profile-picture">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} />
              ) : (
                <div className="profile-picture-placeholder">{avatarInitial}</div>
              )}
              {isOwnProfile && (
                <button className="edit-profile-pic-btn" onClick={() => showNotification('Thông báo', 'Tính năng đang phát triển', 'info')}>
                  📷
                </button>
              )}
            </div>
          </div>

          <div className="profile-name-section">
            <h1>{displayName}</h1>
            {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
            <div className="profile-stats-fb">
              <span>{posts.length} bài viết</span>
              <span>{followCounts.followers_count || 0} người theo dõi</span>
              <span>{followCounts.following_count || 0} đang theo dõi</span>
            </div>
          </div>

          <div className="profile-actions-fb">
            {isOwnProfile ? (
              <>
                <button className="btn-edit-profile" onClick={() => setEditing(!editing)}>
                  ✏️ Chỉnh sửa trang cá nhân
                </button>
                <Link to="/community" className="btn-view-activity">
                  🏠 Trang chủ
                </Link>
              </>
            ) : (
              <>
                <Link to="/community" className="btn-view-activity" style={{ marginRight: '8px' }}>
                  🏠 Trang chủ
                </Link>
                <button
                  className={`btn-follow-fb ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi'}
                </button>
                <button 
                  className="btn-message" 
                  onClick={() => {
                    if (window.startMessengerTextChat) {
                      window.startMessengerTextChat(profileEmail, displayName);
                    }
                  }}
                >
                  💬 Nhắn tin
                </button>
                <button 
                  className="btn-video-call" 
                  onClick={() => {
                    if (window.startMessengerVideoCall) {
                      window.startMessengerVideoCall(profileEmail, displayName);
                    }
                  }}
                >
                  📞 Video call
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
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
          <button
            className={`profile-tab ${activeTab === 'friends' ? 'active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Bạn bè
          </button>
          {isOwnProfile && (
            <button
              className={`profile-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="profile-content-wrapper">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="sidebar-card">
            <h3>Giới thiệu</h3>
            {profile?.location && (
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.interests && (
              <div className="info-item">
                <span className="info-icon">❤️</span>
                <span>Sở thích: {profile.interests}</span>
              </div>
            )}
            {isOwnProfile && stats.points > 0 && (
              <div className="info-item">
                <span className="info-icon">⭐</span>
                <span>Điểm: {stats.points.toLocaleString()}</span>
              </div>
            )}
            {isOwnProfile && stats.level > 0 && (
              <div className="info-item">
                <span className="info-icon">🏆</span>
                <span>Level: {stats.level}</span>
              </div>
            )}
          </div>

          {isOwnProfile && stats.badges.length > 0 && (
            <div className="sidebar-card">
              <h3>Badges</h3>
              <div className="badges-list">
                {stats.badges.map((badge, i) => (
                  <div key={i} className="badge-item">
                    <span className="badge-icon">{badge.icon || '🏆'}</span>
                    <span className="badge-name">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="profile-main-content">
          {activeTab === 'posts' && (
            <div className="posts-tab">
              {isOwnProfile && (
                <CreatePostBox
                  userEmail={currentUserEmail}
                  userName={displayName}
                  userProfile={profile}
                  onPostCreated={handlePostCreated}
                />
              )}
              {posts.length === 0 ? (
                <div className="no-posts">
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
            <div className="about-tab">
              {editing ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="edit-profile-form"
                >
                  <h2>Chỉnh sửa thông tin</h2>
                  <div className="form-group">
                    <label>Tên hiển thị</label>
                    <input
                      type="text"
                      value={editForm.display_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      placeholder="Tên hiển thị"
                    />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      placeholder="Giới thiệu về bản thân"
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Địa điểm</label>
                    <input
                      type="text"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder="Ví dụ: Hà Nội, Việt Nam"
                    />
                  </div>
                  <div className="form-group">
                    <label>Sở thích</label>
                    <input
                      type="text"
                      value={editForm.interests || ''}
                      onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                      placeholder="Ví dụ: Du học, Tiếng Hàn, K-Pop"
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveProfile}>
                      💾 Lưu
                    </button>
                    <button className="btn-cancel" onClick={() => setEditing(false)}>
                      Hủy
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="about-content">
                  <h2>Giới thiệu</h2>
                  {profile?.bio && (
                    <div className="about-section">
                      <h3>Tiểu sử</h3>
                      <p>{profile.bio}</p>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="about-section">
                      <h3>Địa điểm</h3>
                      <p>📍 {profile.location}</p>
                    </div>
                  )}
                  {profile?.interests && (
                    <div className="about-section">
                      <h3>Sở thích</h3>
                      <div className="interests-list">
                        {profile.interests.split(',').map((interest, i) => (
                          <span key={i} className="interest-tag">{interest.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!profile?.bio && !profile?.location && !profile?.interests && (
                    <p className="no-info">Chưa có thông tin</p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="friends-tab">
              <div className="friends-stats">
                <h2>Bạn bè ({followCounts.following_count || 0})</h2>
                <Link to={`/friends?user=${encodeURIComponent(profileEmail)}`} className="see-all-friends">
                  Xem tất cả
                </Link>
              </div>
              {/* Friends list will be loaded here */}
            </div>
          )}

          {activeTab === 'dashboard' && isOwnProfile && (
            <div className="dashboard-tab">
              <h2>Dashboard của tôi</h2>
              <div className="dashboard-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.points.toLocaleString()}</div>
                    <div className="stat-label">Điểm</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <div className="stat-value">Level {stats.level}</div>
                    <div className="stat-label">Cấp độ</div>
                  </div>
                </div>
                {stats.rank && (
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <div className="stat-value">#{stats.rank}</div>
                      <div className="stat-label">Xếp hạng</div>
                    </div>
                  </div>
                )}
                <div className="stat-card">
                  <div className="stat-icon">🏅</div>
                  <div className="stat-info">
                    <div className="stat-value">{stats.badges.length}</div>
                    <div className="stat-label">Badges</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePageFacebook;
