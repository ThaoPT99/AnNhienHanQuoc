import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Thư viện ảnh</h1>
        <p>Khám phá vẻ đẹp của Hàn Quốc và cuộc sống du học</p>
      </div>

      <section className="gallery-section section">
        {loading && <div className="loading">Đang tải thư viện ảnh...</div>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && images.length === 0 && (
          <div className="no-data">Chưa có ảnh nào. Vui lòng quay lại sau.</div>
        )}

        {!loading && !error && Object.keys(groupedByCategory).map((category) => (
          <div key={category} className="gallery-category">
            <h2 className="category-title">{category}</h2>
            <div className="gallery-grid">
              {groupedByCategory[category].map((image, index) => (
                <motion.div
                  key={image.id}
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => openModal(image)}
                >
                  <div className="image-wrapper">
                    <img 
                      src={image.url} 
                      alt={image.title || 'Ảnh thư viện'}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <span className="zoom-icon">🔍</span>
                    </div>
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
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-button" onClick={closeModal}>×</button>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.alt}
                className="modal-image"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

