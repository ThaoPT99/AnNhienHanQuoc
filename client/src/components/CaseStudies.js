import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CaseStudies.css';

const CaseStudies = () => {
  const [selectedCase, setSelectedCase] = useState(null);

  const caseStudies = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      age: 20,
      avatar: '👩‍🎓',
      school: 'Đại học Yonsei',
      major: 'Kinh doanh Quốc tế',
      scholarship: '50%',
      timeline: [
        { date: '01/2024', step: 'Đăng ký tư vấn', description: 'Liên hệ với Du học An Nhiên qua website' },
        { date: '02/2024', step: 'Chọn trường', description: 'Được tư vấn và chọn Đại học Yonsei' },
        { date: '03/2024', step: 'Nộp hồ sơ', description: 'Hoàn tất hồ sơ và nộp cho trường' },
        { date: '05/2024', step: 'Nhận thư mời', description: 'Nhận được thư mời nhập học từ Yonsei' },
        { date: '06/2024', step: 'Xin visa', description: 'Nộp hồ sơ xin visa tại Đại sứ quán' },
        { date: '08/2024', step: 'Nhận visa', description: 'Visa được chấp thuận thành công' },
        { date: '09/2024', step: 'Lên đường', description: 'Bay sang Hàn Quốc và nhập học' }
      ],
      results: {
        school: 'Đại học Yonsei (Top 3 Hàn Quốc)',
        scholarship: 'Học bổng 50% (4 năm)',
        topik: 'TOPIK 5',
        gpa: '3.8/4.5',
        partTimeJob: 'Có việc làm thêm tại Seoul'
      },
      testimonial: 'Cảm ơn Du học An Nhiên đã hỗ trợ tôi từ đầu đến cuối. Quy trình làm hồ sơ rất rõ ràng, tư vấn viên nhiệt tình. Tôi đã nhận được học bổng 50% và hiện đang học tập tại Yonsei - một trong những trường đại học hàng đầu Hàn Quốc!',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      video: null
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      age: 22,
      avatar: '👨‍🎓',
      school: 'Đại học Korea',
      major: 'Kỹ thuật Máy tính',
      scholarship: '70%',
      timeline: [
        { date: '09/2023', step: 'Đăng ký tư vấn', description: 'Tìm hiểu về du học Hàn Quốc' },
        { date: '10/2023', step: 'Học tiếng Hàn', description: 'Tham gia khóa học TOPIK tại An Nhiên' },
        { date: '12/2023', step: 'Thi TOPIK', description: 'Đạt TOPIK 4' },
        { date: '01/2024', step: 'Nộp hồ sơ', description: 'Nộp hồ sơ cho 3 trường đại học' },
        { date: '03/2024', step: 'Nhận thư mời', description: 'Nhận thư mời từ Đại học Korea' },
        { date: '05/2024', step: 'Xin visa', description: 'Nộp hồ sơ visa' },
        { date: '07/2024', step: 'Nhận visa', description: 'Visa được chấp thuận' },
        { date: '09/2024', step: 'Lên đường', description: 'Bắt đầu học tập tại Korea University' }
      ],
      results: {
        school: 'Đại học Korea (Top 5 Hàn Quốc)',
        scholarship: 'Học bổng 70% (4 năm)',
        topik: 'TOPIK 4 → TOPIK 6',
        gpa: '4.0/4.5',
        partTimeJob: 'Thực tập tại Samsung'
      },
      testimonial: 'Du học An Nhiên đã giúp tôi đạt được ước mơ du học tại một trong những trường đại học tốt nhất Hàn Quốc. Học bổng 70% giúp tôi giảm đáng kể chi phí. Hiện tôi đang thực tập tại Samsung và có cơ hội việc làm rất tốt sau khi tốt nghiệp.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      video: null
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      age: 19,
      avatar: '👩‍🎓',
      school: 'Đại học SNU',
      major: 'Y khoa',
      scholarship: 'KGSP (100%)',
      timeline: [
        { date: '06/2023', step: 'Đăng ký tư vấn', description: 'Tìm hiểu về học bổng KGSP' },
        { date: '07/2023', step: 'Chuẩn bị hồ sơ', description: 'Làm hồ sơ xin học bổng KGSP' },
        { date: '09/2023', step: 'Nộp hồ sơ', description: 'Nộp hồ sơ cho Đại sứ quán Hàn Quốc' },
        { date: '11/2023', step: 'Phỏng vấn', description: 'Vượt qua vòng phỏng vấn' },
        { date: '12/2023', step: 'Nhận học bổng', description: 'Được chấp thuận học bổng KGSP 100%' },
        { date: '02/2024', step: 'Xin visa', description: 'Nộp hồ sơ visa' },
        { date: '03/2024', step: 'Nhận visa', description: 'Visa được chấp thuận' },
        { date: '09/2024', step: 'Lên đường', description: 'Bắt đầu học tập tại SNU với học bổng toàn phần' }
      ],
      results: {
        school: 'Đại học Quốc gia Seoul (SNU) - #1 Hàn Quốc',
        scholarship: 'Học bổng KGSP 100% (bao gồm học phí, sinh hoạt phí, vé máy bay)',
        topik: 'TOPIK 6',
        gpa: '4.2/4.5',
        partTimeJob: 'Nghiên cứu tại phòng lab Y khoa'
      },
      testimonial: 'Tôi không thể tin được mình đã nhận được học bổng KGSP 100% để học tại SNU - trường đại học số 1 Hàn Quốc! Du học An Nhiên đã hỗ trợ tôi rất nhiều trong quá trình làm hồ sơ và phỏng vấn. Đây là cơ hội thay đổi cuộc đời tôi!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      video: null
    }
  ];

  const openCaseDetail = (caseStudy) => {
    setSelectedCase(caseStudy);
  };

  const closeCaseDetail = () => {
    setSelectedCase(null);
  };

  return (
    <div className="case-studies-section">
      <div className="case-studies-header">
        <h2>🌟 Câu chuyện thành công</h2>
        <p>Những học sinh đã đạt được ước mơ du học Hàn Quốc cùng Du học An Nhiên</p>
      </div>

      <div className="case-studies-grid">
        {caseStudies.map((caseStudy, index) => (
          <motion.div
            key={caseStudy.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="case-study-card"
            onClick={() => openCaseDetail(caseStudy)}
          >
            <div className="case-avatar">{caseStudy.avatar}</div>
            <div className="case-info">
              <h3 className="case-name">{caseStudy.name}</h3>
              <p className="case-school">{caseStudy.school}</p>
              <p className="case-major">{caseStudy.major}</p>
              <div className="case-scholarship">
                <span className="scholarship-badge">Học bổng {caseStudy.scholarship}</span>
              </div>
            </div>
            <div className="case-preview">
              <p className="case-quote">"{caseStudy.testimonial.substring(0, 100)}..."</p>
            </div>
            <button className="view-detail-btn">Xem chi tiết →</button>
          </motion.div>
        ))}
      </div>

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="case-detail-overlay"
            onClick={closeCaseDetail}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="case-detail-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-detail-btn" onClick={closeCaseDetail}>×</button>

              <div className="case-detail-header">
                <div className="detail-avatar">{selectedCase.avatar}</div>
                <div className="detail-info">
                  <h2>{selectedCase.name}</h2>
                  <p className="detail-school">{selectedCase.school}</p>
                  <p className="detail-major">{selectedCase.major}</p>
                </div>
              </div>

              <div className="case-detail-content">
                {/* Timeline */}
                <div className="detail-section">
                  <h3>📅 Hành trình</h3>
                  <div className="timeline">
                    {selectedCase.timeline.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="timeline-date">{item.date}</div>
                          <div className="timeline-step">{item.step}</div>
                          <div className="timeline-description">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="detail-section">
                  <h3>🏆 Kết quả đạt được</h3>
                  <div className="results-grid">
                    <div className="result-item">
                      <span className="result-icon">🏫</span>
                      <div>
                        <div className="result-label">Trường học</div>
                        <div className="result-value">{selectedCase.results.school}</div>
                      </div>
                    </div>
                    <div className="result-item">
                      <span className="result-icon">💰</span>
                      <div>
                        <div className="result-label">Học bổng</div>
                        <div className="result-value">{selectedCase.results.scholarship}</div>
                      </div>
                    </div>
                    <div className="result-item">
                      <span className="result-icon">📜</span>
                      <div>
                        <div className="result-label">TOPIK</div>
                        <div className="result-value">{selectedCase.results.topik}</div>
                      </div>
                    </div>
                    <div className="result-item">
                      <span className="result-icon">⭐</span>
                      <div>
                        <div className="result-label">GPA</div>
                        <div className="result-value">{selectedCase.results.gpa}</div>
                      </div>
                    </div>
                    <div className="result-item">
                      <span className="result-icon">💼</span>
                      <div>
                        <div className="result-label">Việc làm</div>
                        <div className="result-value">{selectedCase.results.partTimeJob}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="detail-section">
                  <h3>💬 Chia sẻ</h3>
                  <div className="testimonial-box">
                    <p>"{selectedCase.testimonial}"</p>
                    <div className="testimonial-author">— {selectedCase.name}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseStudies;

