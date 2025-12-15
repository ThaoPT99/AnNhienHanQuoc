import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>Về chúng tôi</h1>
        <p>Du học An Nhiên - Đồng hành cùng ước mơ của bạn</p>
      </div>

      <section className="about-section section">
        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Chúng tôi là ai?</h2>
            <p>
              Du học An Nhiên là công ty tư vấn du học Hàn Quốc chuyên nghiệp với nhiều năm kinh nghiệm 
              trong lĩnh vực giáo dục quốc tế. Chúng tôi tự hào đã đồng hành cùng hàng nghìn học sinh, 
              sinh viên Việt Nam thực hiện ước mơ du học tại xứ sở Kim Chi.
            </p>
            <p>
              Với đội ngũ tư vấn viên giàu kinh nghiệm, am hiểu sâu sắc về văn hóa và hệ thống giáo dục 
              Hàn Quốc, chúng tôi cam kết mang đến dịch vụ tư vấn chất lượng cao, hỗ trợ toàn diện từ 
              khâu chuẩn bị hồ sơ đến khi các bạn đặt chân đến Hàn Quốc.
            </p>
          </motion.div>
          
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80" 
              alt="Văn phòng tư vấn du học"
              className="about-img"
            />
          </motion.div>
        </div>
      </section>

      <section className="values-section">
        <div className="section">
          <h2 className="section-title">Giá trị cốt lõi</h2>
          <div className="values-grid">
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="value-icon">💎</div>
              <h3>Uy tín</h3>
              <p>Xây dựng niềm tin qua chất lượng dịch vụ và sự minh bạch</p>
            </motion.div>
            
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="value-icon">🎯</div>
              <h3>Chuyên nghiệp</h3>
              <p>Đội ngũ được đào tạo bài bản, quy trình làm việc chuyên nghiệp</p>
            </motion.div>
            
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="value-icon">❤️</div>
              <h3>Tận tâm</h3>
              <p>Luôn đặt lợi ích của học sinh lên hàng đầu</p>
            </motion.div>
            
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="value-icon">🚀</div>
              <h3>Đổi mới</h3>
              <p>Không ngừng cập nhật thông tin và cải thiện dịch vụ</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="contact-info-section section">
        <div className="contact-info-card">
          <h2>Thông tin liên hệ</h2>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Địa chỉ</h4>
                <p>219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Điện thoại</h4>
                <p><a href="tel:0961321930">0961321930</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

