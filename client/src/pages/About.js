import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './About.css';

const About = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Về chúng tôi - Du học An Nhiên",
    "description": "Tìm hiểu về Du học An Nhiên - Đơn vị tư vấn du học Hàn Quốc uy tín với nhiều năm kinh nghiệm",
    "url": "https://duhocannhien.vercel.app/about",
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "Du học An Nhiên",
      "description": "Đơn vị tư vấn du học Hàn Quốc chuyên nghiệp với nhiều năm kinh nghiệm",
      "url": "https://duhocannhien.vercel.app",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "219 P. Trung Kính, Trung Hòa",
        "addressLocality": "Cầu Giấy",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+84-961-321-930",
        "contactType": "customer service",
        "email": "annhienduhochan@gmail.com",
        "areaServed": "VN",
        "availableLanguage": "Vietnamese"
      },
      "sameAs": [
        "https://www.facebook.com/duhocannhien/",
        "https://www.tiktok.com/@hoanghannhat"
      ]
    }
  };

  return (
    <div className="about-page">
      <SEO
        title="Về chúng tôi - Du học An Nhiên"
        description="Tìm hiểu về Du học An Nhiên - Đơn vị tư vấn du học Hàn Quốc uy tín với nhiều năm kinh nghiệm, đồng hành cùng hàng nghìn học sinh trên hành trình du học. Đội ngũ tư vấn viên chuyên nghiệp, dịch vụ hỗ trợ toàn diện từ tư vấn đến sau khi nhập cảnh."
        keywords="về du học An Nhiên, giới thiệu du học Hàn Quốc, công ty tư vấn du học, đơn vị du học uy tín, tư vấn du học Hàn Quốc chuyên nghiệp"
        url="https://duhocannhien.vercel.app/about"
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
          <div className="header-emoji">🇰🇷</div>
          <h1 className="header-title">
            <span className="gradient-text-header">Về chúng tôi</span>
          </h1>
          <p className="header-subtitle">
            <span className="subtitle-icon">💭</span>
            Du học An Nhiên - Đồng hành cùng ước mơ của bạn
            <span className="subtitle-icon">💭</span>
          </p>
        </motion.div>
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
            <div className="about-text-header">
              <span className="about-emoji">👋</span>
              <h2 className="about-title">
                <span className="title-highlight">Chúng tôi</span> là ai?
              </h2>
            </div>
            <div className="about-paragraph-wrapper">
              <p className="about-paragraph">
                <span className="paragraph-icon">🎓</span>
                Du học An Nhiên là công ty tư vấn du học Hàn Quốc chuyên nghiệp với nhiều năm kinh nghiệm 
                trong lĩnh vực giáo dục quốc tế. Chúng tôi tự hào đã đồng hành cùng hàng nghìn học sinh, 
                sinh viên Việt Nam thực hiện ước mơ du học tại xứ sở Kim Chi.
              </p>
              <p className="about-paragraph">
                <span className="paragraph-icon">💼</span>
                Với đội ngũ tư vấn viên giàu kinh nghiệm, am hiểu sâu sắc về văn hóa và hệ thống giáo dục 
                Hàn Quốc, chúng tôi cam kết mang đến dịch vụ tư vấn chất lượng cao, hỗ trợ toàn diện từ 
                khâu chuẩn bị hồ sơ đến khi các bạn đặt chân đến Hàn Quốc.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://res.cloudinary.com/dy84xpayv/image/upload/v1765942857/z7335282956837_dccc007a84cec34742579005d959eaec_j7sjs7.jpg" 
              alt="Hội thảo du học Hàn Quốc - Du học An Nhiên - Đội ngũ tư vấn viên chuyên nghiệp"
              className="about-img"
              loading="lazy"
              width="800"
              height="600"
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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
          >
              <div className="value-icon-wrapper">
                <div className="value-icon">💎</div>
                <div className="value-icon-glow"></div>
              </div>
              <h3 className="value-title">Uy tín</h3>
              <p className="value-description">Xây dựng niềm tin qua chất lượng dịch vụ và sự minh bạch</p>
              <div className="value-badge">Trusted</div>
            </motion.div>
            
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              <div className="value-icon-wrapper">
                <div className="value-icon">🎯</div>
                <div className="value-icon-glow"></div>
              </div>
              <h3 className="value-title">Chuyên nghiệp</h3>
              <p className="value-description">Đội ngũ được đào tạo bài bản, quy trình làm việc chuyên nghiệp</p>
              <div className="value-badge">Pro</div>
            </motion.div>
            
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
            >
              <div className="value-icon-wrapper">
                <div className="value-icon">❤️</div>
                <div className="value-icon-glow"></div>
              </div>
              <h3 className="value-title">Tận tâm</h3>
              <p className="value-description">Luôn đặt lợi ích của học sinh lên hàng đầu</p>
              <div className="value-badge">Caring</div>
            </motion.div>
            
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              <div className="value-icon-wrapper">
                <div className="value-icon">🚀</div>
                <div className="value-icon-glow"></div>
              </div>
              <h3 className="value-title">Đổi mới</h3>
              <p className="value-description">Không ngừng cập nhật thông tin và cải thiện dịch vụ</p>
              <div className="value-badge">Innovative</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="contact-info-section section">
        <div className="contact-info-background">
          <div className="contact-blob contact-blob-1"></div>
          <div className="contact-blob contact-blob-2"></div>
        </div>
        <div className="contact-info-card">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact-header">
              <span className="contact-header-icon">💬</span>
              <h2 className="contact-title">Thông tin liên hệ</h2>
              <span className="contact-header-icon">💬</span>
            </div>
            <div className="contact-details">
              <motion.div
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="contact-icon-wrapper">
                  <span className="contact-icon">📍</span>
                  <div className="contact-icon-pulse"></div>
                </div>
                <div>
                  <h4>Địa chỉ</h4>
                  <p>219 P. Trung Kính, Trung Hòa, Cầu Giấy, Hà Nội</p>
                </div>
              </motion.div>
              <motion.div
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="contact-icon-wrapper">
                  <span className="contact-icon">📞</span>
                  <div className="contact-icon-pulse"></div>
                </div>
                <div>
                  <h4>Điện thoại</h4>
                  <p><a href="tel:0961321930">0961321930</a></p>
                </div>
              </motion.div>
              <motion.div
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="contact-icon-wrapper">
                  <span className="contact-icon">📧</span>
                  <div className="contact-icon-pulse"></div>
                </div>
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:annhienduhochan@gmail.com">annhienduhochan@gmail.com</a></p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

