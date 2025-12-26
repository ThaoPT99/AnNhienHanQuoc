import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserEmail, getUserName } from '../utils/auth';
import { getRelativeTime } from '../utils/timezone';
import VideoCall from './VideoCall';
import './MessengerChat.css';

const MessengerChat = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChats, setActiveChats] = useState([]); // [{ userId, userName, userEmail, roomId, isVideoCall, messages }]
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);
  const messagesEndRef = useRef(null);
  const userEmail = getUserEmail();
  const userName = getUserName() || userEmail?.split('@')[0] || 'User';
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  // Initialize WebSocket for messaging
  useEffect(() => {
    if (!userEmail) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = API_URL.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
    const wsUrl = `${wsProtocol}//${wsHost}/webrtc-signaling`;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('💬 MessengerChat: WebSocket connected');
      // Register user for messaging
      websocket.send(JSON.stringify({
        type: 'register-messaging',
        userId: userEmail
      }));
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'chat-message') {
          // Received a chat message
          const { from, to, message, timestamp } = data;
          const senderEmail = from === userEmail ? to : from;
          
          // Find or create chat
          setActiveChats(prev => {
            let chatExists = prev.find(chat => chat.userEmail === senderEmail);
            
            if (!chatExists) {
              // Create new text chat
              const newChat = {
                userId: senderEmail,
                userName: senderEmail.split('@')[0],
                userEmail: senderEmail,
                isVideoCall: false,
                messages: []
              };
              chatExists = newChat;
              prev = [...prev, newChat];
            }
            
            // Add message to chat
            const updatedChat = {
              ...chatExists,
              messages: [...(chatExists.messages || []), {
                text: message,
                sender: from === userEmail ? 'me' : 'other',
                timestamp: timestamp || new Date().toISOString()
              }]
            };
            
            // Save to localStorage
            saveMessagesToStorage(senderEmail, updatedChat.messages);
            
            return prev.map(chat => 
              chat.userEmail === senderEmail ? updatedChat : chat
            );
          });
          
          // Auto-select chat if minimized
          if (isMinimized) {
            setIsMinimized(false);
          }
        } else if (data.type === 'incoming-call') {
          // Handle incoming video call (existing logic)
          const { callerEmail, callerName, roomId } = data;
          
          setActiveChats(prev => {
            const existingChat = prev.find(chat => 
              chat.userEmail === callerEmail && chat.isVideoCall
            );
            
            if (!existingChat) {
              const newChat = {
                userId: callerEmail,
                userName: callerName || callerEmail.split('@')[0],
                userEmail: callerEmail,
                roomId: roomId,
                isVideoCall: true,
                messages: []
              };
              return [...prev, newChat];
            }
            return prev.map(chat => 
              chat.userEmail === callerEmail 
                ? { ...chat, roomId: roomId }
                : chat
            );
          });
          
          setIsMinimized(false);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('💬 MessengerChat: WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('💬 MessengerChat: WebSocket closed, reconnecting...');
      setTimeout(() => {
        // Reconnect after 3 seconds
        if (userEmail) {
          setWs(null);
        }
      }, 3000);
    };

    return () => {
      websocket.close();
    };
  }, [userEmail, isMinimized]);

  // Listen for new video call requests from UI
  useEffect(() => {
    const handleIncomingCall = (event) => {
      const { callerEmail, callerName, roomId } = event.detail;
      
      setActiveChats(prev => {
        const existingChat = prev.find(chat => 
          chat.userEmail === callerEmail && chat.isVideoCall
        );
        
        if (!existingChat) {
          const newChat = {
            userId: callerEmail,
            userName: callerName || callerEmail.split('@')[0],
            userEmail: callerEmail,
            roomId: roomId,
            isVideoCall: true,
            messages: []
          };
          setSelectedChat(newChat);
          setIsMinimized(false);
          return [...prev, newChat];
        } else {
          setSelectedChat(existingChat);
          setIsMinimized(false);
          return prev.map(chat => 
            chat.userEmail === callerEmail 
              ? { ...chat, roomId: roomId }
              : chat
          );
        }
      });
    };

    window.addEventListener('startVideoCall', handleIncomingCall);
    return () => window.removeEventListener('startVideoCall', handleIncomingCall);
  }, []);

  // Load messages from localStorage when chat is selected
  useEffect(() => {
    if (selectedChat && !selectedChat.isVideoCall && (!selectedChat.messages || selectedChat.messages.length === 0)) {
      const savedMessages = loadMessagesFromStorage(selectedChat.userEmail);
      setActiveChats(prev => prev.map(chat =>
        chat.userEmail === selectedChat.userEmail
          ? { ...chat, messages: savedMessages }
          : chat
      ));
    }
  }, [selectedChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);

  // Save messages to localStorage
  const saveMessagesToStorage = (friendEmail, messages) => {
    try {
      const key = `chat_messages_${userEmail}_${friendEmail}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  // Load messages from localStorage
  const loadMessagesFromStorage = (friendEmail) => {
    try {
      const key = `chat_messages_${userEmail}_${friendEmail}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

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
    
    setActiveChats(prev => {
      const existingChat = prev.find(chat => chat.userEmail === targetEmail);
      const newChat = existingChat || {
        userId: targetEmail,
        userName: targetName || targetEmail.split('@')[0],
        userEmail: targetEmail,
        messages: []
      };
      
      const videoChat = {
        ...newChat,
        roomId: roomId,
        isVideoCall: true
      };
      
      const updatedChats = existingChat 
        ? prev.map(chat => chat.userEmail === targetEmail ? videoChat : chat)
        : [...prev, videoChat];
      
      setSelectedChat(videoChat);
      setIsMinimized(false);
      return updatedChats;
    });
  };

  // Start new text chat
  const startTextChat = (targetEmail, targetName) => {
    setActiveChats(prev => {
      const existingChat = prev.find(chat => 
        chat.userEmail === targetEmail && !chat.isVideoCall
      );
      
      if (existingChat) {
        setSelectedChat(existingChat);
        setIsMinimized(false);
        return prev;
      }
      
      const messages = loadMessagesFromStorage(targetEmail);
      const newChat = {
        userId: targetEmail,
        userName: targetName || targetEmail.split('@')[0],
        userEmail: targetEmail,
        isVideoCall: false,
        messages: messages
      };
      
      setSelectedChat(newChat);
      setIsMinimized(false);
      return [...prev, newChat];
    });
  };

  // Send text message
  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || selectedChat.isVideoCall || !ws) return;

    const message = {
      text: messageInput.trim(),
      sender: 'me',
      timestamp: new Date().toISOString()
    };

    // Add message to chat
    setActiveChats(prev => {
      const updatedChat = {
        ...selectedChat,
        messages: [...(selectedChat.messages || []), message]
      };
      
      // Save to localStorage
      saveMessagesToStorage(selectedChat.userEmail, updatedChat.messages);
      
      // Send via WebSocket
      ws.send(JSON.stringify({
        type: 'chat-message',
        from: userEmail,
        to: selectedChat.userEmail,
        message: message.text,
        timestamp: message.timestamp
      }));
      
      setSelectedChat(updatedChat);
      return prev.map(chat =>
        chat.userEmail === selectedChat.userEmail ? updatedChat : chat
      );
    });

    setMessageInput('');
  };

  // Expose functions globally for other components
  useEffect(() => {
    window.startMessengerVideoCall = startVideoCall;
    window.startMessengerTextChat = startTextChat;
    return () => {
      delete window.startMessengerVideoCall;
      delete window.startMessengerTextChat;
    };
  }, [userEmail]);

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
                <>
                  {/* Messages */}
                  <div className="messages-container">
                    {selectedChat.messages && selectedChat.messages.length > 0 ? (
                      selectedChat.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`message ${msg.sender === 'me' ? 'message-sent' : 'message-received'}`}
                        >
                          <div className="message-bubble">
                            <p>{msg.text}</p>
                            <span className="message-time">
                              {getRelativeTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-messages">
                        <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form className="message-input-container" onSubmit={sendMessage}>
                    <input
                      type="text"
                      className="message-input"
                      placeholder="Nhập tin nhắn..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      disabled={!ws}
                    />
                    <button
                      type="submit"
                      className="message-send-btn"
                      disabled={!messageInput.trim() || !ws}
                    >
                      ➤
                    </button>
                  </form>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessengerChat;
