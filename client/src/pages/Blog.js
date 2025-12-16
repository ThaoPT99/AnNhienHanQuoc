import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Blog.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      slug: 'huong-dan-du-hoc-han-quoc-2024',
      title: 'Hướng dẫn du học Hàn Quốc 2024: Tất cả những gì bạn cần biết',
      excerpt: 'Tìm hiểu chi tiết về quy trình du học Hàn Quốc, điều kiện, chi phí và kinh nghiệm từ các du học sinh.',
      image: 'https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg',
      date: '15/01/2024',
      category: 'Hướng dẫn',
      readTime: '10 phút đọc'
    },
    {
      id: 2,
      slug: 'chi-phi-du-hoc-han-quoc',
      title: 'Chi phí du học Hàn Quốc: Bảng giá chi tiết 2024',
      excerpt: 'Phân tích chi tiết các khoản chi phí khi du học Hàn Quốc: học phí, sinh hoạt phí, nhà ở và cách tiết kiệm.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      date: '12/01/2024',
      category: 'Tài chính',
      readTime: '8 phút đọc'
    },
    {
      id: 3,
      slug: 'hoc-bong-du-hoc-han-quoc',
      title: 'Top 10 học bổng du học Hàn Quốc dành cho sinh viên Việt Nam',
      excerpt: 'Danh sách các học bổng hấp dẫn từ chính phủ Hàn Quốc và các trường đại học hàng đầu.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      date: '10/01/2024',
      category: 'Học bổng',
      readTime: '12 phút đọc'
    },
    {
      id: 4,
      slug: 'kinh-nghiem-xin-visa-han-quoc',
      title: 'Kinh nghiệm xin visa du học Hàn Quốc: Tránh những lỗi thường gặp',
      excerpt: 'Chia sẻ kinh nghiệm thực tế về quy trình xin visa, các giấy tờ cần thiết và cách tăng tỷ lệ thành công.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      date: '08/01/2024',
      category: 'Visa',
      readTime: '9 phút đọc'
    },
    {
      id: 5,
      slug: 'cuoc-song-du-hoc-sinh-han-quoc',
      title: 'Cuộc sống du học sinh tại Hàn Quốc: Những điều bạn chưa biết',
      excerpt: 'Khám phá cuộc sống thực tế của du học sinh Việt Nam tại Hàn Quốc: văn hóa, ẩm thực, làm thêm và kết bạn.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      date: '05/01/2024',
      category: 'Trải nghiệm',
      readTime: '11 phút đọc'
    },
    {
      id: 6,
      slug: 'chon-truong-du-hoc-han-quoc',
      title: 'Cách chọn trường đại học phù hợp khi du học Hàn Quốc',
      excerpt: 'Hướng dẫn chi tiết cách chọn trường dựa trên ngành học, vị trí, học phí và cơ hội việc làm sau tốt nghiệp.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
      date: '03/01/2024',
      category: 'Tư vấn',
      readTime: '10 phút đọc'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Blog Du học Hàn Quốc - Du học An Nhiên",
    "description": "Blog chia sẻ kinh nghiệm, hướng dẫn và thông tin về du học Hàn Quốc",
    "url": "https://duhocannhien.vercel.app/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    }
  };

  return (
    <div className="blog-page">
      <SEO
        title="Blog Du học Hàn Quốc - Du học An Nhiên"
        description="Blog chia sẻ kinh nghiệm, hướng dẫn và thông tin về du học Hàn Quốc. Tìm hiểu về chi phí, học bổng, visa và cuộc sống du học sinh tại Hàn Quốc."
        keywords="blog du học Hàn Quốc, kinh nghiệm du học Hàn Quốc, hướng dẫn du học, chia sẻ du học sinh"
        url="https://duhocannhien.vercel.app/blog"
        structuredData={structuredData}
      />
      
      <div className="page-header">
        <div className="header-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="header-emoji">📚</div>
          <h1 className="page-title">Blog Du học Hàn Quốc</h1>
          <p className="page-subtitle">
            Chia sẻ kinh nghiệm, hướng dẫn và thông tin hữu ích về du học Hàn Quốc
          </p>
        </motion.div>
      </div>

      <div className="blog-container">
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/blog/${post.slug}`} className="blog-card-link">
                <div className="blog-image-wrapper">
                  <img src={post.image} alt={post.title} className="blog-image" />
                  <div className="blog-category">{post.category}</div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">📅 {post.date}</span>
                    <span className="blog-read-time">⏱️ {post.readTime}</span>
                  </div>
                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-read-more">
                    Đọc thêm <span>→</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

