import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      avatar: '👨‍🎓',
      title: 'Kinh nghiệm xin học bổng KGSP',
      content: 'Mình đã thành công xin học bổng KGSP năm 2024. Chia sẻ một số tips...',
      category: 'Học bổng',
      likes: 24,
      comments: 8,
      time: '2 giờ trước',
      tags: ['học bổng', 'KGSP', 'kinh nghiệm']
    },
    {
      id: 2,
      author: 'Trần Thị B',
      avatar: '👩‍🎓',
      title: 'Cuộc sống du học sinh tại Seoul',
      content: 'Đã sang Hàn được 3 tháng, muốn chia sẻ về cuộc sống hàng ngày...',
      category: 'Cuộc sống',
      likes: 45,
      comments: 12,
      time: '5 giờ trước',
      tags: ['Seoul', 'cuộc sống', 'du học sinh']
    },
    {
      id: 3,
      author: 'Lê Văn C',
      avatar: '👨‍🎓',
      title: 'Hỏi về TOPIK 6 trong 1 năm',
      content: 'Có bạn nào đã đạt TOPIK 6 trong 1 năm không? Mình cần lời khuyên...',
      category: 'Học tiếng',
      likes: 18,
      comments: 15,
      time: '1 ngày trước',
      tags: ['TOPIK', 'tiếng Hàn', 'học tập']
    }
  ]);

  const categories = ['Tất cả', 'Học bổng', 'Cuộc sống', 'Học tiếng', 'Visa', 'Tuyển dụng'];

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>💬 Cộng đồng du học sinh</h1>
        <p>Chia sẻ kinh nghiệm, hỏi đáp và kết nối với các du học sinh khác</p>
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
                <button key={category} className="category-item">
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>🔥 Bài viết nổi bật</h3>
            <div className="featured-posts">
              <div className="featured-item">
                <span className="featured-icon">⭐</span>
                <span>Top 10 trường đại học Hàn Quốc 2025</span>
              </div>
              <div className="featured-item">
                <span className="featured-icon">⭐</span>
                <span>Hướng dẫn xin visa du học chi tiết</span>
              </div>
            </div>
          </div>
        </div>

        <div className="community-main">
          <div className="post-actions">
            <button className="new-post-btn">
              ✍️ Viết bài mới
            </button>
          </div>

          <div className="posts-list">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="post-card"
              >
                <div className="post-header">
                  <div className="post-author">
                    <span className="author-avatar">{post.avatar}</span>
                    <div className="author-info">
                      <span className="author-name">{post.author}</span>
                      <span className="post-time">{post.time}</span>
                    </div>
                  </div>
                  <span className="post-category">{post.category}</span>
                </div>

                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>

                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                <div className="post-footer">
                  <button className="post-action-btn">
                    👍 {post.likes}
                  </button>
                  <button className="post-action-btn">
                    💬 {post.comments}
                  </button>
                  <button className="post-action-btn">
                    🔗 Chia sẻ
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;

