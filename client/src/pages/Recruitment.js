import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Recruitment.css';

const Recruitment = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: '',
    cv: null
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "Tuyển dụng - Du học An Nhiên",
    "description": "Cơ hội nghề nghiệp tại Du học An Nhiên - Công ty tư vấn du học Hàn Quốc hàng đầu. Tìm kiếm nhân tài đồng hành cùng chúng tôi phát triển.",
    "identifier": {
      "@type": "PropertyValue",
      "name": "Du học An Nhiên",
      "value": "RECRUITMENT-2025"
    },
    "datePosted": "2025-01-20",
    "validThrough": "2025-12-31",
    "employmentType": "FULL_TIME, PART_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": "Du học An Nhiên",
      "sameAs": "https://duhocannhien.vercel.app",
      "logo": "https://duhocannhien.vercel.app/logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa",
        "addressLocality": "Cầu Giấy",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "VND",
      "value": {
        "@type": "QuantitativeValue",
        "minValue": 8000000,
        "maxValue": 20000000,
        "unitText": "MONTH"
      }
    }
  };

  const jobPositions = [
    {
      id: 1,
      title: 'Tư vấn viên du học',
      department: 'Tư vấn',
      type: 'Toàn thời gian',
      location: 'Hà Nội',
      salary: '8-15 triệu/tháng',
      requirements: [
        'Tốt nghiệp Đại học trở lên',
        'Có kinh nghiệm tư vấn du học hoặc làm việc tại Hàn Quốc',
        'Thành thạo tiếng Hàn (TOPIK 4 trở lên)',
        'Kỹ năng giao tiếp tốt, nhiệt tình',
        'Có tinh thần trách nhiệm cao'
      ],
      benefits: [
        'Lương thưởng hấp dẫn',
        'Bảo hiểm đầy đủ',
        'Đào tạo nâng cao nghiệp vụ',
        'Môi trường làm việc chuyên nghiệp',
        'Cơ hội thăng tiến'
      ],
      description: 'Chúng tôi đang tìm kiếm các tư vấn viên du học có kinh nghiệm để tư vấn và hỗ trợ học sinh trong quá trình du học Hàn Quốc.'
    },
    {
      id: 2,
      title: 'Nhân viên Marketing',
      department: 'Marketing',
      type: 'Toàn thời gian',
      location: 'Hà Nội',
      salary: '10-18 triệu/tháng',
      requirements: [
        'Tốt nghiệp Đại học chuyên ngành Marketing/Truyền thông',
        'Kinh nghiệm ít nhất 1 năm trong lĩnh vực Marketing',
        'Thành thạo các công cụ Marketing online (Facebook Ads, Google Ads)',
        'Kỹ năng viết content, thiết kế cơ bản',
        'Sáng tạo, năng động'
      ],
      benefits: [
        'Lương thưởng theo hiệu quả công việc',
        'Bảo hiểm đầy đủ',
        'Được đào tạo các kỹ năng mới',
        'Làm việc trong môi trường trẻ trung, năng động',
        'Cơ hội phát triển nghề nghiệp'
      ],
      description: 'Tuyển dụng nhân viên Marketing để phát triển thương hiệu và thu hút khách hàng mới thông qua các kênh digital marketing.'
    },
    {
      id: 3,
      title: 'Giáo viên tiếng Hàn',
      department: 'Đào tạo',
      type: 'Bán thời gian / Toàn thời gian',
      location: 'Hà Nội',
      salary: 'Theo giờ / 12-20 triệu/tháng',
      requirements: [
        'Tốt nghiệp Đại học chuyên ngành tiếng Hàn hoặc có TOPIK 6',
        'Có kinh nghiệm giảng dạy tiếng Hàn',
        'Phương pháp giảng dạy hiện đại, dễ hiểu',
        'Nhiệt tình, tận tâm với học viên',
        'Có chứng chỉ sư phạm là một lợi thế'
      ],
      benefits: [
        'Lương cạnh tranh',
        'Lịch làm việc linh hoạt',
        'Được đào tạo phương pháp giảng dạy mới',
        'Môi trường làm việc chuyên nghiệp',
        'Cơ hội tham gia các khóa đào tạo nâng cao'
      ],
      description: 'Tuyển dụng giáo viên tiếng Hàn để giảng dạy và luyện thi TOPIK cho học sinh có nhu cầu du học Hàn Quốc.'
    },
    {
      id: 4,
      title: 'Nhân viên Hành chính - Nhân sự',
      department: 'Hành chính',
      type: 'Toàn thời gian',
      location: 'Hà Nội',
      salary: '7-12 triệu/tháng',
      requirements: [
        'Tốt nghiệp Đại học',
        'Kinh nghiệm làm việc văn phòng',
        'Thành thạo tin học văn phòng',
        'Kỹ năng giao tiếp, tổ chức tốt',
        'Cẩn thận, tỉ mỉ'
      ],
      benefits: [
        'Lương ổn định',
        'Bảo hiểm đầy đủ',
        'Môi trường làm việc ổn định',
        'Được đào tạo các kỹ năng mới',
        'Cơ hội phát triển'
      ],
      description: 'Tuyển dụng nhân viên hành chính để quản lý hồ sơ, tài liệu và hỗ trợ các hoạt động văn phòng.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      cv: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form ở đây
    alert('Cảm ơn bạn đã ứng tuyển! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      message: '',
      cv: null
    });
    setSelectedJob(null);
  };

  return (
    <div className="recruitment-page">
      <SEO
        title="Tuyển dụng - Du học An Nhiên"
        description="Cơ hội nghề nghiệp tại Du học An Nhiên - Công ty tư vấn du học Hàn Quốc hàng đầu. Tuyển dụng tư vấn viên, nhân viên marketing, giáo viên tiếng Hàn và các vị trí khác. Môi trường làm việc chuyên nghiệp, lương thưởng hấp dẫn."
        keywords="tuyển dụng du học Hàn Quốc, việc làm tư vấn du học, tuyển dụng giáo viên tiếng Hàn, việc làm marketing, cơ hội nghề nghiệp, du học An Nhiên tuyển dụng"
        url="https://duhocannhien.vercel.app/recruitment"
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
            <span className="title-icon">💼</span>
            Tuyển dụng
          </h1>
          <p className="page-subtitle">
            Cơ hội nghề nghiệp tại Du học An Nhiên - Đồng hành cùng chúng tôi phát triển
          </p>
        </motion.div>
      </div>

      <div className="recruitment-content">
        <section className="why-join-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-container"
          >
            <h2 className="section-title">
              <span className="title-icon">🌟</span>
              Tại sao chọn Du học An Nhiên?
            </h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3>Lương thưởng hấp dẫn</h3>
                <p>Mức lương cạnh tranh, thưởng theo hiệu quả công việc</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">📚</div>
                <h3>Đào tạo chuyên nghiệp</h3>
                <p>Được đào tạo nâng cao nghiệp vụ và kỹ năng mới</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🚀</div>
                <h3>Cơ hội thăng tiến</h3>
                <p>Môi trường làm việc tạo điều kiện phát triển sự nghiệp</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🤝</div>
                <h3>Môi trường thân thiện</h3>
                <p>Làm việc trong đội ngũ trẻ trung, năng động, đoàn kết</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🏥</div>
                <h3>Bảo hiểm đầy đủ</h3>
                <p>Bảo hiểm xã hội, bảo hiểm y tế theo quy định</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <h3>Làm việc có ý nghĩa</h3>
                <p>Đồng hành cùng học sinh thực hiện ước mơ du học</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="positions-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-container"
          >
            <h2 className="section-title">
              <span className="title-icon">📋</span>
              Vị trí đang tuyển dụng
            </h2>
            <div className="positions-grid">
              {jobPositions.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="position-card"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="position-header">
                    <h3 className="position-title">{job.title}</h3>
                    <span className="position-badge">{job.department}</span>
                  </div>
                  <div className="position-info">
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">⏰</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">💵</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                  <p className="position-description">{job.description}</p>
                  <button className="apply-btn">Xem chi tiết & Ứng tuyển</button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="job-modal-overlay"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="job-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedJob(null)}>×</button>
              <div className="modal-header">
                <h2>{selectedJob.title}</h2>
                <span className="modal-badge">{selectedJob.department}</span>
              </div>
              <div className="modal-info">
                <div className="modal-info-item">
                  <strong>📍 Địa điểm:</strong> {selectedJob.location}
                </div>
                <div className="modal-info-item">
                  <strong>⏰ Loại hình:</strong> {selectedJob.type}
                </div>
                <div className="modal-info-item">
                  <strong>💵 Mức lương:</strong> {selectedJob.salary}
                </div>
              </div>
              <div className="modal-content">
                <div className="modal-section">
                  <h3>📝 Mô tả công việc</h3>
                  <p>{selectedJob.description}</p>
                </div>
                <div className="modal-section">
                  <h3>✅ Yêu cầu</h3>
                  <ul>
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="modal-section">
                  <h3>🎁 Quyền lợi</h3>
                  <ul>
                    {selectedJob.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button 
                className="apply-now-btn"
                onClick={() => {
                  setFormData(prev => ({ ...prev, position: selectedJob.title }));
                  setSelectedJob(null);
                  document.querySelector('.application-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ứng tuyển ngay
              </button>
            </motion.div>
          </motion.div>
        )}

        <section className="application-section application-form">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-container"
          >
            <h2 className="section-title">
              <span className="title-icon">📝</span>
              Đơn ứng tuyển
            </h2>
            <form className="application-form-content" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="0123456789"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="position">Vị trí ứng tuyển *</label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn vị trí</option>
                    {jobPositions.map(job => (
                      <option key={job.id} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="experience">Kinh nghiệm làm việc</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Mô tả kinh nghiệm làm việc của bạn..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Thư xin việc</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Viết thư xin việc của bạn tại đây..."
                />
              </div>
              <div className="form-group">
                <label htmlFor="cv">Upload CV/Resume (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  id="cv"
                  name="cv"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                {formData.cv && (
                  <p className="file-name">📎 {formData.cv.name}</p>
                )}
              </div>
              <button type="submit" className="submit-btn">
                <span>Gửi đơn ứng tuyển</span>
                <span className="btn-icon">✉️</span>
              </button>
            </form>
          </motion.div>
        </section>

        <section className="contact-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-container"
          >
            <h2 className="section-title">
              <span className="title-icon">📞</span>
              Liên hệ với chúng tôi
            </h2>
            <div className="contact-info">
              <p>Nếu bạn có bất kỳ câu hỏi nào về vị trí tuyển dụng, vui lòng liên hệ:</p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <a href="mailto:annhienduhochan@gmail.com">annhienduhochan@gmail.com</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <a href="tel:0961321930">0961321930</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa, Cầu Giấy, Hà Nội</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Recruitment;

