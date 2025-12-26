import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedFetch } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import ReactionsPicker from './ReactionsPicker';
import CommentsSection from './CommentsSection';
import { getRelativeTime } from '../utils/timezone';
import './PostCard.css';

const PostCard = ({ post, userEmail, userName, onUpdate, navigate }) => {
  const [showComments, setShowComments] = useState(false);
  const [postLikes, setPostLikes] = useState(post.likes_count || 0);
  const [postComments, setPostComments] = useState(post.comments_count || 0);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [reactionsCount, setReactionsCount] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 300; // Maximum characters before showing "Xem thêm"

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const authorName = post.author_name || post.author_email?.split('@')[0] || 'Unknown';
  const timeAgo = getRelativeTime(post.created_at);

  // Load post reactions and comments
  React.useEffect(() => {
    loadPostReaction();
    if (showComments) {
      loadComments();
    }
  }, [post.id, showComments]);

  const loadPostReaction = async () => {
    if (!userEmail) return;
    try {
      // Get user's reaction
      const userRes = await fetch(
        `${API_URL}/api/social/reactions/user/${post.id}/null/${encodeURIComponent(userEmail)}`
      );
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData?.reaction) {
          setCurrentReaction(userData.reaction.reaction_type);
          setIsLiked(true);
        }
      }
      
      // Get reactions count
      const countRes = await fetch(
        `${API_URL}/api/social/reactions/${post.id}`
      );
      if (countRes.ok) {
        const countData = await countRes.json();
        // CountData should be an array of reactions with counts
        if (Array.isArray(countData)) {
          setReactionsCount(countData);
          const likesCount = countData
            .filter(r => r.reaction_type === 'like')
            .reduce((sum, r) => sum + (parseInt(r.count) || 0), 0);
          setPostLikes(likesCount);
        } else {
          setReactionsCount([]);
        }
      }
    } catch (error) {
      console.error('Error loading reaction:', error);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`${API_URL}/api/community/posts/${post.id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data || []);
        setPostComments(data?.length || 0);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleReactionChange = async (reactionType) => {
    const wasLiked = isLiked;
    const oldReaction = currentReaction;
    
    if (oldReaction === reactionType) {
      // Remove reaction
      setCurrentReaction(null);
      setIsLiked(false);
      setPostLikes(prev => Math.max(0, prev - 1));
    } else {
      // Change reaction
      if (!wasLiked) {
        setPostLikes(prev => prev + 1);
      }
      setCurrentReaction(reactionType);
      setIsLiked(true);
    }

    try {
      const method = oldReaction === reactionType ? 'DELETE' : 'POST';
      const endpoint = '/api/social/reactions';
      
      await authenticatedFetch(endpoint, {
        method,
        body: JSON.stringify({
          post_id: post.id,
          reaction_type: reactionType
        })
      });

      onUpdate?.(post.id, {
        likes_count: postLikes + (oldReaction === reactionType ? -1 : wasLiked ? 0 : 1)
      });
    } catch (error) {
      console.error('Error updating reaction:', error);
      // Revert on error
      setCurrentReaction(oldReaction);
      setIsLiked(wasLiked);
      setPostLikes(post.likes_count || 0);
    }
  };

  const handleCommentAdded = () => {
    loadComments();
    setPostComments(prev => prev + 1);
    onUpdate?.(post.id, { comments_count: postComments + 1 });
  };

  const formatContent = (content) => {
    if (!content) return '';
    // Simple formatting - can be enhanced with markdown or rich text
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <Link
          to={`/profile/${encodeURIComponent(post.author_email)}`}
          className="post-author"
        >
          <div className="post-author-avatar">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="post-author-info">
            <div className="post-author-name">{authorName}</div>
            <div className="post-time">{timeAgo}</div>
          </div>
        </Link>
        <button className="post-menu-btn">⋯</button>
      </div>

      {/* Post Content */}
      {post.title && (
        <div className="post-title">{post.title}</div>
      )}
      <div className="post-content">
        {expanded || !post.content || post.content.length <= MAX_LENGTH ? (
          formatContent(post.content)
        ) : (
          <>
            {formatContent(post.content.substring(0, MAX_LENGTH))}
            <span className="post-content-ellipsis">...</span>
          </>
        )}
        {post.content && post.content.length > MAX_LENGTH && (
          <button 
            className="post-see-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? 'Xem ít hơn' : 'Xem thêm'}
          </button>
        )}
      </div>

      {/* Post Images */}
      {/* Note: You'll need to add image_url field to posts table if not exists */}
      
      {/* Post Stats - Facebook Style */}
      {(() => {
        const totalReactions = reactionsCount?.reduce((sum, r) => sum + (r.count || 0), 0) || postLikes || 0;
        const hasReactions = totalReactions > 0;
        const hasComments = postComments > 0;
        
        if (!hasReactions && !hasComments) return null;
        
        return (
          <div className="post-stats">
            {hasReactions && (
              <div className="post-stats-left">
                <div className="post-reactions-icons">
                  {reactionsCount?.slice(0, 3).map((r, idx) => {
                    const reactionTypes = { 'like': '👍', 'love': '❤️', 'haha': '😂', 'wow': '😮', 'sad': '😢', 'angry': '😠' };
                    return (
                      <span key={r.reaction_type} className="reaction-icon-small" style={{ marginLeft: idx > 0 ? '-4px' : 0 }}>
                        {reactionTypes[r.reaction_type] || '👍'}
                      </span>
                    );
                  })}
                </div>
                <span className="post-stats-text">
                  {currentReaction ? 'Bạn' : ''}
                  {currentReaction && totalReactions > 1 ? ' và ' : ''}
                  {totalReactions > (currentReaction ? 1 : 0) ? `${totalReactions - (currentReaction ? 1 : 0)} người khác` : ''}
                  {!currentReaction && totalReactions > 0 ? `${totalReactions} người` : ''}
                </span>
              </div>
            )}
            {hasComments && (
              <div className="post-stats-right">
                <span className="post-stats-text">{postComments} bình luận</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Post Actions - Facebook Style */}
      <div className="post-actions">
        <div className="post-action-btn-wrapper">
          <ReactionsPicker
            postId={post.id}
            userEmail={userEmail}
            onReactionChange={handleReactionChange}
            currentReaction={currentReaction}
            reactionsCount={reactionsCount}
            buttonStyle="facebook"
          />
        </div>
        <button
          className="post-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowComments(!showComments);
          }}
        >
          <span className="post-action-icon">💬</span>
          <span className="post-action-label">Bình luận</span>
        </button>
        <button 
          className="post-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            // Share functionality can be added here
          }}
        >
          <span className="post-action-icon">🔗</span>
          <span className="post-action-label">Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="post-comments-wrapper"
          >
            <CommentsSection
              postId={post.id}
              comments={comments}
              userEmail={userEmail}
              userName={userName}
              onCommentAdded={handleCommentAdded}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
