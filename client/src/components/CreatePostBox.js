import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { showNotification } from './NotificationCenter';
import './CreatePostBox.css';

const CreatePostBox = ({ userEmail, userName, userProfile, onPostCreated }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const userAvatar = userProfile?.avatar_url || null;
  const displayName = userProfile?.display_name || userName;

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Max 4 images
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
  };

  const removeImage = (index) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && selectedImages.length === 0) {
      showNotification('Lỗi', 'Vui lòng nhập nội dung hoặc chọn ảnh', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('title', content.slice(0, 100) || 'Bài viết mới');
      formData.append('content', content.trim() || '');
      formData.append('type', 'discussion');
      formData.append('category', 'Tất cả');
      formData.append('author_name', displayName);

      // Append images
      selectedImages.forEach((image, index) => {
        formData.append(`images`, image.file);
      });

      // Get auth token
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        showNotification('Lỗi', 'Vui lòng đăng nhập để đăng bài', 'error');
        return;
      }
      
      // For now, don't send images (API may not support it yet)
      // Just send text content
      const response = await fetch(`${API_URL}/api/community/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-token': token
        },
        body: JSON.stringify({
          title: content.slice(0, 100) || 'Bài viết mới',
          content: content.trim() || '',
          type: 'discussion',
          category: 'Tất cả',
          author_name: displayName
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        onPostCreated(newPost);
        setContent('');
        setSelectedImages([]);
        setIsExpanded(false);
        showNotification('Thành công', 'Đã đăng bài viết', 'success');
      } else {
        const error = await response.json();
        showNotification('Lỗi', error.error || 'Không thể đăng bài viết', 'error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification('Lỗi', 'Không thể kết nối đến server', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setSelectedImages(selectedImages.forEach(img => URL.revokeObjectURL(img.preview)));
    setSelectedImages([]);
    setIsExpanded(false);
  };

  return (
    <div className="create-post-box">
      <div className="create-post-header">
        {userAvatar ? (
          <img src={userAvatar} alt={displayName} className="post-box-avatar" />
        ) : (
          <div className="post-box-avatar-placeholder">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="post-box-input-wrapper" onClick={handleFocus}>
          <input
            type="text"
            placeholder={`${displayName}, bạn đang nghĩ gì?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            className="post-box-input"
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="create-post-expanded"
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết gì đó..."
              className="post-box-textarea"
              autoFocus
            />

            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <div className="post-images-preview">
                {selectedImages.map((image, index) => (
                  <div key={index} className="post-image-preview-item">
                    <img src={image.preview} alt={`Preview ${index}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="create-post-actions">
              <div className="post-action-buttons">
                <button
                  type="button"
                  className="post-action-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="post-action-icon">📷</span>
                  <span>Ảnh/Video</span>
                </button>
                <button type="button" className="post-action-btn">
                  <span className="post-action-icon">😊</span>
                  <span>Cảm xúc</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="post-submit-buttons">
                <button
                  type="button"
                  className="post-cancel-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="post-submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!content.trim() && selectedImages.length === 0)}
                >
                  {isSubmitting ? 'Đang đăng...' : 'Đăng'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isExpanded && (
        <div className="create-post-footer">
          <button
            type="button"
            className="create-post-footer-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="footer-icon">📷</span>
            <span>Ảnh/Video</span>
          </button>
          <button type="button" className="create-post-footer-btn">
            <span className="footer-icon">😊</span>
            <span>Cảm xúc</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default CreatePostBox;
