import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import { getRelativeTime } from '../utils/timezone';
import './CommentsSection.css';

const CommentsSection = ({ postId, comments: initialComments, userEmail, userName, onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const loadComments = React.useCallback(async () => {
    try {
      // Use the correct endpoint - GET /api/community/posts/:id returns post with comments
      const res = await fetch(`${API_URL}/api/community/posts/${postId}`);
      if (res.ok) {
        const postData = await res.json();
        // Extract comments from post data
        const commentsData = postData.comments || [];
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } else if (res.status === 404) {
        // Post not found, set empty comments
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  }, [postId, API_URL]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await authenticatedFetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: newComment.trim(),
          author_name: userName || userEmail?.split('@')[0]
        })
      });

      if (res.ok) {
        const comment = await res.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
        onCommentAdded?.();
        showNotification('Thành công', 'Đã thêm bình luận', 'success');
      } else {
        const error = await res.json();
        showNotification('Lỗi', error.error || 'Không thể thêm bình luận', 'error');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    }
  };

  const displayName = userName || userEmail?.split('@')[0] || 'Bạn';

  return (
    <div className="comments-section">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} userEmail={userEmail} />
          ))}
        </div>
      )}

      {/* Add Comment */}
      {userEmail && (
        <form className="add-comment-form" onSubmit={handleSubmitComment}>
          <div className="comment-input-wrapper">
            <div className="comment-author-avatar-small">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`Trả lời dưới tên ${displayName}...`}
              className="comment-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(e);
                }
              }}
            />
          </div>
        </form>
      )}
    </div>
  );
};

const CommentItem = ({ comment, userEmail }) => {
  const authorName = comment.author_name || comment.author_email?.split('@')[0] || 'Unknown';
  const timeAgo = comment.created_at ? getRelativeTime(comment.created_at) : 'Vừa xong';

  return (
    <div className="comment-item">
      <Link
        to={`/community/profile/${encodeURIComponent(comment.author_email)}`}
        className="comment-author-avatar"
      >
        {authorName.charAt(0).toUpperCase()}
      </Link>
      <div className="comment-content-wrapper">
        <div className="comment-bubble">
          <Link
            to={`/community/profile/${encodeURIComponent(comment.author_email)}`}
            className="comment-author-name"
          >
            {authorName}
          </Link>
          <span className="comment-text">{comment.content}</span>
        </div>
        <div className="comment-actions">
          <button className="comment-action-btn">Thích</button>
          <button className="comment-action-btn">Trả lời</button>
          <span className="comment-time">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
