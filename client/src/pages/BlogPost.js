import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './BlogPost.css';

const BlogPost = () => {
  const { slug } = useParams();

  const blogPosts = {
    'huong-dan-du-hoc-han-quoc-2024': {
      title: 'Hướng dẫn du học Hàn Quốc 2024: Tất cả những gì bạn cần biết',
      date: '15/01/2024',
      category: 'Hướng dẫn',
      readTime: '10 phút đọc',
      image: 'https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg',
      content: `
        <h2>1. Tổng quan về du học Hàn Quốc</h2>
        <p>Hàn Quốc đang trở thành điểm đến du học hấp dẫn cho sinh viên Việt Nam nhờ chất lượng giáo dục cao, nền văn hóa đa dạng và cơ hội việc làm tốt sau tốt nghiệp.</p>
        
        <h2>2. Điều kiện du học Hàn Quốc</h2>
        <h3>2.1. Điều kiện học vấn</h3>
        <ul>
          <li>Tốt nghiệp THPT với điểm trung bình từ 6.5 trở lên</li>
          <li>Đối với hệ Đại học: Tốt nghiệp THPT, có bằng TOPIK level 3 trở lên</li>
          <li>Đối với hệ Thạc sĩ: Tốt nghiệp Đại học, có bằng TOPIK level 4 trở lên</li>
        </ul>
        
        <h3>2.2. Điều kiện tài chính</h3>
        <ul>
          <li>Sổ tiết kiệm tối thiểu 10,000 USD (đã gửi ít nhất 6 tháng)</li>
          <li>Chứng minh thu nhập của người bảo lãnh</li>
          <li>Giấy tờ chứng minh quan hệ gia đình</li>
        </ul>
        
        <h2>3. Quy trình du học Hàn Quốc</h2>
        <ol>
          <li><strong>Chọn trường và ngành học:</strong> Nghiên cứu kỹ các trường đại học phù hợp với nguyện vọng và khả năng tài chính.</li>
          <li><strong>Chuẩn bị hồ sơ:</strong> Thu thập và dịch thuật các giấy tờ cần thiết.</li>
          <li><strong>Nộp hồ sơ:</strong> Gửi hồ sơ đến trường đại học Hàn Quốc.</li>
          <li><strong>Nhận thư mời nhập học:</strong> Sau khi được chấp nhận, bạn sẽ nhận được thư mời nhập học.</li>
          <li><strong>Xin visa:</strong> Nộp hồ sơ xin visa D-2 (visa du học) tại Đại sứ quán Hàn Quốc.</li>
          <li><strong>Chuẩn bị lên đường:</strong> Mua vé máy bay, chuẩn bị hành lý và tìm chỗ ở.</li>
        </ol>
        
        <h2>4. Chi phí du học Hàn Quốc</h2>
        <h3>4.1. Học phí</h3>
        <ul>
          <li>Hệ Đại học: 3,000 - 8,000 USD/năm</li>
          <li>Hệ Thạc sĩ: 4,000 - 10,000 USD/năm</li>
          <li>Hệ Tiến sĩ: 4,500 - 12,000 USD/năm</li>
        </ul>
        
        <h3>4.2. Sinh hoạt phí</h3>
        <ul>
          <li>Nhà ở: 300 - 600 USD/tháng</li>
          <li>Ăn uống: 200 - 400 USD/tháng</li>
          <li>Đi lại: 50 - 100 USD/tháng</li>
          <li>Chi phí khác: 100 - 200 USD/tháng</li>
        </ul>
        
        <h2>5. Kinh nghiệm từ du học sinh</h2>
        <p>Nhiều du học sinh Việt Nam chia sẻ rằng việc học tiếng Hàn trước khi sang là rất quan trọng. Ngoài ra, việc tìm việc làm thêm cũng giúp giảm bớt gánh nặng tài chính và cải thiện kỹ năng giao tiếp.</p>
        
        <h2>6. Kết luận</h2>
        <p>Du học Hàn Quốc là một cơ hội tuyệt vời để phát triển bản thân và mở rộng tầm nhìn. Với sự chuẩn bị kỹ lưỡng và quyết tâm, bạn chắc chắn sẽ có một hành trình du học thành công.</p>
      `
    },
    'chi-phi-du-hoc-han-quoc': {
      title: 'Chi phí du học Hàn Quốc: Bảng giá chi tiết 2024',
      date: '12/01/2024',
      category: 'Tài chính',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      content: `
        <h2>1. Tổng quan về chi phí du học Hàn Quốc</h2>
        <p>Chi phí du học Hàn Quốc là một trong những mối quan tâm hàng đầu của các bạn học sinh và phụ huynh. Bài viết này sẽ phân tích chi tiết từng khoản chi phí để bạn có thể lập kế hoạch tài chính phù hợp.</p>
        
        <h2>2. Học phí theo từng bậc học</h2>
        <h3>2.1. Hệ Đại học</h3>
        <ul>
          <li>Trường công lập: 2,500 - 5,000 USD/năm</li>
          <li>Trường tư thục: 4,000 - 8,000 USD/năm</li>
          <li>Trường top đầu (SNU, Yonsei, Korea): 6,000 - 10,000 USD/năm</li>
        </ul>
        
        <h3>2.2. Hệ Thạc sĩ</h3>
        <ul>
          <li>Trường công lập: 3,000 - 6,000 USD/năm</li>
          <li>Trường tư thục: 5,000 - 10,000 USD/năm</li>
        </ul>
        
        <h2>3. Chi phí sinh hoạt</h2>
        <h3>3.1. Nhà ở</h3>
        <ul>
          <li>Ký túc xá: 300 - 500 USD/tháng</li>
          <li>Phòng trọ: 400 - 700 USD/tháng</li>
          <li>Chung cư: 600 - 1,200 USD/tháng</li>
        </ul>
        
        <h3>3.2. Ăn uống</h3>
        <ul>
          <li>Ăn ở căng tin trường: 200 - 300 USD/tháng</li>
          <li>Tự nấu ăn: 250 - 400 USD/tháng</li>
          <li>Ăn ngoài: 400 - 600 USD/tháng</li>
        </ul>
        
        <h2>4. Chi phí khác</h2>
        <ul>
          <li>Bảo hiểm y tế: 50 - 100 USD/tháng</li>
          <li>Điện thoại, internet: 50 - 80 USD/tháng</li>
          <li>Đi lại: 50 - 100 USD/tháng</li>
          <li>Sách vở, tài liệu: 200 - 400 USD/năm</li>
        </ul>
        
        <h2>5. Cách tiết kiệm chi phí</h2>
        <ul>
          <li>Ở ký túc xá thay vì thuê nhà riêng</li>
          <li>Tự nấu ăn thay vì ăn ngoài</li>
          <li>Tìm việc làm thêm hợp pháp (tối đa 20h/tuần)</li>
          <li>Xin học bổng từ trường hoặc chính phủ</li>
          <li>Sử dụng thẻ sinh viên để được giảm giá</li>
        </ul>
      `
    },
    'hoc-bong-du-hoc-han-quoc': {
      title: 'Top 10 học bổng du học Hàn Quốc dành cho sinh viên Việt Nam',
      date: '10/01/2024',
      category: 'Học bổng',
      readTime: '12 phút đọc',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      content: `
        <h2>1. Học bổng Chính phủ Hàn Quốc (KGSP)</h2>
        <p>Học bổng KGSP là học bổng toàn phần danh giá nhất, bao gồm:</p>
        <ul>
          <li>Học phí: 100%</li>
          <li>Phí sinh hoạt: 900,000 KRW/tháng</li>
          <li>Vé máy bay khứ hồi</li>
          <li>Phí bảo hiểm y tế</li>
          <li>Phí học tiếng Hàn 1 năm</li>
        </ul>
        
        <h2>2. Học bổng Đại học Quốc gia Seoul (SNU)</h2>
        <ul>
          <li>Học bổng toàn phần cho sinh viên xuất sắc</li>
          <li>Học bổng 50% học phí</li>
          <li>Học bổng hỗ trợ sinh hoạt phí</li>
        </ul>
        
        <h2>3. Học bổng Đại học Yonsei</h2>
        <ul>
          <li>Học bổng Global Korea Scholarship</li>
          <li>Học bổng dựa trên thành tích học tập</li>
        </ul>
        
        <h2>4. Học bổng Đại học Korea</h2>
        <ul>
          <li>Học bổng cho sinh viên quốc tế</li>
          <li>Hỗ trợ học phí và sinh hoạt phí</li>
        </ul>
        
        <h2>5. Học bổng Đại học Hanyang</h2>
        <ul>
          <li>Học bổng Excellence Scholarship</li>
          <li>Học bổng dựa trên TOPIK score</li>
        </ul>
        
        <h2>6. Cách xin học bổng hiệu quả</h2>
        <ul>
          <li>Chuẩn bị hồ sơ đầy đủ và chuyên nghiệp</li>
          <li>Viết bài luận thuyết phục</li>
          <li>Đạt điểm TOPIK cao</li>
          <li>Có thành tích học tập xuất sắc</li>
          <li>Tham gia hoạt động ngoại khóa</li>
        </ul>
      `
    }
  };

  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="blog-post-page">
        <div className="not-found">
          <h1>Bài viết không tìm thấy</h1>
          <Link to="/blog" className="back-link">← Quay lại blog</Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    },
    "image": post.image
  };

  return (
    <div className="blog-post-page">
      <SEO
        title={post.title}
        description={`${post.title} - Du học An Nhiên`}
        keywords={`${post.category}, du học Hàn Quốc, ${post.title}`}
        url={`https://duhocannhien.vercel.app/blog/${slug}`}
        image={post.image}
        structuredData={structuredData}
      />
      
      <article className="blog-post">
        <div className="blog-post-header">
          <Link to="/blog" className="back-link">← Quay lại blog</Link>
          <div className="post-meta">
            <span className="post-category">{post.category}</span>
            <span className="post-date">📅 {post.date}</span>
            <span className="post-read-time">⏱️ {post.readTime}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
        </div>
        
        <div className="post-image-wrapper">
          <img src={post.image} alt={post.title} className="post-image" />
        </div>
        
        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <div className="post-footer">
          <div className="share-buttons">
            <h3>Chia sẻ bài viết:</h3>
            <div className="share-links">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://duhocannhien.vercel.app/blog/${slug}`} target="_blank" rel="noopener noreferrer" className="share-btn facebook">📘 Facebook</a>
              <a href={`https://twitter.com/intent/tweet?url=https://duhocannhien.vercel.app/blog/${slug}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="share-btn twitter">🐦 Twitter</a>
            </div>
          </div>
          <Link to="/contact" className="cta-button">💬 Tư vấn du học ngay</Link>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;

