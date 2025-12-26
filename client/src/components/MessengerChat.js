import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserEmail, getUserName } from '../utils/auth';
import VideoCall from './VideoCall';
import './MessengerChat.css';

const MessengerChat = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChats, setActiveChats] = useState([]); // [{ userId, userName, userEmail, roomId, isVideoCall }]
  const [selectedChat, setSelectedChat] = useState(null);
  const userEmail = getUserEmail();
  const userName = getUserName() || userEmail?.split('@')[0] || 'User';

  // Listen for new video call requests
  useEffect(() => {
    const handleIncomingCall = (event) => {
      const { callerEmail, callerName, roomId } = event.detail;
      
      // Check if chat already exists
      const existingChat = activeChats.find(chat => 
        chat.userEmail === callerEmail && chat.isVideoCall
      );
      
      if (!existingChat) {
        const newChat = {
          userId: callerEmail,
          userName: callerName || callerEmail.split('@')[0],
          userEmail: callerEmail,
          roomId: roomId,
          isVideoCall: true
        };
        
        setActiveChats(prev => [...prev, newChat]);
        setSelectedChat(newChat);
        setIsMinimized(false);
      } else {
        // Update existing chat with new roomId
        setActiveChats(prev => prev.map(chat => 
          chat.userEmail === callerEmail 
            ? { ...chat, roomId: roomId }
            : chat
        ));
        setSelectedChat(existingChat);
        setIsMinimized(false);
      }
    };

    window.addEventListener('startVideoCall', handleIncomingCall);
    return () => window.removeEventListener('startVideoCall', handleIncomingCall);
  }, [activeChats]);

  // Handle chat close
  const handleCloseChat = (chatId) => {
    setActiveChats(prev => {
      const updated = prev.filter(chat => chat.userId !== chatId);
      if (selectedChat?.userId === chatId) {
        setSelectedChat(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  // Handle video call end
  const handleVideoCallEnd = (chatId) => {
    setActiveChats(prev => prev.filter(chat => chat.userId !== chatId));
    if (selectedChat?.userId === chatId) {
      setSelectedChat(null);
    }
  };

  // Start new video call
  const startVideoCall = (targetEmail, targetName) => {
    const roomId = `room_${Date.now()}_${userEmail}_${targetEmail}`;
    const newChat = {
      userId: targetEmail,
      userName: targetName || targetEmail.split('@')[0],
      userEmail: targetEmail,
      roomId: roomId,
      isVideoCall: true
    };
    
    setActiveChats(prev => [...prev, newChat]);
    setSelectedChat(newChat);
    setIsMinimized(false);
  };

  // Expose function globally for other components
  useEffect(() => {
    window.startMessengerVideoCall = startVideoCall;
    return () => {
      delete window.startMessengerVideoCall;
    };
  }, []);

  if (activeChats.length === 0) {
    return null; // Don't render if no active chats
  }

  return (
    <div className={`messenger-chat-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Chat Tabs */}
      {activeChats.length > 1 && (
        <div className="chat-tabs">
          {activeChats.map((chat) => (
            <div
              key={chat.userId}
              className={`chat-tab ${selectedChat?.userId === chat.userId ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <span className="chat-tab-avatar">
                {(chat.userName || chat.userEmail || 'U').charAt(0).toUpperCase()}
              </span>
              <span className="chat-tab-name">{chat.userName}</span>
              <button
                className="chat-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseChat(chat.userId);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat Window */}
      <div className="messenger-chat-window">
        {selectedChat && (
          <>
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  {(selectedChat.userName || selectedChat.userEmail || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="chat-name">{selectedChat.userName}</div>
                  <div className="chat-status">
                    {selectedChat.isVideoCall ? 'Video call đang diễn ra' : 'Đang online'}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button
                  className="chat-action-btn"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
                >
                  {isMinimized ? '□' : '_'}
                </button>
                <button
                  className="chat-action-btn"
                  onClick={() => handleCloseChat(selectedChat.userId)}
                  title="Đóng"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="chat-content">
              {selectedChat.isVideoCall ? (
                <VideoCall
                  roomId={selectedChat.roomId}
                  userEmail={userEmail}
                  userName={userName}
                  onClose={() => handleVideoCallEnd(selectedChat.userId)}
                />
              ) : (
                <div className="text-chat-placeholder">
                  <p>Chat text sẽ được phát triển sau</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessengerChat;
