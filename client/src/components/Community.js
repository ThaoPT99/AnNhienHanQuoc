import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addPoints, showPointsNotification } from '../utils/pointsSystem';
import { getRelativeTime } from '../utils/timezone';
import ReactionsPicker from './ReactionsPicker';
import FollowButton from './FollowButton';
import { showNotification } from './NotificationCenter';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [modalKey, setModalKey] = useState(0); // Key to force modal remount
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('resource_download_email') || '';
  });
  const [emailSubmitted, setEmailSubmitted] = useState(() => {
    return !!localStorage.getItem('resource_download_email');
  });

  const categories = ['Tất cả', 'Học bổng', 'Cuộc sống', 'Học tiếng', 'Visa', 'Tuyển dụng'];

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  
  // Log API URL on mount for debugging
  useEffect(() => {
    console.log('🔗 Community Component mounted');
    console.log('🔗 API URL:', API_URL);
    console.log('🔗 Environment:', process.env.NODE_ENV);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load posts from API when filters change
  useEffect(() => {
    setPage(1);
    setPosts([]);
    loadPosts(true);
  }, [activeTab, selectedCategory, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload posts when search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        // Filter existing posts client-side
        loadPosts(true);
      } else {
        // Reload from server if search is cleared
        loadPosts(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load more posts when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        if (!loadingMore && hasMore && !loading) {
          loadMorePosts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    }
    
    try {
      const params = new URLSearchParams({
        type: activeTab === 'discussions' ? 'discussion' : activeTab === 'questions' ? 'question' : 'experience',
        ...(selectedCategory !== 'Tất cả' && { category: selectedCategory }),
        sort: sortBy,
        limit: '20',
        offset: '0'
      });
      
      const url = `${API_URL}/api/community/posts?${params}`;
      console.log('📤 Loading posts from:', url);
      
      const response = await fetch(url);
      console.log('📥 Response status:', response.status, response.statusText);
      
      if (response.ok) {
        let data = await response.json();
        console.log('✅ Loaded posts:', data.length, 'items');
        
        // Client-side search filtering
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          data = data.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query) ||
            (post.tags && post.tags.toLowerCase().includes(query))
          );
        }
        
        setPosts(data);
        setHasMore(data.length >= 20);
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        setPosts([]);
      }
    } catch (error) {
      console.error('❌ Error loading posts:', error);
      console.error('API_URL:', API_URL);
      // Don't show alert, just log and show empty state
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        type: activeTab === 'discussions' ? 'discussion' : activeTab === 'questions' ? 'question' : 'experience',
        ...(selectedCategory !== 'Tất cả' && { category: selectedCategory }),
        sort: sortBy,
        limit: '20',
        offset: (page * 20).toString()
      });
      
      const response = await fetch(`${API_URL}/api/community/posts?${params}`);
      if (response.ok) {
        let data = await response.json();
        
        // Client-side search filtering
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          data = data.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.content.toLowerCase().includes(query) ||
            (post.tags && post.tags.toLowerCase().includes(query))
          );
        }
        
        if (data.length > 0) {
          setPosts(prev => [...prev, ...data]);
          setPage(prev => prev + 1);
          setHasMore(data.length >= 20);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const formatTime = (dateString) => {
    return getRelativeTime(dateString);
  };

  // Extract mentions from text (format: @email@domain.com)
  const extractMentions = (text) => {
    const mentionRegex = /@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return [...new Set(mentions)]; // Remove duplicates
  };

  const handleReaction = async (postId, commentId, reactionType, isAdding) => {
    if (!userEmail) {
      alert('Vui lòng nhập email để tham gia cộng đồng');
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      const endpoint = `${API_URL}/api/social/reactions`;
      const method = isAdding ? 'POST' : 'DELETE';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId || null,
          comment_id: commentId || null,
          user_email: userEmail,
          reaction_type: reactionType
        })
      });

      if (response.ok) {
        loadPosts(); // Reload posts
        
        // Add points for reacting (only when adding, not removing)
        if (isAdding) {
          const pointsResult = addPoints(5, 'community_like');
          if (pointsResult.badgeAwarded) {
            showPointsNotification(5, pointsResult.badgeAwarded);
          } else {
            showPointsNotification(5);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleViewPost = async (post, scrollToComments = false) => {
    // Increment modal key to force remount and reload comments
    setModalKey(prev => prev + 1);
    
    // Always load fresh post details (including comments) from API
    try {
      console.log('📤 Loading post details:', post.id, 'scrollToComments:', scrollToComments);
      const response = await fetch(`${API_URL}/api/community/posts/${post.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Post details loaded:', data);
        // Set selectedPost with fresh data including comments
        setSelectedPost({ ...post, ...data });
        
        // If scrollToComments is true, scroll to comment form after modal opens
        if (scrollToComments) {
          setTimeout(() => {
            const modal = document.querySelector('.post-modal');
            if (modal) {
              const commentForm = modal.querySelector('.comment-form, .comment-form-placeholder');
              if (commentForm) {
                commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const textarea = commentForm.querySelector('textarea');
                if (textarea && userEmail) {
                  setTimeout(() => textarea.focus(), 300);
                } else if (!userEmail) {
                  setTimeout(() => {
                    alert('Vui lòng nhập email để tham gia bình luận');
                  }, 300);
                }
              }
            }
          }, 500);
        }
      } else {
        // If API fails, still set the post (fallback)
        setSelectedPost(post);
      }
    } catch (error) {
      console.error('Error loading post details:', error);
      // If error, still set the post (fallback)
      setSelectedPost(post);
    }
  };

  const handleComment = async (postId, commentContent) => {
    if (!userEmail) {
      alert('Vui lòng nhập email để tham gia cộng đồng');
      throw new Error('Email required');
    }

    if (!commentContent.trim()) {
      alert('Vui lòng nhập nội dung comment');
      throw new Error('Comment content required');
    }

    try {
      console.log('📤 Submitting comment:', { postId, commentContent: commentContent.substring(0, 50) });
      
      const response = await fetch(`${API_URL}/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: userEmail.split('@')[0] || 'Người dùng',
          author_email: userEmail,
          content: commentContent
        })
      });

      console.log('📥 Comment response status:', response.status);

      if (response.ok) {
        const newComment = await response.json();
        console.log('✅ Comment created:', newComment);
        
        // Extract and create mentions
        const mentions = extractMentions(commentContent);
        if (mentions.length > 0) {
          const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
          for (const mentionedEmail of mentions) {
            try {
              await fetch(`${API_URL}/api/social/mentions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  post_id: postId,
                  comment_id: newComment.id,
                  mentioned_email: mentionedEmail,
                  mentioned_by_email: userEmail
                })
              });
              
              // Show notification to mentioned user (if they're viewing)
              showNotification(
                `@${mentionedEmail.split('@')[0]}`,
                `${userEmail.split('@')[0]} đã mention bạn trong một comment`,
                'info',
                '💬'
              );
            } catch (err) {
              console.error('Error creating mention:', err);
            }
          }
        }
        
        // Reload post with comments
        if (selectedPost && selectedPost.id === postId) {
          setTimeout(() => {
            handleViewPost(selectedPost);
          }, 300);
        }
        
        // Add points for commenting
        const pointsResult = addPoints(10, 'community_comment');
        if (pointsResult.badgeAwarded) {
          showPointsNotification(10, pointsResult.badgeAwarded);
        } else {
          showPointsNotification(10);
        }
        
        return newComment; // Return success
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Comment error:', errorData);
        alert(errorData.error || `Không thể gửi bình luận (${response.status}). Vui lòng thử lại.`);
        throw new Error(errorData.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      if (error.message !== 'Email required' && error.message !== 'Comment content required') {
        alert(`Có lỗi xảy ra: ${error.message}. Vui lòng thử lại.`);
      }
      throw error; // Re-throw to let caller handle
    }
  };

  const handleCreatePost = async (postData) => {
    if (!userEmail) {
      alert('Vui lòng nhập email để tham gia cộng đồng');
      return;
    }

    try {
      const postPayload = {
        author_name: postData.author_name || userEmail.split('@')[0] || 'Người dùng',
        author_email: userEmail,
        title: postData.title,
        content: postData.content,
        category: postData.category || 'Tất cả',
        tags: postData.tags || [],
        type: activeTab === 'discussions' ? 'discussion' : activeTab === 'questions' ? 'question' : 'experience'
      };
      
      console.log('📤 Creating post:', { API_URL, payload: postPayload });
      
      const response = await fetch(`${API_URL}/api/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      console.log('📥 Response status:', response.status, response.statusText);

      if (response.ok) {
        const newPost = await response.json();
        console.log('✅ Post created:', newPost);
        setShowNewPostForm(false);
        loadPosts();
        
        // Show success message
        alert('✅ Đăng bài thành công!');
        
        // Add points for creating post
        const pointsResult = addPoints(50, 'community_post');
        if (pointsResult.badgeAwarded) {
          showPointsNotification(50, pointsResult.badgeAwarded);
        } else {
          showPointsNotification(50);
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Create post error:', errorData);
        alert(errorData.error || `Có lỗi xảy ra (${response.status}). Vui lòng thử lại.`);
      }
    } catch (error) {
      console.error('❌ Error creating post:', error);
      alert(`Không thể kết nối đến server: ${error.message}. Vui lòng kiểm tra kết nối internet và thử lại.`);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowNewPostForm(false);
  };

  const handleUpdatePost = async (postData) => {
    if (!editingPost) return;

    try {
      const response = await fetch(`${API_URL}/api/community/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          category: postData.category || 'Tất cả',
          tags: postData.tags || [],
          user_email: userEmail
        })
      });

      if (response.ok) {
        setEditingPost(null);
        loadPosts();
        if (selectedPost && selectedPost.id === editingPost.id) {
          handleViewPost({ ...editingPost, ...postData });
        }
        alert('✅ Cập nhật bài viết thành công!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!userEmail) {
      alert('Vui lòng nhập email để tham gia cộng đồng');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail })
      });

      if (response.ok) {
        loadPosts();
        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost(null);
        }
        alert('✅ Xóa bài viết thành công!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Không thể xóa bài viết. Bạn chỉ có thể xóa bài viết của chính mình.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.');
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>💬 Cộng đồng du học sinh</h1>
        <p>Chia sẻ kinh nghiệm, hỏi đáp và kết nối với các du học sinh khác</p>
        {!emailSubmitted && (
          <div className="email-prompt">
            <input
              type="email"
              placeholder="Nhập email để tham gia"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
              onBlur={(e) => {
                // Save email when user leaves the input field (blur)
                const email = e.target.value.trim();
                if (email && email.includes('@')) {
                  localStorage.setItem('resource_download_email', email);
                  setEmailSubmitted(true);
                }
              }}
              onKeyPress={(e) => {
                // Save email when user presses Enter
                if (e.key === 'Enter') {
                  const email = e.target.value.trim();
                  if (email && email.includes('@')) {
                    localStorage.setItem('resource_download_email', email);
                    setEmailSubmitted(true);
                    e.target.blur(); // Remove focus
                  } else {
                    alert('Vui lòng nhập email hợp lệ');
                  }
                }
              }}
              className="email-input-community"
            />
            <button
              onClick={() => {
                const email = userEmail.trim();
                if (email && email.includes('@')) {
                  localStorage.setItem('resource_download_email', email);
                  setEmailSubmitted(true);
                } else {
                  alert('Vui lòng nhập email hợp lệ');
                }
              }}
              className="email-submit-btn"
            >
              Xác nhận
            </button>
          </div>
        )}
      </div>

      <div className="community-tabs">
        {['discussions', 'questions', 'experiences'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'discussions' && '💬 Thảo luận'}
            {tab === 'questions' && '❓ Hỏi đáp'}
            {tab === 'experiences' && '📖 Kinh nghiệm'}
          </button>
        ))}
      </div>

      <div className="community-content">
        <div className="community-sidebar">
          <div className="sidebar-section">
            <h3>📂 Danh mục</h3>
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>🔥 Bài viết nổi bật</h3>
            <div className="featured-posts">
              {posts.filter(p => p.is_featured).slice(0, 3).map((post) => (
                <div key={post.id} className="featured-item" onClick={() => handleViewPost(post)}>
                  <span className="featured-icon">⭐</span>
                  <span>{post.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="community-main">
          <div className="post-actions">
            <div className="search-sort-container">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Mới nhất</option>
                <option value="likes">Nhiều like nhất</option>
                <option value="comments">Nhiều comment nhất</option>
                <option value="views">Nhiều view nhất</option>
              </select>
            </div>
            <button className="new-post-btn" onClick={() => setShowNewPostForm(true)}>
              ✍️ Viết bài mới
            </button>
          </div>

          {showNewPostForm && (
            <NewPostForm
              onClose={() => setShowNewPostForm(false)}
              onSubmit={handleCreatePost}
              categories={categories}
            />
          )}

          {editingPost && (
            <EditPostForm
              post={editingPost}
              onClose={() => setEditingPost(null)}
              onSubmit={handleUpdatePost}
              categories={categories}
            />
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : posts.length === 0 ? (
            <div className="no-posts">
              {searchQuery.trim() ? (
                <>
                  <p>🔍 Không tìm thấy bài viết nào với từ khóa "{searchQuery}"</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      loadPosts(true);
                    }}
                    className="clear-search-btn"
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                </>
              ) : (
                <>
                  <p>📝 Chưa có bài viết nào trong danh mục này</p>
                  <p>Hãy là người đầu tiên đăng bài! 🎉</p>
                  <button 
                    onClick={() => setShowNewPostForm(true)}
                    className="new-post-btn"
                    style={{ marginTop: '20px' }}
                  >
                    ✍️ Viết bài mới
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="posts-list">
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  userEmail={userEmail}
                  onReaction={handleReaction}
                  onView={handleViewPost}
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                  formatTime={formatTime}
                />
              ))}
              {loadingMore && (
                <div className="loading-more">
                  <div className="loading-spinner"></div>
                  <span>Đang tải thêm...</span>
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <div className="no-more-posts">
                  <p>Đã hiển thị tất cả bài viết</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal
          key={`post-${selectedPost.id}-${modalKey}`}
          post={selectedPost}
          userEmail={userEmail}
          onClose={() => setSelectedPost(null)}
          onReaction={handleReaction}
          onComment={handleComment}
          formatTime={formatTime}
        />
      )}
    </div>
  );
};

// New Post Form Component
const NewPostForm = ({ onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Tất cả',
    tags: ''
  });
  const [errors, setErrors] = useState({});

  const MAX_TITLE_LENGTH = 200;
  const MAX_CONTENT_LENGTH = 5000;
  const MAX_TAGS_LENGTH = 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Tiêu đề không được quá ${MAX_TITLE_LENGTH} ký tự`;
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    } else if (formData.content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Nội dung không được quá ${MAX_CONTENT_LENGTH} ký tự`;
    }
    
    if (formData.tags.length > MAX_TAGS_LENGTH) {
      newErrors.tags = `Tags không được quá ${MAX_TAGS_LENGTH} ký tự`;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    onSubmit({
      ...formData,
      tags
    });
    
    setFormData({ title: '', content: '', category: 'Tất cả', tags: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="new-post-form"
    >
      <h3>✍️ Viết bài mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tiêu đề bài viết *"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            className={`form-input ${errors.title ? 'error' : ''}`}
            maxLength={MAX_TITLE_LENGTH}
          />
          <div className="char-counter">
            {formData.title.length}/{MAX_TITLE_LENGTH}
          </div>
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Nội dung bài viết *"
            value={formData.content}
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
              if (errors.content) setErrors({ ...errors, content: '' });
            }}
            rows="8"
            className={`form-textarea ${errors.content ? 'error' : ''}`}
            maxLength={MAX_CONTENT_LENGTH}
          />
          <div className="char-counter">
            {formData.content.length}/{MAX_CONTENT_LENGTH}
          </div>
          {errors.content && <div className="error-message">{errors.content}</div>}
        </div>
        
        <div className="form-group">
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Tags (phân cách bằng dấu phẩy, ví dụ: du học, visa, topik)"
            value={formData.tags}
            onChange={(e) => {
              setFormData({ ...formData, tags: e.target.value });
              if (errors.tags) setErrors({ ...errors, tags: '' });
            }}
            className={`form-input ${errors.tags ? 'error' : ''}`}
            maxLength={MAX_TAGS_LENGTH}
          />
          <div className="char-counter">
            {formData.tags.length}/{MAX_TAGS_LENGTH}
          </div>
          {errors.tags && <div className="error-message">{errors.tags}</div>}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">Hủy</button>
          <button type="submit" className="submit-btn">Đăng bài</button>
        </div>
      </form>
    </motion.div>
  );
};

// Edit Post Form Component
const EditPostForm = ({ post, onClose, onSubmit, categories }) => {
  const [formData, setFormData] = useState({
    title: post.title || '',
    content: post.content || '',
    category: post.category || 'Tất cả',
    tags: typeof post.tags === 'string' ? post.tags : (Array.isArray(post.tags) ? post.tags.join(', ') : '')
  });
  const [errors, setErrors] = useState({});

  const MAX_TITLE_LENGTH = 200;
  const MAX_CONTENT_LENGTH = 5000;
  const MAX_TAGS_LENGTH = 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    } else if (formData.title.length > MAX_TITLE_LENGTH) {
      newErrors.title = `Tiêu đề không được quá ${MAX_TITLE_LENGTH} ký tự`;
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    } else if (formData.content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Nội dung không được quá ${MAX_CONTENT_LENGTH} ký tự`;
    }
    
    if (formData.tags.length > MAX_TAGS_LENGTH) {
      newErrors.tags = `Tags không được quá ${MAX_TAGS_LENGTH} ký tự`;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    onSubmit({
      ...formData,
      tags
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="new-post-form"
    >
      <h3>✏️ Sửa bài viết</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Tiêu đề bài viết *"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            className={`form-input ${errors.title ? 'error' : ''}`}
            maxLength={MAX_TITLE_LENGTH}
          />
          <div className="char-counter">
            {formData.title.length}/{MAX_TITLE_LENGTH}
          </div>
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <textarea
            placeholder="Nội dung bài viết *"
            value={formData.content}
            onChange={(e) => {
              setFormData({ ...formData, content: e.target.value });
              if (errors.content) setErrors({ ...errors, content: '' });
            }}
            rows="8"
            className={`form-textarea ${errors.content ? 'error' : ''}`}
            maxLength={MAX_CONTENT_LENGTH}
          />
          <div className="char-counter">
            {formData.content.length}/{MAX_CONTENT_LENGTH}
          </div>
          {errors.content && <div className="error-message">{errors.content}</div>}
        </div>
        
        <div className="form-group">
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="form-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Tags (phân cách bằng dấu phẩy)"
            value={formData.tags}
            onChange={(e) => {
              setFormData({ ...formData, tags: e.target.value });
              if (errors.tags) setErrors({ ...errors, tags: '' });
            }}
            className={`form-input ${errors.tags ? 'error' : ''}`}
            maxLength={MAX_TAGS_LENGTH}
          />
          <div className="char-counter">
            {formData.tags.length}/{MAX_TAGS_LENGTH}
          </div>
          {errors.tags && <div className="error-message">{errors.tags}</div>}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">Hủy</button>
          <button type="submit" className="submit-btn">Cập nhật</button>
        </div>
      </form>
    </motion.div>
  );
};

// Post Card Component
const PostCard = ({ post, index, userEmail, onReaction, onView, formatTime, onDelete, onEdit, onReload, onFollow }) => {
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState([]);
  const isMyPost = userEmail && post.author_email === userEmail;

  useEffect(() => {
    if (userEmail) {
      loadReactions();
    }
  }, [userEmail, post.id]);

  const loadReactions = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      
      // Get reactions count
      const countRes = await fetch(`${API_URL}/api/social/reactions/${post.id}`);
      if (countRes.ok) {
        const counts = await countRes.json();
        setReactionsCount(counts);
      }
      
      // Get user's reaction
      const userRes = await fetch(`${API_URL}/api/social/reactions/user/${post.id}/null/${encodeURIComponent(userEmail)}`);
      if (userRes.ok) {
        const { reaction } = await userRes.json();
        setCurrentReaction(reaction?.reaction_type || null);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReactionChange = (reactionType, isAdding) => {
    setCurrentReaction(isAdding ? reactionType : null);
    if (onReaction) {
      onReaction(post.id, null, reactionType, isAdding);
    }
    // Reload reactions after a short delay
    setTimeout(() => loadReactions(), 500);
  };

  const tags = post.tags ? (typeof post.tags === 'string' ? post.tags.split(',') : post.tags) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="post-card"
      onClick={() => onView(post)}
    >
      <div className="post-header">
        <div className="post-author">
          <span className="author-avatar">{post.author_name?.[0]?.toUpperCase() || '👤'}</span>
          <div className="author-info">
            <Link 
              to={`/profile/${encodeURIComponent(post.author_email)}`}
              className="author-link"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="author-name">{post.author_name || post.author_email?.split('@')[0] || 'Người dùng'}</span>
            </Link>
            <span className="post-time">{formatTime(post.created_at)}</span>
          </div>
          {userEmail && post.author_email && post.author_email !== userEmail && (
            <FollowButton
              followerEmail={userEmail}
              followingEmail={post.author_email}
              onFollowChange={onFollow}
            />
          )}
        </div>
        <span className="post-category">{post.category}</span>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}</p>

      {tags.length > 0 && (
        <div className="post-tags">
          {tags.map((tag, i) => (
            <span key={i} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="post-footer">
        <div className="post-actions-left">
          <div onClick={(e) => e.stopPropagation()}>
            <ReactionsPicker
              postId={post.id}
              commentId={null}
              userEmail={userEmail}
              onReactionChange={handleReactionChange}
              currentReaction={currentReaction}
              reactionsCount={reactionsCount}
            />
          </div>
          <button 
            className="post-action-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onView(post, true); // Pass true to scroll to comments
            }}
            title="Xem bình luận"
          >
            💬 {post.comments_count || 0}
          </button>
          <button className="post-action-btn" onClick={(e) => e.stopPropagation()}>
            👁️ {post.views_count || 0}
          </button>
        </div>
        {isMyPost && (
          <div className="post-actions-right">
            <button
              className="post-action-btn edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              title="Sửa bài viết"
            >
              ✏️
            </button>
            <button
              className="post-action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
                  onDelete(post.id);
                }
              }}
              title="Xóa bài viết"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Post Detail Modal Component
const PostDetailModal = ({ post, userEmail, onClose, onReaction, onComment, formatTime }) => {
  const [commentContent, setCommentContent] = useState('');
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionsCount, setReactionsCount] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const commentFormRef = useRef(null);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      console.log('📤 Loading comments for post:', post.id);
      const response = await fetch(`${API_URL}/api/community/posts/${post.id}`);
      console.log('📥 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 Full response data:', data);
        console.log('📥 Comments array:', data.comments);
        console.log('📥 Comments length:', data.comments?.length || 0);
        
        const commentsArray = Array.isArray(data.comments) ? data.comments : [];
        console.log('📥 Setting comments:', commentsArray);
        setComments(commentsArray);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to load comments:', response.status, errorText);
        setComments([]);
      }
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    // Always load fresh comments from API when modal opens
    // This ensures we get the latest comments even if modal is reopened for the same post
    console.log('🔄 Modal opened, loading comments for post:', post.id);
    loadComments();
    
    if (userEmail) {
      loadReactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]); // Load comments whenever post.id changes

  const loadReactions = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
      
      // Get reactions count
      const countRes = await fetch(`${API_URL}/api/social/reactions/${post.id}`);
      if (countRes.ok) {
        const counts = await countRes.json();
        setReactionsCount(counts);
      }
      
      // Get user's reaction
      const userRes = await fetch(`${API_URL}/api/social/reactions/user/${post.id}/null/${encodeURIComponent(userEmail)}`);
      if (userRes.ok) {
        const { reaction } = await userRes.json();
        setCurrentReaction(reaction?.reaction_type || null);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReactionChange = (reactionType, isAdding) => {
    setCurrentReaction(isAdding ? reactionType : null);
    if (onReaction) {
      onReaction(post.id, null, reactionType, isAdding);
    }
    // Reload reactions after a short delay
    setTimeout(() => loadReactions(), 500);
  };

  // Scroll to comment form
  const scrollToCommentForm = () => {
    if (commentFormRef.current) {
      commentFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus on textarea if user has email
      if (userEmail) {
        const textarea = commentFormRef.current.querySelector('textarea');
        if (textarea) {
          setTimeout(() => textarea.focus(), 300);
        }
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) {
      alert('Vui lòng nhập nội dung bình luận');
      return;
    }
    
    // Call onComment and wait for it to complete
    try {
      await onComment(post.id, commentContent);
      setCommentContent('');
      // Reload comments after successful submission
      setTimeout(() => {
        loadComments();
      }, 500);
    } catch (error) {
      console.error('Error submitting comment:', error);
      // Error is already handled in handleComment
    }
  };

  const tags = post.tags ? (typeof post.tags === 'string' ? post.tags.split(',') : post.tags) : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="post-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="post-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-modal-btn" onClick={onClose}>×</button>
          
          <div className="post-modal-header">
            <div className="post-author">
              <span className="author-avatar">{post.author_name?.[0]?.toUpperCase() || '👤'}</span>
              <div className="author-info">
                <span className="author-name">{post.author_name || 'Người dùng'}</span>
                <span className="post-time">{formatTime(post.created_at)}</span>
              </div>
            </div>
            <span className="post-category">{post.category}</span>
          </div>

          <h2 className="post-modal-title">{post.title}</h2>
          <div className="post-modal-content">{post.content}</div>

          {tags.length > 0 && (
            <div className="post-tags">
              {tags.map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
          )}

          <div className="post-modal-actions">
            <ReactionsPicker
              postId={post.id}
              commentId={null}
              userEmail={userEmail}
              onReactionChange={handleReactionChange}
              currentReaction={currentReaction}
              reactionsCount={reactionsCount}
            />
            <button 
              className="post-action-btn"
              onClick={scrollToCommentForm}
              title="Xem bình luận"
            >
              💬 {comments.length}
            </button>
            <button className="post-action-btn">
              👁️ {post.views_count || 0}
            </button>
          </div>

          <div className="comments-section">
            <h3>💬 Bình luận ({comments.length})</h3>
            
            {/* Hiển thị comments trước */}
            <div className="comments-list">
              {loadingComments ? (
                <div className="loading-comments">
                  <p>Đang tải bình luận...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="no-comments">
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận! 💬</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-author">
                      <span className="author-avatar-small">{comment.author_name?.[0]?.toUpperCase() || '👤'}</span>
                      <div>
                        <div className="comment-author-name">{comment.author_name || 'Người dùng'}</div>
                        <div className="comment-time">{formatTime(comment.created_at)}</div>
                      </div>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              )}
            </div>

            {/* Form comment ở sau */}
            {userEmail && (
              <form 
                ref={commentFormRef}
                onSubmit={handleSubmitComment} 
                className="comment-form"
              >
                <textarea
                  placeholder="Viết bình luận..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows="3"
                  className="comment-input"
                />
                <button type="submit" className="comment-submit-btn">Gửi</button>
              </form>
            )}
            {!userEmail && (
              <div ref={commentFormRef} className="comment-form-placeholder">
                <p>Vui lòng nhập email để tham gia bình luận</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="posts-list">
      {[1, 2, 3].map((i) => (
        <div key={i} className="post-card skeleton">
          <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-info">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line shorter"></div>
            </div>
            <div className="skeleton-badge"></div>
          </div>
          <div className="skeleton-line long"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
          <div className="skeleton-footer">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Community;
