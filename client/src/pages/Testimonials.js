import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Testimonials.css';

const Testimonials = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Đánh giá khách hàng - Du học An Nhiên",
    "description": "Xem những đánh giá và chia sẻ từ học sinh đã du học Hàn Quốc thành công với Du học An Nhiên",
    "url": "https://duhocannhien.vercel.app/testimonials",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Nguyễn Thị Mai"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Em đã từng rất lo lắng về việc du học Hàn Quốc, nhưng nhờ có Du học An Nhiên, mọi thứ đã trở nên dễ dàng hơn rất nhiều. Các chị tư vấn rất nhiệt tình, hỗ trợ em từng bước một."
        }
      ]
    }
  };

  const testimonials = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      school: 'Đại học Yonsei',
      major: 'Kinh tế',
      year: '2023',
      rating: 5,
      image: 'https://i.pinimg.com/736x/30/1a/09/301a09086923fa9127185cdad0d995d8.jpg',
      text: 'Em đã từng rất lo lắng về việc du học Hàn Quốc, nhưng nhờ có Du học An Nhiên, mọi thứ đã trở nên dễ dàng hơn rất nhiều. Các chị tư vấn rất nhiệt tình, hỗ trợ em từng bước một. Giờ em đã học năm 2 tại Đại học Yonsei và rất hài lòng với quyết định của mình.',
      category: 'success'
    },
    {
      id: 2,
      name: 'Trần Văn Đức',
      school: 'Đại học Seoul',
      major: 'Công nghệ thông tin',
      year: '2022',
      rating: 5,
      image: 'https://i.pinimg.com/736x/5a/ae/6a/5aae6ad689eed16c016ea8003acc886b.jpg',
      text: 'Du học An Nhiên đã giúp em xin được học bổng 50% tại Đại học Seoul. Quá trình làm hồ sơ rất chuyên nghiệp, không có sai sót gì. Em rất cảm ơn các anh chị đã đồng hành cùng em.',
      category: 'scholarship'
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      school: 'Đại học Korea',
      major: 'Thiết kế',
      year: '2024',
      rating: 5,
      image: 'https://i.pinimg.com/736x/e3/26/56/e32656f0d7ba26d60727e85cc0dc7d33.jpg',
      text: 'Em rất ấn tượng với dịch vụ của Du học An Nhiên. Từ tư vấn chọn trường đến làm hồ sơ, mọi thứ đều rất chu đáo. Em đã đậu visa ngay lần đầu tiên. Cảm ơn Du học An Nhiên rất nhiều!',
      category: 'visa'
    },
    {
      id: 4,
      name: 'Phạm Minh Tuấn',
      school: 'Đại học Hanyang',
      major: 'Kỹ thuật',
      year: '2023',
      rating: 5,
      image: 'https://i.pinimg.com/1200x/0e/da/d5/0edad57379e672c6dd8f659d991aa185.jpg',
      text: 'Chương trình luyện thi TOPIK miễn phí của Du học An Nhiên rất hữu ích. Em đã đạt TOPIK 5 nhờ khóa học này. Các giáo viên rất tận tâm và phương pháp dạy rất hiệu quả.',
      category: 'topik'
    },
    {
      id: 5,
      name: 'Hoàng Thị Lan',
      school: 'Đại học Sogang',
      major: 'Du lịch - Nhà hàng - Khách sạn',
      year: '2024',
      rating: 5,
      image: 'https://i.pinimg.com/1200x/49/6b/f6/496bf6ea630f923608b20c08c7af05ae.jpg',
      text: 'Sau khi sang Hàn Quốc, Du học An Nhiên vẫn tiếp tục hỗ trợ em tìm nhà và làm thủ tục nhập học. Dịch vụ hỗ trợ sau khi nhập cảnh rất tốt, em cảm thấy an tâm hơn rất nhiều.',
      category: 'support'
    },
    {
      id: 6,
      name: 'Vũ Đức Anh',
      school: 'Đại học Kyung Hee',
      major: 'Y tế',
      year: '2022',
      rating: 5,
      image: 'https://i.pinimg.com/1200x/52/cf/09/52cf090db4bf9bcbf3f386cd1693e50c.jpg',
      text: 'Em đã từng bị từ chối visa lần đầu, nhưng nhờ Du học An Nhiên phân tích và cải thiện hồ sơ, em đã đậu visa lần thứ 2. Cảm ơn các anh chị đã không bỏ cuộc và hỗ trợ em đến cùng!',
      category: 'visa'
    },
    {
      id: 7,
      name: 'Đỗ Thị Hoa',
      school: 'Đại học Ewha',
      major: 'Ngôn ngữ Hàn Quốc',
      year: '2023',
      rating: 5,
      image: 'https://i.pinimg.com/736x/30/1a/09/301a09086923fa9127185cdad0d995d8.jpg',
      text: 'Chi phí minh bạch, không phát sinh thêm phí như các công ty khác. Em rất hài lòng với dịch vụ của Du học An Nhiên. Đội ngũ tư vấn viên rất chuyên nghiệp và nhiệt tình.',
      category: 'service'
    },
    {
      id: 8,
      name: 'Nguyễn Văn Nam',
      school: 'Đại học Sungkyunkwan',
      major: 'Quản trị kinh doanh',
      year: '2024',
      rating: 5,
      image: 'https://i.pinimg.com/736x/5a/ae/6a/5aae6ad689eed16c016ea8003acc886b.jpg',
      text: 'Em đã được tư vấn chọn trường phù hợp với năng lực và nguyện vọng. Du học An Nhiên không chỉ tư vấn trường tốt mà còn tư vấn trường phù hợp với khả năng tài chính của gia đình em.',
      category: 'consulting'
    },
    {
      id: 9,
      name: 'Trần Thị Linh',
      school: 'Đại học Chung-Ang',
      major: 'Truyền thông',
      year: '2023',
      rating: 5,
      image: 'https://i.pinimg.com/736x/e3/26/56/e32656f0d7ba26d60727e85cc0dc7d33.jpg',
      text: 'Hỗ trợ 24/7, kể cả sau khi sang Hàn Quốc. Mỗi khi em có thắc mắc, các anh chị đều trả lời ngay. Em cảm thấy như có người thân bên cạnh khi ở xa nhà.',
      category: 'support'
    },
    {
      id: 10,
      name: 'Lê Văn Hùng',
      school: 'Đại học Inha',
      major: 'Kỹ thuật',
      year: '2022',
      rating: 5,
      image: 'https://i.pinimg.com/1200x/0e/da/d5/0edad57379e672c6dd8f659d991aa185.jpg',
      text: 'Em đã giới thiệu nhiều bạn bè đến Du học An Nhiên và tất cả đều rất hài lòng. Dịch vụ chuyên nghiệp, tỷ lệ thành công cao. Em rất tin tưởng Du học An Nhiên.',
      category: 'success'
    }
  ];

  const filters = [
    { id: 'all', label: 'Tất cả', icon: '🌟' },
    { id: 'success', label: 'Thành công', icon: '🎓' },
    { id: 'visa', label: 'Visa', icon: '📝' },
    { id: 'scholarship', label: 'Học bổng', icon: '💰' },
    { id: 'support', label: 'Hỗ trợ', icon: '🤝' },
    { id: 'topik', label: 'TOPIK', icon: '📚' }
  ];

  const filteredTestimonials = selectedFilter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === selectedFilter);

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <div className="testimonials-page">
      <SEO
        title="Đánh giá khách hàng - Du học An Nhiên"
        description="Xem những đánh giá và chia sẻ từ học sinh đã du học Hàn Quốc thành công với Du học An Nhiên. Hơn 2000 học sinh tin tưởng và đánh giá 5 sao."
        keywords="đánh giá du học An Nhiên, review du học Hàn Quốc, học sinh du học thành công, đánh giá công ty du học, du học An Nhiên review"
        url="https://duhocannhien.vercel.app/testimonials"
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
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <h1 className="page-title">
            <span className="title-icon">⭐</span>
            Đánh giá khách hàng
          </h1>
          <p className="page-subtitle">
            Những chia sẻ chân thực từ học sinh đã du học Hàn Quốc thành công
          </p>
          <div className="rating-summary">
            <div className="rating-stars">
              {'⭐'.repeat(5)}
            </div>
            <div className="rating-text">
              <strong>{averageRating.toFixed(1)}/5.0</strong> từ {testimonials.length}+ đánh giá
            </div>
          </div>
        </motion.div>
      </div>

      <div className="testimonials-content">
        <div className="filters-section">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        <div className="testimonials-grid">
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="testimonial-card"
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    loading="lazy"
                    width="60"
                    height="60"
                  />
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-school">{testimonial.school}</p>
                  <p className="testimonial-major">{testimonial.major} • {testimonial.year}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {'⭐'.repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-category">
                <span className="category-badge">{filters.find(f => f.id === testimonial.category)?.icon} {filters.find(f => f.id === testimonial.category)?.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="cta-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-card"
          >
            <h2>Bạn cũng muốn có trải nghiệm tuyệt vời như vậy?</h2>
            <p>Hãy liên hệ với Du học An Nhiên ngay hôm nay để được tư vấn miễn phí!</p>
            <div className="cta-buttons">
              <a href="/contact" className="cta-btn primary">
                <span>💬</span>
                Liên hệ tư vấn
              </a>
              <a href="tel:0961321930" className="cta-btn secondary">
                <span>📞</span>
                0961321930
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

