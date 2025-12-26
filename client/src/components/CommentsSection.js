import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import { getRelativeTime } from '../utils/timezone';
import ReactionsPicker from './ReactionsPicker';
import './CommentsSection.css';

const CommentsSection = ({ postId, comments: initialComments, userEmail, userName, onCommentAdded }) => {
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-section">
      {/* Add Comment */}
      {userEmail && (
        <form className="add-comment-form" onSubmit={handleSubmitComment}>
          <div className="comment-input-wrapper">
            <div className="comment-author-avatar-small">
              {(userName || userEmail?.split('@')[0] || 'U').charAt(0).toUpperCase()}
            </div>
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="comment-input"
              rows="1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            className="submit-comment-btn"
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
          </button>
        </form>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} userEmail={userEmail} />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentItem = ({ comment, userEmail }) => {
  const authorName = comment.author_name || comment.author_email?.split('@')[0] || 'Unknown';
  const timeAgo = getRelativeTime(comment.created_at);

  return (
    <div className="comment-item">
      <Link
        to={`/profile/${encodeURIComponent(comment.author_email)}`}
        className="comment-author-avatar"
      >
        {authorName.charAt(0).toUpperCase()}
      </Link>
      <div className="comment-content-wrapper">
        <div className="comment-bubble">
          <Link
            to={`/profile/${encodeURIComponent(comment.author_email)}`}
            className="comment-author-name"
          >
            {authorName}
          </Link>
          <div className="comment-text">{comment.content}</div>
        </div>
        <div className="comment-actions">
          <ReactionsPicker
            commentId={comment.id}
            userEmail={userEmail}
            onReactionChange={() => {}}
            reactionsCount={comment.likes_count || 0}
          />
          <span className="comment-time">{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
