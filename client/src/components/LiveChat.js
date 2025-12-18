import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LiveChat.css';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Simulate online status

  const quickMessages = [
    'Xin chào! Tôi muốn tư vấn về du học Hàn Quốc',
    'Chi phí du học Hàn Quốc là bao nhiêu?',
    'Tôi muốn biết về học bổng',
    'Làm thế nào để xin visa?'
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className={`live-chat-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <span className="chat-icon">💬</span>
        <span className="chat-badge">{isOnline ? '●' : ''}</span>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="chat-tooltip"
          >
            Chat với tư vấn viên
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="live-chat-window"
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">👨‍💼</div>
                <div>
                  <div className="chat-name">Tư vấn viên An Nhiên</div>
                  <div className={`chat-status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? '● Đang online' : '○ Offline'}
                  </div>
                </div>
              </div>
              <button className="chat-close-btn" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="chat-body">
              {isOnline ? (
                <>
                  <div className="chat-message bot">
                    <div className="message-avatar">👨‍💼</div>
                    <div className="message-content">
                      <p>Xin chào! 👋</p>
                      <p>Tôi là tư vấn viên của Du học An Nhiên. Bạn cần hỗ trợ gì về du học Hàn Quốc?</p>
                    </div>
                  </div>

                  <div className="quick-messages">
                    <p className="quick-messages-label">Tin nhắn nhanh:</p>
                    {quickMessages.map((msg, index) => (
                      <button key={index} className="quick-message-btn">
                        {msg}
                      </button>
                    ))}
                  </div>

                  <div className="chat-options">
                    <a
                      href="https://zalo.me/0961321930"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-option-btn zalo"
                    >
                      <span className="option-icon">💬</span>
                      <span>Chat Zalo</span>
                    </a>
                    <a
                      href="https://m.me/duhocannhien"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-option-btn messenger"
                    >
                      <span className="option-icon">💬</span>
                      <span>Facebook Messenger</span>
                    </a>
                    <a
                      href="tel:0961321930"
                      className="chat-option-btn phone"
                    >
                      <span className="option-icon">📞</span>
                      <span>Gọi ngay: 0961.321.930</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="offline-message">
                  <p>😴 Tư vấn viên hiện đang offline</p>
                  <p>Vui lòng để lại tin nhắn hoặc liên hệ qua:</p>
                  <div className="offline-contacts">
                    <a href="tel:0961321930" className="contact-link">📞 0961.321.930</a>
                    <a href="mailto:annhienduhochan@gmail.com" className="contact-link">✉️ Email</a>
                  </div>
                </div>
              )}
            </div>

            {isOnline && (
              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  className="chat-input"
                />
                <button className="chat-send-btn">📤</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;

