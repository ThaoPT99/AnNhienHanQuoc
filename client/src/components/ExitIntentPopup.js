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
      const currentHasShown = localStorage.getItem('exitIntentPopupShown');
      if (!currentHasShown && e.clientY <= 0) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitIntentPopupShown', 'true');
      }
    };

    // Also detect on mobile (scroll up quickly)
    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentHasShown = localStorage.getItem('exitIntentPopupShown');
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (!currentHasShown && lastScrollTop > scrollTop && scrollTop < 100) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-title"
            aria-describedby="exit-popup-description"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="exit-intent-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-popup-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Đóng popup ưu đãi"
              >
                <span aria-hidden="true">×</span>
              </button>
              
              <div className="popup-content">
                <div className="popup-icon" aria-hidden="true">🎁</div>
                <h2 id="exit-popup-title" className="popup-title">Đợi đã! Bạn có muốn nhận ưu đãi đặc biệt?</h2>
                <p id="exit-popup-description" className="popup-subtitle">Đừng bỏ lỡ cơ hội du học Hàn Quốc với chi phí tốt nhất!</p>
                
                <ul className="popup-offers" role="list">
                  <li className="offer-item" role="listitem">
                    <span className="offer-icon" aria-hidden="true">✅</span>
                    <span>Tư vấn miễn phí 100%</span>
                  </li>
                  <li className="offer-item" role="listitem">
                    <span className="offer-icon" aria-hidden="true">📚</span>
                    <span>Tài liệu du học Hàn Quốc miễn phí</span>
                  </li>
                  <li className="offer-item" role="listitem">
                    <span className="offer-icon" aria-hidden="true">🎓</span>
                    <span>Hỗ trợ làm hồ sơ 0 đồng</span>
                  </li>
                  <li className="offer-item" role="listitem">
                    <span className="offer-icon" aria-hidden="true">💰</span>
                    <span>Ưu đãi học phí lên đến 50%</span>
                  </li>
                </ul>

                <div className="popup-actions">
                  <button 
                    className="primary-action-btn" 
                    onClick={handleGetOffer}
                    aria-label="Nhận ưu đãi đặc biệt ngay"
                  >
                    <span aria-hidden="true">🎯</span> Nhận ưu đãi ngay
                  </button>
                  <button 
                    className="secondary-action-btn" 
                    onClick={handleDownloadResource}
                    aria-label="Tải tài liệu du học Hàn Quốc miễn phí"
                  >
                    <span aria-hidden="true">📥</span> Tải tài liệu miễn phí
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
