import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Chi phí du học Hàn Quốc là bao nhiêu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chi phí du học Hàn Quốc dao động từ 150-300 triệu VNĐ/năm tùy thuộc vào trường và ngành học. Bao gồm học phí (100-200 triệu), sinh hoạt phí (50-100 triệu), và các chi phí khác."
        }
      },
      {
        "@type": "Question",
        "name": "Cần TOPIK bao nhiêu để du học Hàn Quốc?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Để vào đại học Hàn Quốc, bạn cần đạt TOPIK level 3-4 trở lên. Một số trường yêu cầu TOPIK 5-6 cho các ngành đặc biệt. Du học An Nhiên có chương trình luyện thi TOPIK miễn phí cho học sinh."
        }
      },
      {
        "@type": "Question",
        "name": "Du học Hàn Quốc có được làm thêm không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Có, du học sinh Hàn Quốc được phép làm thêm tối đa 20 giờ/tuần trong học kỳ và 40 giờ/tuần trong kỳ nghỉ. Mức lương làm thêm khoảng 8,000-12,000 won/giờ (150,000-220,000 VNĐ/giờ)."
        }
      },
      {
        "@type": "Question",
        "name": "Thời gian xin visa du học Hàn Quốc mất bao lâu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Thời gian xử lý visa D-2 (du học) thường mất 2-4 tuần sau khi nộp hồ sơ đầy đủ. Tổng thời gian từ chuẩn bị hồ sơ đến nhận visa khoảng 3-6 tháng."
        }
      },
      {
        "@type": "Question",
        "name": "Có học bổng du học Hàn Quốc không?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Có nhiều loại học bổng: học bổng chính phủ Hàn Quốc (KGSP), học bổng từ trường đại học (30-100% học phí), học bổng dựa trên thành tích học tập. Du học An Nhiên hỗ trợ tư vấn và làm hồ sơ xin học bổng."
        }
      }
    ]
  };

  const faqCategories = [
    {
      id: 'general',
      name: 'Tổng quan',
      icon: '📋'
    },
    {
      id: 'cost',
      name: 'Chi phí',
      icon: '💰'
    },
    {
      id: 'visa',
      name: 'Visa & Hồ sơ',
      icon: '📝'
    },
    {
      id: 'school',
      name: 'Trường học',
      icon: '🏫'
    },
    {
      id: 'life',
      name: 'Cuộc sống',
      icon: '🏠'
    },
    {
      id: 'work',
      name: 'Việc làm',
      icon: '💼'
    }
  ];

  const faqs = [
    // Tổng quan
    {
      id: 1,
      category: 'general',
      question: 'Du học Hàn Quốc có khó không?',
      answer: 'Du học Hàn Quốc không quá khó nhưng cần sự chuẩn bị kỹ lưỡng. Bạn cần đạt TOPIK 3-4, có sổ tiết kiệm tối thiểu 10,000 USD, và chuẩn bị hồ sơ đầy đủ. Với sự hỗ trợ của Du học An Nhiên, quá trình sẽ trở nên dễ dàng hơn nhiều.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Tại sao nên chọn du học Hàn Quốc?',
      answer: 'Hàn Quốc có nền giáo dục chất lượng cao, nhiều trường đại học nằm trong top thế giới. Chi phí hợp lý hơn so với các nước phương Tây, văn hóa gần gũi với Việt Nam, và cơ hội việc làm tốt sau khi tốt nghiệp.'
    },
    {
      id: 3,
      category: 'general',
      question: 'Du học Hàn Quốc mất bao nhiêu thời gian?',
      answer: 'Thời gian du học đại học Hàn Quốc thường là 4 năm. Nếu học tiếng Hàn trước (6-12 tháng) thì tổng thời gian là 4.5-5 năm. Học thạc sĩ mất 2 năm, tiến sĩ 3-4 năm.'
    },
    {
      id: 4,
      category: 'general',
      question: 'Có cần biết tiếng Hàn trước khi du học không?',
      answer: 'Không bắt buộc, nhưng nên học trước. Bạn có thể học tiếng Hàn tại Việt Nam hoặc học tại Hàn Quốc (6-12 tháng) trước khi vào đại học. Du học An Nhiên có chương trình luyện thi TOPIK miễn phí.'
    },
    // Chi phí
    {
      id: 5,
      category: 'cost',
      question: 'Chi phí du học Hàn Quốc là bao nhiêu?',
      answer: 'Chi phí du học Hàn Quốc dao động từ 150-300 triệu VNĐ/năm tùy thuộc vào trường và ngành học. Bao gồm: Học phí (100-200 triệu/năm), Sinh hoạt phí (50-100 triệu/năm), Nhà ở (20-50 triệu/năm), Bảo hiểm và các chi phí khác (10-20 triệu/năm).'
    },
    {
      id: 6,
      category: 'cost',
      question: 'Chi phí học tiếng Hàn tại Hàn Quốc là bao nhiêu?',
      answer: 'Học phí khóa tiếng Hàn tại Hàn Quốc khoảng 3-5 triệu won/kỳ (60-100 triệu VNĐ/kỳ). Một năm có 4 kỳ, tổng chi phí khoảng 240-400 triệu VNĐ/năm (chưa bao gồm sinh hoạt phí).'
    },
    {
      id: 7,
      category: 'cost',
      question: 'Có cách nào giảm chi phí du học Hàn Quốc không?',
      answer: 'Có nhiều cách: Xin học bổng (30-100% học phí), Làm thêm (8,000-12,000 won/giờ), Chọn trường ở thành phố nhỏ (chi phí thấp hơn), Ở ký túc xá (rẻ hơn thuê nhà), Tiết kiệm chi tiêu hàng ngày.'
    },
    {
      id: 8,
      category: 'cost',
      question: 'Cần bao nhiêu tiền trong sổ tiết kiệm để xin visa?',
      answer: 'Bạn cần có sổ tiết kiệm tối thiểu 10,000 USD (khoảng 240 triệu VNĐ) và phải gửi ít nhất 6 tháng trước khi nộp hồ sơ. Số tiền này chứng minh bạn có đủ khả năng tài chính để du học.'
    },
    // Visa & Hồ sơ
    {
      id: 9,
      category: 'visa',
      question: 'Cần TOPIK bao nhiêu để du học Hàn Quốc?',
      answer: 'Để vào đại học Hàn Quốc, bạn cần đạt TOPIK level 3-4 trở lên. Một số trường yêu cầu TOPIK 5-6 cho các ngành đặc biệt như Y, Luật. Du học An Nhiên có chương trình luyện thi TOPIK miễn phí cho học sinh.'
    },
    {
      id: 10,
      category: 'visa',
      question: 'Thời gian xin visa du học Hàn Quốc mất bao lâu?',
      answer: 'Thời gian xử lý visa D-2 (du học) thường mất 2-4 tuần sau khi nộp hồ sơ đầy đủ. Tổng thời gian từ chuẩn bị hồ sơ đến nhận visa khoảng 3-6 tháng, tùy thuộc vào thời điểm nộp hồ sơ.'
    },
    {
      id: 11,
      category: 'visa',
      question: 'Hồ sơ du học Hàn Quốc cần những gì?',
      answer: 'Hồ sơ du học Hàn Quốc bao gồm: Bằng tốt nghiệp và bảng điểm (có công chứng), Chứng chỉ TOPIK, Sổ tiết kiệm và giấy chứng nhận số dư, Giấy khai sinh, Hộ chiếu, Ảnh thẻ, Thư giới thiệu, Kế hoạch học tập. Du học An Nhiên hỗ trợ chuẩn bị toàn bộ hồ sơ.'
    },
    {
      id: 12,
      category: 'visa',
      question: 'Tỷ lệ đậu visa du học Hàn Quốc là bao nhiêu?',
      answer: 'Tỷ lệ đậu visa du học Hàn Quốc trung bình khoảng 85-90%. Với sự hỗ trợ chuyên nghiệp của Du học An Nhiên, tỷ lệ thành công của chúng tôi là hơn 95%. Chúng tôi cam kết hoàn tiền nếu không đậu visa.'
    },
    {
      id: 13,
      category: 'visa',
      question: 'Có thể xin visa du học Hàn Quốc nhiều lần không?',
      answer: 'Có, bạn có thể xin lại visa nếu lần đầu không đậu. Tuy nhiên, cần xác định và khắc phục lý do bị từ chối. Du học An Nhiên sẽ hỗ trợ phân tích và cải thiện hồ sơ cho lần xin tiếp theo.'
    },
    // Trường học
    {
      id: 14,
      category: 'school',
      question: 'Nên chọn trường nào khi du học Hàn Quốc?',
      answer: 'Nên chọn trường dựa trên: Ngành học bạn muốn theo đuổi, Khả năng tài chính, Vị trí địa lý (Seoul đắt hơn các thành phố khác), Ranking và uy tín của trường, Cơ hội học bổng. Du học An Nhiên sẽ tư vấn chọn trường phù hợp nhất với bạn.'
    },
    {
      id: 15,
      category: 'school',
      question: 'Có học bổng du học Hàn Quốc không?',
      answer: 'Có nhiều loại học bổng: Học bổng chính phủ Hàn Quốc (KGSP) - 100% học phí + sinh hoạt phí, Học bổng từ trường đại học (30-100% học phí), Học bổng dựa trên thành tích học tập. Du học An Nhiên hỗ trợ tư vấn và làm hồ sơ xin học bổng.'
    },
    {
      id: 16,
      category: 'school',
      question: 'Các ngành học hot tại Hàn Quốc là gì?',
      answer: 'Các ngành học được nhiều sinh viên Việt Nam chọn: Kinh tế, Quản trị kinh doanh, Công nghệ thông tin, Thiết kế, Du lịch - Nhà hàng - Khách sạn, Ngôn ngữ Hàn Quốc, Y tế, Giáo dục.'
    },
    {
      id: 17,
      category: 'school',
      question: 'Có thể chuyển trường khi đang du học không?',
      answer: 'Có thể chuyển trường, nhưng cần đáp ứng điều kiện: Đã học ít nhất 1 học kỳ tại trường cũ, Được trường mới chấp nhận, Có TOPIK đủ yêu cầu, Hồ sơ hợp lệ. Quá trình chuyển trường khá phức tạp, nên tư vấn với Du học An Nhiên.'
    },
    // Cuộc sống
    {
      id: 18,
      category: 'life',
      question: 'Du học sinh Hàn Quốc ở đâu?',
      answer: 'Du học sinh có thể ở: Ký túc xá trường (rẻ nhất, 20-40 triệu/năm), Phòng trọ (40-80 triệu/năm), Homestay (60-100 triệu/năm). Du học An Nhiên hỗ trợ tìm chỗ ở phù hợp với ngân sách và nhu cầu của bạn.'
    },
    {
      id: 19,
      category: 'life',
      question: 'Chi phí sinh hoạt tại Hàn Quốc là bao nhiêu?',
      answer: 'Chi phí sinh hoạt tại Hàn Quốc khoảng 50-100 triệu VNĐ/tháng, bao gồm: Ăn uống (20-40 triệu), Nhà ở (20-50 triệu), Đi lại (3-5 triệu), Điện nước internet (5-10 triệu), Chi tiêu cá nhân (10-20 triệu).'
    },
    {
      id: 20,
      category: 'life',
      question: 'Có khó thích nghi với cuộc sống tại Hàn Quốc không?',
      answer: 'Thời gian đầu có thể khó khăn do khác biệt văn hóa và ngôn ngữ. Tuy nhiên, văn hóa Hàn Quốc có nhiều nét tương đồng với Việt Nam nên dễ thích nghi. Thường mất 3-6 tháng để quen với cuộc sống mới. Du học An Nhiên hỗ trợ bạn trong suốt quá trình thích nghi.'
    },
    {
      id: 21,
      category: 'life',
      question: 'Có bảo hiểm y tế cho du học sinh không?',
      answer: 'Có, du học sinh bắt buộc phải tham gia bảo hiểm y tế quốc gia Hàn Quốc (NHIS). Phí bảo hiểm khoảng 50,000-100,000 won/tháng (1-2 triệu VNĐ/tháng). Bảo hiểm này chi trả 70-80% chi phí khám chữa bệnh.'
    },
    // Việc làm
    {
      id: 22,
      category: 'work',
      question: 'Du học Hàn Quốc có được làm thêm không?',
      answer: 'Có, du học sinh Hàn Quốc được phép làm thêm tối đa 20 giờ/tuần trong học kỳ và 40 giờ/tuần trong kỳ nghỉ. Mức lương làm thêm khoảng 8,000-12,000 won/giờ (150,000-220,000 VNĐ/giờ). Cần có giấy phép làm thêm từ trường.'
    },
    {
      id: 23,
      category: 'work',
      question: 'Có thể làm thêm những công việc gì?',
      answer: 'Du học sinh có thể làm: Phục vụ nhà hàng, quán cà phê, Bán hàng tại cửa hàng tiện lợi, Giao hàng, Dạy tiếng Việt, Dịch thuật, Làm tại xưởng (cần TOPIK cao hơn). Du học An Nhiên có thể giới thiệu việc làm thêm phù hợp.'
    },
    {
      id: 24,
      category: 'work',
      question: 'Cơ hội việc làm sau khi tốt nghiệp tại Hàn Quốc?',
      answer: 'Cơ hội việc làm rất tốt: Nhiều công ty Hàn Quốc đầu tư vào Việt Nam, Có thể làm việc tại Hàn Quốc nếu có visa E-7, Làm việc tại các công ty đa quốc gia, Mức lương cao hơn so với tốt nghiệp trong nước. Du học An Nhiên hỗ trợ tư vấn định hướng nghề nghiệp.'
    },
    {
      id: 25,
      category: 'work',
      question: 'Có thể ở lại Hàn Quốc sau khi tốt nghiệp không?',
      answer: 'Có, bạn có thể ở lại Hàn Quốc nếu: Tìm được việc làm và có visa E-7, Kết hôn với người Hàn Quốc, Đầu tư hoặc kinh doanh, Có visa D-10 (tìm việc) trong 6 tháng sau tốt nghiệp. Du học An Nhiên hỗ trợ tư vấn về visa và cơ hội việc làm.'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <SEO
        title="Câu hỏi thường gặp - Du học An Nhiên"
        description="Tổng hợp các câu hỏi thường gặp về du học Hàn Quốc: chi phí, visa, trường học, cuộc sống, việc làm. Tư vấn miễn phí từ Du học An Nhiên."
        keywords="câu hỏi du học Hàn Quốc, FAQ du học Hàn Quốc, chi phí du học Hàn Quốc, visa du học Hàn Quốc, TOPIK, học bổng Hàn Quốc, làm thêm tại Hàn Quốc"
        url="https://duhocannhien.vercel.app/faq"
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
            <span className="title-icon">❓</span>
            Câu hỏi thường gặp
          </h1>
          <p className="page-subtitle">
            Tìm câu trả lời cho những thắc mắc của bạn về du học Hàn Quốc
          </p>
        </motion.div>
      </div>

      <div className="faq-content">
        <div className="faq-search-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="faq-categories">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="faq-item"
              >
                <button
                  className={`faq-question ${openIndex === index ? 'open' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className="question-icon">{openIndex === index ? '−' : '+'}</span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="faq-answer-wrapper"
                >
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <div className="no-results">
              <p>Không tìm thấy câu hỏi phù hợp. Vui lòng thử lại với từ khóa khác.</p>
            </div>
          )}
        </div>

        <div className="faq-contact-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-card"
          >
            <h3>Vẫn còn thắc mắc?</h3>
            <p>Nếu bạn không tìm thấy câu trả lời, hãy liên hệ với chúng tôi để được tư vấn miễn phí!</p>
            <div className="contact-buttons">
              <a href="/contact" className="contact-btn primary">
                <span>💬</span>
                Liên hệ ngay
              </a>
              <a href="tel:0961321930" className="contact-btn secondary">
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

export default FAQ;

