import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './IncomingCall.css';

const IncomingCall = ({ callerName, callerEmail, roomId, roomLink, onAccept, onDecline }) => {
  const navigate = useNavigate();
  
  // Play ringtone
  useEffect(() => {
    // Create audio context for ringtone
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = null;
    let gainNode = null;
    
    const playRingtone = () => {
      oscillator = audioContext.createOscillator();
      gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };
    
    // Play ringtone every 1.5 seconds
    const ringInterval = setInterval(playRingtone, 1500);
    
    return () => {
      clearInterval(ringInterval);
      if (oscillator) {
        oscillator.stop();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);
  
  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    } else if (roomLink) {
      window.location.href = roomLink;
    }
  };
  
  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="incoming-call-overlay"
      >
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          className="incoming-call-modal"
        >
          <div className="caller-avatar">
            <div className="avatar-circle">
              {(callerName || callerEmail || '?').charAt(0).toUpperCase()}
            </div>
            <div className="ring-animation"></div>
          </div>
          
          <h2 className="caller-name">{callerName || callerEmail || 'Người gọi'}</h2>
          <p className="call-status">📹 Cuộc gọi video đến...</p>
          
          <div className="call-actions">
            <button
              className="accept-btn"
              onClick={handleAccept}
              title="Chấp nhận"
            >
              <span className="btn-icon">📞</span>
            </button>
            <button
              className="decline-btn"
              onClick={handleDecline}
              title="Từ chối"
            >
              <span className="btn-icon">📴</span>
            </button>
          </div>
          
          <p className="call-hint">Nhấn để chấp nhận hoặc từ chối cuộc gọi</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IncomingCall;



