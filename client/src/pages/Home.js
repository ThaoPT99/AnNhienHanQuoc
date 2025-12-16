import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Du học Hàn Quốc<br />
              <span className="gradient-text">Khởi đầu tương lai</span>
            </h1>
            <p className="hero-subtitle">
              Đồng hành cùng bạn trên hành trình chinh phục ước mơ du học tại xứ sở Kim Chi
            </p>
            <div className="hero-buttons">
              <Link to="/contact" className="btn-primary">Tư vấn ngay</Link>
              <Link to="/services" className="btn-secondary">Tìm hiểu thêm</Link>
            </div>
          </motion.div>
        </div>
        <div className="hero-image">
          <img 
            src="https://i.pinimg.com/1200x/83/55/2f/83552f3bd961a737f6dc01fb1b4e83aa.jpg"
            alt="Khuôn viên đại học tại Seoul, Hàn Quốc"
            className="hero-img"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <h2 className="section-title">Tại sao chọn chúng tôi?</h2>
        <p className="section-subtitle">
          Với nhiều năm kinh nghiệm, chúng tôi tự hào là đối tác tin cậy của hàng nghìn học sinh
        </p>
        <div className="features-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="feature-icon">🎓</div>
            <h3>Tư vấn chuyên nghiệp</h3>
            <p>Đội ngũ tư vấn viên giàu kinh nghiệm, am hiểu về hệ thống giáo dục Hàn Quốc</p>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="feature-icon">✈️</div>
            <h3>Hỗ trợ toàn diện</h3>
            <p>Từ tư vấn, làm hồ sơ đến hỗ trợ sau khi sang Hàn Quốc</p>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="feature-icon">🏆</div>
            <h3>Tỷ lệ thành công cao</h3>
            <p>Hàng nghìn học sinh đã thành công với chúng tôi</p>
          </motion.div>
          
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="feature-icon">💼</div>
            <h3>Hợp tác với nhiều trường</h3>
            <p>Mạng lưới đối tác rộng khắp tại Hàn Quốc</p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>1000+</h3>
            <p>Học sinh đã du học</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Trường đối tác</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Tỷ lệ thành công</p>
          </div>
          <div className="stat-item">
            <h3>10+</h3>
            <p>Năm kinh nghiệm</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Sẵn sàng bắt đầu hành trình của bạn?</h2>
          <p>Liên hệ ngay để được tư vấn miễn phí</p>
          <Link to="/contact" className="btn-primary">Liên hệ ngay</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

