import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRelativeTime } from '../utils/timezone';
import { authenticatedFetch } from '../utils/auth';
import ReactionsPicker from './ReactionsPicker';
import CommentsSection from './CommentsSection';
import './PostCard.css';

const PostCard = ({ post, userEmail, userName, onUpdate, navigate }) => {
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState([]);
  const [postLikes, setPostLikes] = useState(post.likes_count || 0);
  const [postComments, setPostComments] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 300;

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const authorName = post.author_name || post.author_email?.split('@')[0] || 'Unknown';
  const timeAgo = getRelativeTime(post.created_at);

  useEffect(() => {
    // For demo posts, use demo data
    if (post._demo) {
      setReactionsCount(post._demoReactions || []);
      setPostLikes(post.likes_count || 0);
      setPostComments(post._demoComments || 0);
    } else {
      loadPostReaction();
      loadCommentsCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id, userEmail, post._demo]);

  const loadPostReaction = async () => {
    try {
      // Load user's reaction if logged in
      if (userEmail) {
        try {
          const userRes = await fetch(
            `${API_URL}/api/social/reactions/user/${post.id}/null/${encodeURIComponent(userEmail)}`
          );
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData?.reaction) {
              setCurrentReaction(userData.reaction.reaction_type);
            }
          }
        } catch (err) {
          console.error('Error loading user reaction:', err);
        }
      }
      
      // Load all reactions count
      const countRes = await fetch(`${API_URL}/api/social/reactions/${post.id}`);
      if (countRes.ok) {
        const countData = await countRes.json();
        if (Array.isArray(countData)) {
          setReactionsCount(countData);
          const totalReactions = countData
            .reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);
          setPostLikes(totalReactions);
        } else if (countData && typeof countData === 'object') {
          // Handle different API response formats
          const reactionsArray = Object.entries(countData).map(([type, count]) => ({
            reaction_type: type,
            count: parseInt(count) || 0
          }));
          setReactionsCount(reactionsArray);
          const totalReactions = reactionsArray
            .reduce((sum, r) => sum + r.count, 0);
          setPostLikes(totalReactions);
        }
      }
    } catch (error) {
      console.error('Error loading reaction:', error);
    }
  };

  const loadCommentsCount = async () => {
    try {
      // Use the correct endpoint - GET /api/community/posts/:id returns post with comments
      const res = await fetch(`${API_URL}/api/community/posts/${post.id}`);
      if (res.ok) {
        const postData = await res.json();
        if (postData.comments && Array.isArray(postData.comments)) {
          setPostComments(postData.comments.length);
        } else if (postData.comments_count !== undefined) {
          setPostComments(postData.comments_count);
        }
      } else if (res.status === 404) {
        // Post not found, set to 0
        setPostComments(0);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      // On error, try to use comments_count from post object if available
      if (post.comments_count !== undefined) {
        setPostComments(post.comments_count);
      }
    }
  };

  const handleReactionChange = async (reactionType) => {
    const oldReaction = currentReaction;
    
    if (oldReaction === reactionType) {
      setCurrentReaction(null);
      setPostLikes(prev => Math.max(0, prev - 1));
    } else {
      if (!oldReaction) {
        setPostLikes(prev => prev + 1);
      }
      setCurrentReaction(reactionType);
    }

    try {
      const method = oldReaction === reactionType ? 'DELETE' : 'POST';
      await authenticatedFetch('/api/social/reactions', {
        method,
        body: JSON.stringify({
          post_id: post.id,
          reaction_type: reactionType
        })
      });

      onUpdate?.(post.id, {
        likes_count: postLikes + (oldReaction === reactionType ? -1 : oldReaction ? 0 : 1)
      });
      
      loadPostReaction();
    } catch (error) {
      console.error('Error updating reaction:', error);
      setCurrentReaction(oldReaction);
      setPostLikes(post.likes_count || 0);
    }
  };

  const handleCommentAdded = () => {
    setPostComments(prev => prev + 1);
    loadCommentsCount();
    onUpdate?.(post.id, { comments_count: postComments + 1 });
  };

  const formatContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const displayContent = post.content || '';
  const fullContentLength = post.title ? (post.title.length + (post.content || '').length + 2) : (post.content || '').length;

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <Link
          to={`/community/profile/${encodeURIComponent(post.author_email)}`}
          className="post-author-info"
        >
          <div className="post-author-avatar">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="post-author-details">
            <span className="post-author-name">{authorName}</span>
            <div className="post-time">
              {timeAgo}
              <span className="post-time-icon">🌐</span>
            </div>
          </div>
        </Link>
        <button className="post-menu-btn">⋯</button>
      </div>

      {/* Post Title */}
      {post.title && (
        <div className="post-title">
          {post.title}
        </div>
      )}

      {/* Post Content */}
      <div className="post-content">
        {expanded || !displayContent || fullContentLength <= MAX_LENGTH ? (
          formatContent(post.content || '')
        ) : (
          <>
            {formatContent((post.content || '').substring(0, Math.max(0, MAX_LENGTH - (post.title ? post.title.length + 2 : 0))))}
            <span className="post-content-ellipsis">...</span>
          </>
        )}
        {fullContentLength > MAX_LENGTH && (
          <span 
            className="post-see-more"
            onClick={() => setExpanded(!expanded)}
            style={{ marginLeft: '4px' }}
          >
            {expanded ? 'Xem ít hơn' : 'Xem thêm'}
          </span>
        )}
      </div>

      {/* Post Stats - Reactions and Comments Count */}
      {(postLikes > 0 || postComments > 0) && (
        <div className="post-stats">
          {postLikes > 0 && (
            <div className="post-stats-reactions">
              <div className="post-reactions-icons">
                {reactionsCount
                  .filter(r => parseInt(r.count) > 0)
                  .slice(0, 3)
                  .map((reaction, index) => {
                    const emojiMap = {
                      'like': '👍',
                      'love': '❤️',
                      'haha': '😂',
                      'wow': '😮',
                      'sad': '😢',
                      'angry': '😠'
                    };
                    return (
                      <span key={index} className="reaction-icon-small">
                        {emojiMap[reaction.reaction_type] || '👍'}
                      </span>
                    );
                  })}
              </div>
              <span className="post-stats-text">
                {postLikes}
              </span>
            </div>
          )}
          {postComments > 0 && (
            <div className="post-stats-comments">
              <span className="post-stats-text">
                {postComments} bình luận
              </span>
            </div>
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="post-actions">
        <ReactionsPicker
          postId={post.id}
          userEmail={userEmail}
          onReactionChange={handleReactionChange}
          currentReaction={currentReaction}
          reactionsCount={reactionsCount}
          buttonStyle="an-nhien"
        />
        <button className="post-action-btn">
          <span className="post-action-icon">💬</span>
          <span>Bình luận</span>
        </button>
        <button className="post-action-btn">
          <span className="post-action-icon">🔗</span>
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="post-comments-wrapper">
        <CommentsSection
          postId={post.id}
          comments={[]}
          userEmail={userEmail}
          userName={userName}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
};

export default PostCard;
