import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConsultationForm from './ConsultationForm';
import './ExitIntentPopup.css';

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has seen popup before (using localStorage)
    const hasSeenPopup = localStorage.getItem('exitIntentPopupShown');
    if (hasSeenPopup) {
      setHasShown(true);
      return;
    }

    // Detect exit intent (mouse leaving top of screen)
    const handleMouseLeave = (e) => {
      if (!hasShown && e.clientY <= 0) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitIntentPopupShown', 'true');
      }
    };

    // Also detect on mobile (scroll up quickly)
    let lastScrollTop = 0;
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (!hasShown && lastScrollTop > scrollTop && scrollTop < 100) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitIntentPopupShown', 'true');
      }
      lastScrollTop = scrollTop;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown]);

  const handleGetOffer = () => {
    setIsOpen(false);
    setShowConsultationForm(true);
  };

  const handleDownloadResource = () => {
    setIsOpen(false);
    navigate('/resources');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="exit-intent-overlay"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="exit-intent-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-popup-btn" onClick={() => setIsOpen(false)}>×</button>
              
              <div className="popup-content">
                <div className="popup-icon">🎁</div>
                <h2 className="popup-title">Đợi đã! Bạn có muốn nhận ưu đãi đặc biệt?</h2>
                <p className="popup-subtitle">Đừng bỏ lỡ cơ hội du học Hàn Quốc với chi phí tốt nhất!</p>
                
                <div className="popup-offers">
                  <div className="offer-item">
                    <span className="offer-icon">✅</span>
                    <span>Tư vấn miễn phí 100%</span>
                  </div>
                  <div className="offer-item">
                    <span className="offer-icon">📚</span>
                    <span>Tài liệu du học Hàn Quốc miễn phí</span>
                  </div>
                  <div className="offer-item">
                    <span className="offer-icon">🎓</span>
                    <span>Hỗ trợ làm hồ sơ 0 đồng</span>
                  </div>
                  <div className="offer-item">
                    <span className="offer-icon">💰</span>
                    <span>Ưu đãi học phí lên đến 50%</span>
                  </div>
                </div>

                <div className="popup-actions">
                  <button className="primary-action-btn" onClick={handleGetOffer}>
                    🎯 Nhận ưu đãi ngay
                  </button>
                  <button className="secondary-action-btn" onClick={handleDownloadResource}>
                    📥 Tải tài liệu miễn phí
                  </button>
                </div>

                <p className="popup-note">* Ưu đãi có hiệu lực trong 24 giờ</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showConsultationForm && (
        <ConsultationForm
          isOpen={showConsultationForm}
          onClose={() => setShowConsultationForm(false)}
          triggerSource="exit-intent-popup"
        />
      )}
    </>
  );
};

export default ExitIntentPopup;
