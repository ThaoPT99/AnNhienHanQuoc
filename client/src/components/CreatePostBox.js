import React, { useState } from 'react';
import { authenticatedFetch } from '../utils/auth';
import { showNotification } from './NotificationCenter';
import './CreatePostBox.css';

const CreatePostBox = ({ userEmail, userName, userProfile, onPostCreated }) => {
  const [showForm, setShowForm] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = userName || userEmail?.split('@')[0] || 'Bạn';

  const handleInputClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) {
      showNotification('Lỗi', 'Vui lòng nhập tiêu đề và nội dung', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authenticatedFetch('/api/community/posts', {
        method: 'POST',
        body: JSON.stringify({
          author_name: userName || userEmail?.split('@')[0] || 'User',
          title: postTitle.trim(),
          content: postContent.trim(),
          category: 'Tất cả',
          type: 'discussion'
        })
      });

      if (res.ok) {
        const newPost = await res.json();
        setPostTitle('');
        setPostContent('');
        setShowForm(false);
        onPostCreated?.(newPost);
        showNotification('Thành công', 'Đã đăng bài viết', 'success');
      } else {
        const error = await res.json();
        showNotification('Lỗi', error.error || 'Không thể đăng bài viết', 'error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForm) {
    return (
      <div className="create-post-box">
        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            type="text"
            placeholder="Tiêu đề bài viết..."
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="create-post-form-input"
            maxLength={200}
            required
          />
          <textarea
            placeholder={`${displayName} ơi, bạn đang nghĩ gì thế?`}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="create-post-form-input"
            style={{ minHeight: '120px' }}
            maxLength={5000}
            required
          />
          <div className="create-post-form-actions">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setPostTitle('');
                setPostContent('');
              }}
              className="create-post-form-btn create-post-form-btn-cancel"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="create-post-form-btn create-post-form-btn-submit"
            >
              {isSubmitting ? 'Đang đăng...' : 'Đăng'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="create-post-box">
      <div className="create-post-wrapper">
        <div className="create-post-avatar">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="create-post-input-wrapper" onClick={handleInputClick}>
          <input 
            type="text" 
            placeholder={`${displayName} ơi, bạn đang nghĩ gì thế?`}
            className="create-post-input"
            readOnly
          />
          <div className="create-post-actions">
            <button 
              className="create-post-action-btn" 
              title="Video"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(true);
              }}
            >
              📹
            </button>
            <button 
              className="create-post-action-btn" 
              title="Video trực tiếp"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(true);
              }}
            >
              📺
            </button>
            <button 
              className="create-post-action-btn" 
              title="Reels"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowForm(true);
              }}
            >
              🎬
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
