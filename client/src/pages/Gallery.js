import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/gallery`);
        setImages(res.data || []);
        setError(null);
      } catch (err) {
        setError('Không thể tải thư viện ảnh. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [API_URL]);

  const groupedByCategory = images.reduce((acc, item) => {
    const cat = item.category || 'Khác';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Thư viện ảnh du học Hàn Quốc",
    "description": "Thư viện ảnh du học Hàn Quốc - Xem những hình ảnh về cuộc sống, trường học và trải nghiệm của học sinh tại Hàn Quốc",
    "url": "https://duhocannhien.vercel.app/gallery",
    "publisher": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    }
  };

  return (
    <div className="gallery-page">
      <SEO
        title="Thư viện ảnh - Du học An Nhiên"
        description="Thư viện ảnh du học Hàn Quốc - Xem những hình ảnh về cuộc sống, trường học và trải nghiệm của học sinh tại Hàn Quốc. Khám phá vẻ đẹp của Hàn Quốc qua những bức ảnh chân thực."
        keywords="ảnh du học Hàn Quốc, hình ảnh du học sinh, thư viện ảnh du học, cuộc sống du học Hàn Quốc, ảnh trường học Hàn Quốc"
        url="https://duhocannhien.vercel.app/gallery"
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
          <div className="header-emoji">📸</div>
          <h1 className="header-title">
            <span className="gradient-text-header">Thư viện ảnh</span>
          </h1>
          <p className="header-subtitle">
            <span className="subtitle-icon">🌟</span>
            Khám phá vẻ đẹp của Hàn Quốc và cuộc sống du học
            <span className="subtitle-icon">🌟</span>
          </p>
        </motion.div>
      </div>

      <section className="gallery-section section">
        {loading && <div className="loading">Đang tải thư viện ảnh...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && images.length === 0 && (
          <div className="no-data">Chưa có ảnh nào. Vui lòng quay lại sau.</div>
        )}

        {!loading && !error && Object.keys(groupedByCategory).map((category) => (
          <div key={category} className="gallery-category">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="category-title">
                <span className="category-icon">📁</span>
                {category}
                <span className="category-icon">📁</span>
              </h2>
            </motion.div>
            <div className="gallery-grid">
              {groupedByCategory[category].map((image, index) => (
                <motion.div
                  key={image.id}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ scale: 1.05, rotate: 2, zIndex: 10 }}
                  onClick={() => openModal(image)}
                >
                  <div className="image-wrapper">
                    <img 
                      src={image.url} 
                      alt={image.title ? `${image.title} - Du học An Nhiên` : `Ảnh thư viện du học Hàn Quốc - Du học An Nhiên`}
                      className="gallery-image"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <span className="zoom-icon">🔍</span>
                        {image.title && (
                          <p className="image-title">{image.title}</p>
                        )}
                      </div>
                      <div className="image-glow"></div>
                    </div>
                    <div className="gallery-item-badge">View</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, rotate: 10 }}
              transition={{ type: "spring", stiffness: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button 
                className="close-button" 
                onClick={closeModal}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
              <div className="modal-image-wrapper">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.alt || selectedImage.title || 'Ảnh thư viện du học Hàn Quốc - Du học An Nhiên'}
                  className="modal-image"
                  loading="lazy"
                  width="1200"
                  height="800"
                />
                {selectedImage.title && (
                  <div className="modal-image-title">{selectedImage.title}</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

