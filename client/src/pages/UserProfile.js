import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './UserProfile.css';

const UserProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [followCounts, setFollowCounts] = useState({ followers_count: 0, following_count: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const currentUserEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    loadProfile();
  }, [email]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profileEmail = decodeURIComponent(email);
      setIsOwnProfile(profileEmail === currentUserEmail);

      // Load profile
      const profileRes = await fetch(`${API_URL}/api/social/profile/${encodeURIComponent(profileEmail)}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
        setEditForm(profileData);
      } else if (profileRes.status === 404) {
        // Profile doesn't exist yet, create empty one
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
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUserEmail) {
      alert('Vui lòng đăng nhập để follow');
      return;
    }

    try {
      const endpoint = isFollowing ? '/api/social/unfollow' : '/api/social/follow';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_email: currentUserEmail,
          following_email: decodeURIComponent(email)
        })
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        loadProfile(); // Reload to update counts
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
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return <div className="user-profile-page"><div className="loading">Đang tải...</div></div>;
  }

  return (
    <div className="user-profile-page">
      <SEO
        title={`${profile?.display_name || 'User'} - Du học An Nhiên`}
        description={`Profile của ${profile?.display_name || email}`}
      />

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name || email} />
            ) : (
              <div className="avatar-placeholder">
                {(profile?.display_name || email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1>{profile?.display_name || email?.split('@')[0] || 'User'}</h1>
            <p className="profile-email">{email}</p>
            {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
            {profile?.location && <p className="profile-location">📍 {profile.location}</p>}

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{followCounts.followers_count || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{followCounts.following_count || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <div className="profile-actions">
              {isOwnProfile ? (
                <button className="btn-edit" onClick={() => setEditing(!editing)}>
                  {editing ? 'Hủy' : '✏️ Chỉnh sửa'}
                </button>
              ) : (
                <button
                  className={`btn-follow ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? '✓ Đang follow' : '+ Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="edit-form"
          >
            <h2>Chỉnh sửa profile</h2>
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
            <button className="btn-save" onClick={handleSaveProfile}>
              💾 Lưu
            </button>
          </motion.div>
        )}

        {profile?.interests && (
          <div className="profile-section">
            <h2>Sở thích</h2>
            <div className="interests-tags">
              {profile.interests.split(',').map((interest, i) => (
                <span key={i} className="tag">{interest.trim()}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

