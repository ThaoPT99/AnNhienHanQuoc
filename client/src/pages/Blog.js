import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Blog.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      slug: 'huong-dan-du-hoc-han-quoc-2025',
      title: 'Hướng dẫn du học Hàn Quốc 2025: Tất cả những gì bạn cần biết',
      excerpt: 'Tìm hiểu chi tiết về quy trình du học Hàn Quốc, điều kiện, chi phí và kinh nghiệm từ các du học sinh.',
      image: 'https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg',
      date: '15/01/2025',
      category: 'Hướng dẫn',
      readTime: '10 phút đọc'
    },
    {
      id: 2,
      slug: 'chi-phi-du-hoc-han-quoc',
      title: 'Chi phí du học Hàn Quốc: Bảng giá chi tiết 2025',
      excerpt: 'Phân tích chi tiết các khoản chi phí khi du học Hàn Quốc: học phí, sinh hoạt phí, nhà ở và cách tiết kiệm.',
      image: 'https://i.pinimg.com/736x/e5/bb/5f/e5bb5f88257bbe6a76e33dac821206bb.jpg',
      date: '12/01/2025',
      category: 'Tài chính',
      readTime: '8 phút đọc'
    },
    {
      id: 3,
      slug: 'hoc-bong-du-hoc-han-quoc',
      title: 'Top 10 học bổng du học Hàn Quốc dành cho sinh viên Việt Nam',
      excerpt: 'Danh sách các học bổng hấp dẫn từ chính phủ Hàn Quốc và các trường đại học hàng đầu.',
      image: 'https://i.pinimg.com/1200x/78/99/2b/78992b4e9e818b9dc9b109c2b55a339f.jpg',
      date: '10/01/2025',
      category: 'Học bổng',
      readTime: '12 phút đọc'
    },
    {
      id: 4,
      slug: 'kinh-nghiem-xin-visa-han-quoc',
      title: 'Kinh nghiệm xin visa du học Hàn Quốc: Tránh những lỗi thường gặp',
      excerpt: 'Chia sẻ kinh nghiệm thực tế về quy trình xin visa, các giấy tờ cần thiết và cách tăng tỷ lệ thành công.',
      image: 'https://i.pinimg.com/736x/33/1c/df/331cdfced60d0a6c9fa683446d252342.jpg',
      date: '08/01/2025',
      category: 'Visa',
      readTime: '9 phút đọc'
    },
    {
      id: 5,
      slug: 'cuoc-song-du-hoc-sinh-han-quoc',
      title: 'Cuộc sống du học sinh tại Hàn Quốc: Những điều bạn chưa biết',
      excerpt: 'Khám phá cuộc sống thực tế của du học sinh Việt Nam tại Hàn Quốc: văn hóa, ẩm thực, làm thêm và kết bạn.',
      image: 'https://i.pinimg.com/736x/76/91/8d/76918dfd976a25f56f925e8d233ff185.jpg',
      date: '05/01/2025',
      category: 'Trải nghiệm',
      readTime: '11 phút đọc'
    },
    {
      id: 6,
      slug: 'chon-truong-du-hoc-han-quoc',
      title: 'Cách chọn trường đại học phù hợp khi du học Hàn Quốc',
      excerpt: 'Hướng dẫn chi tiết cách chọn trường dựa trên ngành học, vị trí, học phí và cơ hội việc làm sau tốt nghiệp.',
      image: 'https://i.pinimg.com/736x/f7/4f/d8/f74fd8657a1b433eed6c14efc07182b6.jpg',
      date: '03/01/2025',
      category: 'Tư vấn',
      readTime: '10 phút đọc'
    },
    {
      id: 7,
      slug: 'top-1-cong-ty-tu-van-du-hoc-han-quoc-uy-tin-nhat-hien-nay',
      title: 'Top 1 Công Ty Tư Vấn Du Học Hàn Quốc Uy Tín Nhất Hiện Nay – Vì Sao Nhiều Học Sinh Chọn Du học An Nhiên?',
      excerpt: 'Khám phá lý do Du học An Nhiên được đánh giá là công ty tư vấn du học Hàn Quốc uy tín nhất. Dịch vụ chuyên nghiệp, tỷ lệ thành công cao và hỗ trợ tận tâm.',
      image: 'https://i.pinimg.com/1200x/f5/1a/eb/f51aeb3faf77215987e1461f589d10a4.jpg',
      date: '20/01/2025',
      category: 'Giới thiệu',
      readTime: '12 phút đọc'
    },
    {
      id: 8,
      slug: 'di-du-hoc-han-quoc-co-de-khong-xu-huong-du-hoc-moi-cho-2k8',
      title: 'Đi Du Học Hàn Quốc Có Dễ Không? Xu Hướng Du Học Mới Cho 2K8',
      excerpt: 'Tìm hiểu về xu hướng du học Hàn Quốc dành cho thế hệ 2K8. Đánh giá mức độ khó dễ, cơ hội và thách thức khi du học tại xứ sở Kim Chi.',
      image: 'https://i.pinimg.com/1200x/05/e3/e3/05e3e3ee0202cb638a616aa8653cac32.jpg',
      date: '18/01/2025',
      category: 'Xu hướng',
      readTime: '11 phút đọc'
    },
    {
      id: 9,
      slug: '8-dieu-can-biet-ve-du-hoc-han-quoc-he-visa-d2-tai-du-hoc-an-nhien',
      title: '8 Điều Cần Biết Về Du Học Hàn Quốc Hệ Visa D2 Tại Du Học An Nhiên',
      excerpt: 'Hướng dẫn chi tiết về visa D2 - visa du học Hàn Quốc. 8 điều quan trọng bạn cần biết trước khi nộp hồ sơ xin visa D2 với Du học An Nhiên.',
      image: 'https://i.pinimg.com/1200x/bb/90/6c/bb906c30d8ad8e7b1cabde8dda6e610e.jpg',
      date: '16/01/2025',
      category: 'Visa',
      readTime: '9 phút đọc'
    },
    {
      id: 10,
      slug: 'dieu-kien-du-hoc-han-quoc-la-gi-chi-phi-bao-nhieu-va-nen-hoc-nganh-nao',
      title: 'Điều kiện Du học Hàn Quốc là gì? Chi phí bao nhiêu và nên học ngành nào?',
      excerpt: 'Tổng hợp đầy đủ về điều kiện du học Hàn Quốc, chi phí chi tiết và gợi ý các ngành học hot nhất hiện nay. Thông tin cập nhật 2025.',
      image: 'https://i.pinimg.com/736x/15/79/68/157968c0a12700780eda718d6a0cc5bc.jpg',
      date: '14/01/2025',
      category: 'Hướng dẫn',
      readTime: '13 phút đọc'
    },
    {
      id: 11,
      slug: 'top-8-ung-dung-can-thiet-danh-cho-du-hoc-sinh-tai-han-quoc',
      title: 'Top 8 ứng dụng cần thiết dành cho Du học sinh tại Hàn Quốc',
      excerpt: 'Danh sách 8 ứng dụng không thể thiếu cho du học sinh tại Hàn Quốc: giao thông, ngân hàng, học tập, mua sắm và kết nối xã hội.',
      image: 'https://i.pinimg.com/1200x/54/5f/06/545f06e42a3a53741deb98574867aa31.jpg',
      date: '13/01/2025',
      category: 'Tiện ích',
      readTime: '8 phút đọc'
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
                  <img 
                    src={post.image} 
                    alt={`${post.title} - Du học An Nhiên`} 
                    className="blog-image"
                    loading="lazy"
                    width="400"
                    height="250"
                  />
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

