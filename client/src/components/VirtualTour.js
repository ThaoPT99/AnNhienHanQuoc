import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimizedImage from './OptimizedImage';
import './VirtualTour.css';

const VirtualTour = () => {
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [currentView, setCurrentView] = useState(0);

  const schools = [
    {
      id: 1,
      name: 'Đại học Yonsei',
      location: 'Seoul',
      views: [
        { name: 'Cổng chính', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', description: 'Cổng chính của Đại học Yonsei - một trong những trường đại học lâu đời nhất Hàn Quốc' },
        { name: 'Thư viện', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', description: 'Thư viện hiện đại với hơn 2 triệu đầu sách' },
        { name: 'Khuôn viên', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', description: 'Khuôn viên rộng lớn với kiến trúc cổ kính' },
        { name: 'Ký túc xá', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800', description: 'Ký túc xá hiện đại, tiện nghi cho sinh viên' }
      ]
    },
    {
      id: 2,
      name: 'Đại học Korea',
      location: 'Seoul',
      views: [
        { name: 'Tòa nhà chính', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', description: 'Tòa nhà chính với kiến trúc hiện đại' },
        { name: 'Phòng thí nghiệm', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800', description: 'Phòng thí nghiệm được trang bị đầy đủ thiết bị hiện đại' },
        { name: 'Sân vận động', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', description: 'Sân vận động lớn cho các hoạt động thể thao' }
      ]
    },
    {
      id: 3,
      name: 'Đại học SNU',
      location: 'Seoul',
      views: [
        { name: 'Cổng chính', image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', description: 'Cổng chính của Đại học Quốc gia Seoul - trường đại học số 1 Hàn Quốc' },
        { name: 'Thư viện trung tâm', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800', description: 'Thư viện trung tâm với không gian học tập rộng lớn' },
        { name: 'Khu nghiên cứu', image: 'https://images.unsplash.com/photo-1532619675605-1ede6c7edf48?w=800', description: 'Khu vực nghiên cứu với các phòng lab hiện đại' }
      ]
    }
  ];

  const openTour = (school) => {
    setSelectedSchool(school);
    setCurrentView(0);
  };

  const closeTour = () => {
    setSelectedSchool(null);
    setCurrentView(0);
  };

  const nextView = () => {
    if (selectedSchool && currentView < selectedSchool.views.length - 1) {
      setCurrentView(currentView + 1);
    }
  };

  const prevView = () => {
    if (currentView > 0) {
      setCurrentView(currentView - 1);
    }
  };

  return (
    <div className="virtual-tour-section">
      <div className="tour-header">
        <h2>🏛️ Virtual Tour 360°</h2>
        <p>Tham quan ảo các trường đại học Hàn Quốc từ mọi góc độ</p>
      </div>

      <div className="schools-grid">
        {schools.map((school, index) => (
          <motion.div
            key={school.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="school-card"
            onClick={() => openTour(school)}
          >
            <div className="school-image">
              <OptimizedImage src={school.views[0].image} alt={school.name} />
              <div className="tour-badge">360° Tour</div>
            </div>
            <div className="school-info">
              <h3>{school.name}</h3>
              <p className="school-location">📍 {school.location}</p>
              <p className="view-count">{school.views.length} điểm tham quan</p>
              <button className="start-tour-btn">Bắt đầu tour →</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tour Modal */}
      <AnimatePresence>
        {selectedSchool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="tour-modal-overlay"
            onClick={closeTour}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="tour-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-tour-btn" onClick={closeTour}>×</button>

              <div className="tour-header-modal">
                <h3>{selectedSchool.name}</h3>
                <p>{selectedSchool.location}</p>
              </div>

              <div className="tour-viewer">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="tour-image-container"
                  >
                    <OptimizedImage 
                      src={selectedSchool.views[currentView].image} 
                      alt={selectedSchool.views[currentView].name}
                      className="tour-image"
                    />
                    <div className="view-info">
                      <h4>{selectedSchool.views[currentView].name}</h4>
                      <p>{selectedSchool.views[currentView].description}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button 
                  className="nav-btn prev-btn"
                  onClick={prevView}
                  disabled={currentView === 0}
                >
                  ‹
                </button>
                <button 
                  className="nav-btn next-btn"
                  onClick={nextView}
                  disabled={currentView === selectedSchool.views.length - 1}
                >
                  ›
                </button>
              </div>

              <div className="tour-thumbnails">
                {selectedSchool.views.map((view, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === currentView ? 'active' : ''}`}
                    onClick={() => setCurrentView(index)}
                  >
                    <OptimizedImage src={view.image} alt={view.name} />
                    <span>{view.name}</span>
                  </button>
                ))}
              </div>

              <div className="tour-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${((currentView + 1) / selectedSchool.views.length) * 100}%` }}
                  />
                </div>
                <span>{currentView + 1} / {selectedSchool.views.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualTour;
