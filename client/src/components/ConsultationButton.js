import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConsultationForm from './ConsultationForm';
import CalendarBooking from './CalendarBooking';
import './ConsultationButton.css';

const ConsultationButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="consultation-buttons-wrapper">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="consultation-menu"
            >
              <button
                className="menu-item"
                onClick={() => {
                  setIsFormOpen(true);
                  setShowMenu(false);
                }}
              >
                <span className="menu-icon">📝</span>
                <span>Đăng ký tư vấn</span>
              </button>
              <button
                className="menu-item"
                onClick={() => {
                  setIsCalendarOpen(true);
                  setShowMenu(false);
                }}
              >
                <span className="menu-icon">📅</span>
                <span>Đặt lịch tư vấn</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="consultation-floating-btn"
          onClick={() => setShowMenu(!showMenu)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <span className="btn-icon">💬</span>
          <span className="btn-text">Tư vấn miễn phí</span>
        </motion.button>
      </div>

      <ConsultationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        triggerSource="floating-button"
      />
      <CalendarBooking
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </>
  );
};

export default ConsultationButton;

