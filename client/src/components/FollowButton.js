import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import './FollowButton.css';

const FollowButton = ({ followerEmail, followingEmail, onFollowChange }) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    if (followerEmail && followingEmail) {
      checkFollowStatus();
    }
  }, [followerEmail, followingEmail]);

  const checkFollowStatus = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/social/follow-status/${encodeURIComponent(followerEmail)}/${encodeURIComponent(followingEmail)}`
      );
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing || false);
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn()) {
      showNotification('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để follow người khác', 'info');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!followerEmail) {
      showNotification('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để follow người khác', 'info');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isFollowing ? '/api/social/unfollow' : '/api/social/follow';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_email: followerEmail,
          following_email: followingEmail
        })
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        if (onFollowChange) {
          onFollowChange();
        }
        showNotification(
          isFollowing ? 'Đã unfollow' : 'Đã follow',
          `Bạn đã ${isFollowing ? 'unfollow' : 'follow'} ${followingEmail}`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !followerEmail || !followingEmail) {
    return null;
  }

  return (
    <button
      className={`follow-btn-small ${isFollowing ? 'following' : ''}`}
      onClick={handleFollow}
      title={isFollowing ? 'Unfollow' : 'Follow'}
    >
      {isFollowing ? '✓' : '+'}
    </button>
  );
};

export default FollowButton;

