import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import './Videos.css';

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    "name": "Video du học Hàn Quốc - Du học An Nhiên",
    "description": "Xem các video tư vấn, vlog du học sinh và tour trường đại học Hàn Quốc",
    "url": "https://duhocannhien.vercel.app/videos"
  };

  const categories = [
    { id: 'all', label: 'Tất cả', icon: '🎬' },
    { id: 'advice', label: 'Tư vấn', icon: '💬' },
    { id: 'vlog', label: 'Vlog', icon: '📹' },
    { id: 'tour', label: 'Tour trường', icon: '🏫' },
    { id: 'testimonial', label: 'Chia sẻ', icon: '⭐' }
  ];

  const videos = [
    {
      id: 1,
      title: 'Hướng dẫn du học Hàn Quốc 2025 - Tất cả những gì bạn cần biết',
      category: 'advice',
      thumbnail: `https://img.youtube.com/vi/TWGT9CRiqP4/maxresdefault.jpg`,
      youtubeId: 'TWGT9CRiqP4',
      duration: '15:30',
      views: '12.5K',
      date: '20/01/2025',
      description: 'Video hướng dẫn đầy đủ về du học Hàn Quốc: chi phí, visa, trường học, cuộc sống du học sinh.'
    },
    {
      id: 2,
      title: 'Vlog: Ngày đầu tiên của du học sinh tại Seoul',
      category: 'vlog',
      thumbnail: `https://img.youtube.com/vi/tdGtv0gHqHs/maxresdefault.jpg`,
      youtubeId: 'tdGtv0gHqHs',
      duration: '8:45',
      views: '8.2K',
      date: '18/01/2025',
      description: 'Chia sẻ trải nghiệm ngày đầu tiên của du học sinh tại Seoul, Hàn Quốc.'
    },
    {
      id: 3,
      title: 'Tour Đại học Yonsei - Trường đại học hàng đầu Hàn Quốc',
      category: 'tour',
      thumbnail: `https://img.youtube.com/vi/DEmg4pa0FtI/maxresdefault.jpg`,
      youtubeId: 'DEmg4pa0FtI',
      duration: '12:20',
      views: '15.3K',
      date: '15/01/2025',
      description: 'Tour tham quan khuôn viên Đại học Yonsei, một trong 3 trường top (SKY) tại Hàn Quốc.'
    },
    {
      id: 4,
      title: 'Chia sẻ: Từ TOPIK 2 đến TOPIK 6 trong 1 năm',
      category: 'testimonial',
      thumbnail: `https://img.youtube.com/vi/Ii-u6TWrCfk/maxresdefault.jpg`,
      youtubeId: 'Ii-u6TWrCfk',
      duration: '10:15',
      views: '9.8K',
      date: '12/01/2025',
      description: 'Chia sẻ kinh nghiệm học tiếng Hàn và đạt TOPIK 6 từ một du học sinh.'
    },
    {
      id: 5,
      title: 'Chi phí du học Hàn Quốc: Bao nhiêu tiền là đủ?',
      category: 'advice',
      thumbnail: `https://img.youtube.com/vi/BH4lc0eWuIE/maxresdefault.jpg`,
      youtubeId: 'BH4lc0eWuIE',
      duration: '14:30',
      views: '18.7K',
      date: '10/01/2025',
      description: 'Phân tích chi tiết về chi phí du học Hàn Quốc: học phí, sinh hoạt phí, nhà ở và các khoản khác.'
    },
    {
      id: 6,
      title: 'Vlog: Cuộc sống du học sinh tại Busan',
      category: 'vlog',
      thumbnail: `https://img.youtube.com/vi/UPG0UVa-YC4/maxresdefault.jpg`,
      youtubeId: 'UPG0UVa-YC4',
      duration: '9:25',
      views: '6.5K',
      date: '08/01/2025',
      description: 'Khám phá cuộc sống du học sinh tại Busan - thành phố biển xinh đẹp của Hàn Quốc.'
    },
    {
      id: 7,
      title: 'Tour Đại học Seoul National University (SNU)',
      category: 'tour',
      thumbnail: `https://img.youtube.com/vi/K4ZHE-GiOHw/maxresdefault.jpg`,
      youtubeId: 'K4ZHE-GiOHw',
      duration: '13:45',
      views: '11.2K',
      date: '05/01/2025',
      description: 'Tour tham quan trường đại học số 1 Hàn Quốc - Seoul National University.'
    },
    {
      id: 8,
      title: 'Chia sẻ: Xin học bổng KGSP thành công',
      category: 'testimonial',
      thumbnail: `https://img.youtube.com/vi/V632eleU8V4/maxresdefault.jpg`,
      youtubeId: 'V632eleU8V4',
      duration: '11:30',
      views: '14.9K',
      date: '03/01/2025',
      description: 'Chia sẻ kinh nghiệm xin học bổng chính phủ Hàn Quốc (KGSP) từ một học sinh đã thành công.'
    }
  ];

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="videos-page">
      <SEO
        title="Video du học Hàn Quốc - Du học An Nhiên"
        description="Xem các video tư vấn, vlog du học sinh và tour trường đại học Hàn Quốc. Hướng dẫn chi tiết về du học Hàn Quốc qua video."
        keywords="video du học Hàn Quốc, vlog du học sinh, tour trường đại học Hàn Quốc, tư vấn du học video, YouTube du học Hàn Quốc"
        url="https://duhocannhien.vercel.app/videos"
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
            <span className="title-icon">🎥</span>
            Video
          </h1>
          <p className="page-subtitle">
            Xem các video tư vấn, vlog du học sinh và tour trường đại học Hàn Quốc
          </p>
        </motion.div>
      </div>

      <div className="videos-content">
        <div className="categories-section">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className="videos-grid">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="video-card"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="video-thumbnail">
                <OptimizedImage src={video.thumbnail} alt={video.title} loading="lazy" width="400" height="225" />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
                <div className="video-duration">{video.duration}</div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <span className="video-views">👁️ {video.views} lượt xem</span>
                  <span className="video-date">📅 {video.date}</span>
                </div>
                <p className="video-description">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="video-modal-overlay"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="video-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-video-btn" onClick={() => setSelectedVideo(null)}>×</button>
            <div className="video-player-wrapper">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-modal-info">
              <h3 className="modal-video-title">{selectedVideo.title}</h3>
              <div className="modal-video-meta">
                <span>👁️ {selectedVideo.views} lượt xem</span>
                <span>📅 {selectedVideo.date}</span>
                <span>⏱️ {selectedVideo.duration}</span>
              </div>
              <p className="modal-video-description">{selectedVideo.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Videos;


