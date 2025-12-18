import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConsultationForm from './ConsultationForm';
import './ConsultationButton.css';

const ConsultationButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <motion.button
        className="consultation-floating-btn"
        onClick={() => setIsFormOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <span className="btn-icon">💬</span>
        <span className="btn-text">Tư vấn miễn phí</span>
      </motion.button>
      <ConsultationForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        triggerSource="floating-button"
      />
    </>
  );
};

export default ConsultationButton;

