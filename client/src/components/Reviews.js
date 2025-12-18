import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Reviews.css';

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      school: 'Đại học Yonsei',
      rating: 5,
      date: '15/01/2025',
      text: 'Cảm ơn Du học An Nhiên đã hỗ trợ tôi từ đầu đến cuối. Tư vấn viên rất nhiệt tình, hồ sơ được làm rất cẩn thận. Tôi đã nhận được visa và sắp sang Hàn Quốc!',
      avatar: '👩‍🎓'
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      school: 'Đại học Korea',
      rating: 5,
      date: '12/01/2025',
      text: 'Dịch vụ tuyệt vời! Được tư vấn chi tiết về các trường, học phí, và cuộc sống tại Hàn. Giờ tôi đã có học bổng 50% tại Korea University.',
      avatar: '👨‍🎓'
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      school: 'Đại học SNU',
      rating: 5,
      date: '10/01/2025',
      text: 'Rất hài lòng với dịch vụ. Đội ngũ tư vấn chuyên nghiệp, hỗ trợ 24/7. Tôi đã đậu vào SNU - trường đại học số 1 Hàn Quốc!',
      avatar: '👩‍🎓'
    },
    {
      id: 4,
      name: 'Phạm Văn Đức',
      school: 'Đại học Hanyang',
      rating: 5,
      date: '08/01/2025',
      text: 'Quy trình làm hồ sơ rất rõ ràng, không phức tạp. Nhận được visa chỉ sau 3 tuần. Cảm ơn An Nhiên rất nhiều!',
      avatar: '👨‍🎓'
    },
    {
      id: 5,
      name: 'Hoàng Thị Lan',
      school: 'Đại học Sungkyunkwan',
      rating: 5,
      date: '05/01/2025',
      text: 'Tư vấn viên rất am hiểu về các trường và ngành học. Đã giúp tôi chọn được trường phù hợp với ngân sách và sở thích.',
      avatar: '👩‍🎓'
    }
  ];

  const averageRating = 5.0;
  const totalReviews = 127;

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2 className="reviews-title">⭐ Đánh giá từ học sinh</h2>
        <div className="reviews-summary">
          <div className="rating-display">
            <span className="rating-number">{averageRating}</span>
            <div className="rating-stars">{renderStars(5)}</div>
            <span className="rating-count">({totalReviews} đánh giá)</span>
          </div>
        </div>
      </div>

      <div className="reviews-carousel">
        <button className="carousel-btn prev" onClick={prevReview}>‹</button>
        
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="review-card"
        >
          <div className="review-header">
            <div className="review-avatar">{reviews[currentIndex].avatar}</div>
            <div className="review-info">
              <div className="review-name">{reviews[currentIndex].name}</div>
              <div className="review-school">{reviews[currentIndex].school}</div>
              <div className="review-rating">{renderStars(reviews[currentIndex].rating)}</div>
            </div>
            <div className="review-date">{reviews[currentIndex].date}</div>
          </div>
          <p className="review-text">"{reviews[currentIndex].text}"</p>
        </motion.div>

        <button className="carousel-btn next" onClick={nextReview}>›</button>
      </div>

      <div className="reviews-indicators">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <div className="reviews-cta">
        <a 
          href="https://www.facebook.com/duhocannhien/reviews" 
          target="_blank" 
          rel="noopener noreferrer"
          className="view-all-reviews-btn"
        >
          Xem tất cả đánh giá trên Facebook →
        </a>
      </div>
    </div>
  );
};

export default Reviews;
