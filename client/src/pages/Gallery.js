import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Hình ảnh thực tế về Hàn Quốc từ Unsplash
  const imageCategories = [
    {
      title: 'Trường học Hàn Quốc',
      images: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80',
          alt: 'Đại học Quốc gia Seoul'
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&q=80',
          alt: 'Khuôn viên trường đại học Hàn Quốc'
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80',
          alt: 'Thư viện trường đại học'
        },
        {
          id: 4,
          url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
          alt: 'Sinh viên trong lớp học'
        },
        {
          id: 5,
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80',
          alt: 'Khuôn viên trường đại học hiện đại'
        },
        {
          id: 6,
          url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop&q=80',
          alt: 'Tòa nhà giảng đường'
        }
      ]
    },
    {
      title: 'Cảnh đẹp Hàn Quốc',
      images: [
        {
          id: 7,
          url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
          alt: 'Seoul về đêm'
        },
        {
          id: 8,
          url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop&q=80',
          alt: 'Tháp Namsan Seoul'
        },
        {
          id: 9,
          url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&h=600&fit=crop&q=80',
          alt: 'Sông Hàn'
        },
        {
          id: 10,
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          alt: 'Phố cổ Bukchon Hanok'
        },
        {
          id: 11,
          url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a6e?w=800&h=600&fit=crop&q=80',
          alt: 'Núi Seoraksan'
        },
        {
          id: 12,
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          alt: 'Đảo Jeju'
        }
      ]
    },
    {
      title: 'Cuộc sống sinh viên',
      images: [
        {
          id: 13,
          url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
          alt: 'Sinh viên học tập'
        },
        {
          id: 14,
          url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop&q=80',
          alt: 'Hoạt động ngoại khóa'
        },
        {
          id: 15,
          url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80',
          alt: 'Ký túc xá sinh viên'
        },
        {
          id: 16,
          url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80',
          alt: 'Sinh viên trong thư viện'
        },
        {
          id: 17,
          url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop&q=80',
          alt: 'Hoạt động thể thao'
        },
        {
          id: 18,
          url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&q=80',
          alt: 'Lễ hội trường học'
        }
      ]
    },
    {
      title: 'Văn hóa Hàn Quốc',
      images: [
        {
          id: 19,
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
          alt: 'Cung điện Gyeongbokgung'
        },
        {
          id: 20,
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          alt: 'Làng cổ truyền thống'
        },
        {
          id: 21,
          url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&q=80',
          alt: 'Ẩm thực Hàn Quốc'
        },
        {
          id: 22,
          url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop&q=80',
          alt: 'Lễ hội truyền thống'
        },
        {
          id: 23,
          url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop&q=80',
          alt: 'Nghệ thuật Hàn Quốc'
        },
        {
          id: 24,
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&q=80',
          alt: 'Di sản văn hóa'
        }
      ]
    }
  ];

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
        {imageCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="gallery-category">
            <h2 className="category-title">{category.title}</h2>
            <div className="gallery-grid">
              {category.images.map((image, index) => (
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
                      alt={image.alt}
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

