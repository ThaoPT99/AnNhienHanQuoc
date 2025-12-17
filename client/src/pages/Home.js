import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Home.css';

const Home = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Du học An Nhiên",
    "description": "Tư vấn du học Hàn Quốc uy tín, chuyên nghiệp",
    "url": "https://duhocannhien.vercel.app",
    "logo": "https://duhocannhien.vercel.app/logo.png",
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
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Vietnam"
    },
    "serviceType": "Du học Hàn Quốc"
  };

  return (
    <div className="home">
      <SEO
        title="Du học An Nhiên - Du học Hàn Quốc chuyên nghiệp"
        description="Du học An Nhiên - Tư vấn du học Hàn Quốc uy tín, chuyên nghiệp. Đồng hành cùng bạn trên hành trình chinh phục ước mơ du học tại xứ sở Kim Chi. Dịch vụ tư vấn chọn trường, làm hồ sơ, xin visa Hàn Quốc."
        keywords="du học Hàn Quốc, tư vấn du học Hàn Quốc, du học Seoul, học bổng Hàn Quốc, visa Hàn Quốc, du học An Nhiên, tư vấn du học, làm hồ sơ du học Hàn Quốc"
        url="https://duhocannhien.vercel.app"
        structuredData={structuredData}
      />
      {/* Hero Section - Gen Z Style */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-blob hero-blob-1"></div>
          <div className="hero-blob hero-blob-2"></div>
          <div className="hero-blob hero-blob-3"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}></div>
            ))}
          </div>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
          >
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Khởi đầu hành trình mới</span>
              <span className="badge-icon">✨</span>
            </div>
            <h1 className="hero-title">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Du học Hàn Quốc
              </motion.span>
              <br />
              <motion.span
                className="gradient-text hero-title-main"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Khởi đầu tương lai
              </motion.span>
            </h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="subtitle-icon">🌟</span>
              Đồng hành cùng bạn trên hành trình chinh phục ước mơ du học tại xứ sở Kim Chi
              <span className="subtitle-icon">🌟</span>
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact" className="btn-primary hero-btn-primary">
                  <span className="btn-text">Tư vấn ngay</span>
                  <span className="btn-icon">💬</span>
                  <div className="btn-glow"></div>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/services" className="btn-secondary hero-btn-secondary">
                  <span className="btn-text">Tìm hiểu thêm</span>
                  <span className="btn-icon">🔍</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <div className="hero-image-wrapper">
            <img 
              src="https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg"
              alt="Khuôn viên đại học tại Seoul, Hàn Quốc - Du học An Nhiên"
              className="hero-img"
              loading="lazy"
              width="800"
              height="600"
            />
            <div className="hero-image-glow"></div>
            <div className="hero-image-shine"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Gen Z Style */}
      <section className="features section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-header">
            <div className="section-badge">
              <span className="badge-sparkle">✨</span>
              <span>Why Choose Us</span>
              <span className="badge-sparkle">✨</span>
            </div>
            <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
            <p className="section-subtitle">
              <span className="subtitle-emoji">💫</span>
              Với nhiều năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng nghìn học sinh
              <span className="subtitle-emoji">💫</span>
            </p>
          </div>
        </motion.div>
        <div className="features-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            whileHover={{ y: -15, rotateY: 5, scale: 1.03 }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🎓</div>
              <div className="feature-icon-glow"></div>
            </div>
            <h3>Tư vấn chuyên nghiệp</h3>
            <p>Đội ngũ tư vấn viên giàu kinh nghiệm, am hiểu về hệ thống giáo dục Hàn Quốc</p>
            <div className="feature-accent"></div>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
            whileHover={{ y: -15, rotateY: 5, scale: 1.03 }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">✈️</div>
              <div className="feature-icon-glow"></div>
            </div>
            <h3>Hỗ trợ toàn diện</h3>
            <p>Từ tư vấn, làm hồ sơ đến hỗ trợ sau khi nhập cảnh Hàn Quốc</p>
            <div className="feature-accent"></div>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            whileHover={{ y: -15, rotateY: 5, scale: 1.03 }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🏆</div>
              <div className="feature-icon-glow"></div>
            </div>
            <h3>Tỷ lệ thành công cao</h3>
            <p>Hàng nghìn học sinh đã thành công với chúng tôi</p>
            <div className="feature-accent"></div>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
            whileHover={{ y: -15, rotateY: 5, scale: 1.03 }}
          >
            <div className="feature-icon-wrapper">
              <div className="feature-icon">💼</div>
              <div className="feature-icon-glow"></div>
            </div>
            <h3>Hợp tác với nhiều trường</h3>
            <p>Mạng lưới đối tác rộng khắp tại Hàn Quốc</p>
            <div className="feature-accent"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="korea-pattern"></div>
        <div className="stats-container">
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="stat-icon">🇰🇷</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">1000+</h3>
              <span className="stat-plus">+</span>
            </div>
            <p className="stat-label">Học sinh đã du học</p>
            <p className="stat-korean">한국 유학생</p>
          </motion.div>
          
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="stat-icon">🏛️</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">50+</h3>
              <span className="stat-plus">+</span>
            </div>
            <p className="stat-label">Trường đối tác</p>
            <p className="stat-korean">파트너 학교</p>
          </motion.div>
          
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="stat-icon">🏆</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">95%</h3>
              <span className="stat-percent">%</span>
            </div>
            <p className="stat-label">Tỷ lệ thành công</p>
            <p className="stat-korean">성공률</p>
          </motion.div>
          
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="stat-icon">⭐</div>
            <div className="stat-number-wrapper">
              <h3 className="stat-number">10+</h3>
              <span className="stat-plus">+</span>
            </div>
            <p className="stat-label">Năm kinh nghiệm</p>
            <p className="stat-korean">경험 연수</p>
          </motion.div>
        </div>
        <div className="korea-pattern-bottom"></div>
      </section>

      {/* CTA Section - Gen Z Style */}
      <section className="cta-section">
        <div className="cta-background-animation">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
          <div className="cta-blob cta-blob-3"></div>
        </div>
        <div className="cta-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
        </div>
        <div className="cta-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-emoji">🚀</div>
            <h2 className="cta-title">
              <span className="cta-title-line">Sẵn sàng bắt đầu</span>
              <span className="cta-title-line gradient-text-cta">hành trình của bạn?</span>
            </h2>
            <p className="cta-subtitle">
              <span className="cta-subtitle-icon">💬</span>
              Liên hệ ngay để được tư vấn miễn phí
              <span className="cta-subtitle-icon">💬</span>
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/contact" className="cta-button">
                <span className="cta-button-text">Liên hệ ngay</span>
                <span className="cta-button-icon">👉</span>
                <div className="cta-button-shine"></div>
              </Link>
            </motion.div>
            <div className="cta-features">
              <div className="cta-feature-item">
                <span className="cta-feature-icon">✅</span>
                <span>Miễn phí 100%</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">⚡</span>
                <span>Phản hồi nhanh</span>
              </div>
              <div className="cta-feature-item">
                <span className="cta-feature-icon">🎯</span>
                <span>Tư vấn chuyên nghiệp</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

