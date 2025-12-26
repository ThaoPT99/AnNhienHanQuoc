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
      const registerMsg = {
        type: 'register-messaging',
        userId: userEmail
      };
      console.log('💬 MessengerChat: Registering for messaging:', registerMsg);
      websocket.send(JSON.stringify(registerMsg));
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('💬 MessengerChat: Received WebSocket data:', data.type);
        
        if (data.type === 'messaging-registered') {
          console.log('✅ MessengerChat: Successfully registered for messaging');
        } else if (data.type === 'chat-message') {
          // Received a chat message
          console.log('💬 MessengerChat: Received message:', data);
          const { from, to, message, timestamp } = data;
          
          // Verify this message is for me
          if (to !== userEmail) {
            console.log(`⚠️ MessengerChat: Message not for me. To: ${to}, My email: ${userEmail}`);
            return;
          }
          
          // The sender is who sent the message (from field)
          const senderEmail = from;
          
          console.log(`💬 MessengerChat: Processing message from ${senderEmail} to ${userEmail}`);
          
          // Find or create chat
          setActiveChats(prev => {
            let chatExists = prev.find(chat => chat.userEmail === senderEmail && !chat.isVideoCall);
            
            if (!chatExists) {
              // Create new text chat for incoming message
              const messages = loadMessagesFromStorage(senderEmail);
              const newChat = {
                userId: senderEmail,
                userName: senderEmail.split('@')[0],
                userEmail: senderEmail,
                isVideoCall: false,
                messages: messages
              };
              chatExists = newChat;
              prev = [...prev, newChat];
            }
            
            // Check if message already exists (prevent duplicates)
            // Allow some tolerance for timestamp differences
            const messageTimestamp = timestamp || new Date().toISOString();
            const messageExists = (chatExists.messages || []).some(msg => {
              const timeDiff = Math.abs(new Date(msg.timestamp) - new Date(messageTimestamp));
              return msg.text === message && msg.sender === 'other' && timeDiff < 5000; // 5 second tolerance
            });
            
            if (messageExists) {
              console.log('⚠️ MessengerChat: Duplicate message detected, skipping:', message);
              return prev;
            }
            
            console.log('💬 MessengerChat: Adding new message to chat:', message);
            
            // Add message to chat
            const updatedChat = {
              ...chatExists,
              messages: [...(chatExists.messages || []), {
                text: message,
                sender: 'other', // This is a received message
                timestamp: messageTimestamp
              }]
            };
            
            // Save to localStorage
            saveMessagesToStorage(senderEmail, updatedChat.messages);
            
            const updatedChats = prev.map(chat => 
              chat.userEmail === senderEmail ? updatedChat : chat
            );
            
            // Update selectedChat synchronously to ensure immediate UI update
            setSelectedChat(prevSelected => {
              // If this chat is already selected, update it with new message
              if (prevSelected?.userEmail === senderEmail) {
                console.log('💬 MessengerChat: Updating selected chat with new message');
                return updatedChat;
              }
              // If no chat selected or different chat selected, select this one and open it
              if (!prevSelected || prevSelected.userEmail !== senderEmail) {
                console.log('💬 MessengerChat: Auto-selecting and opening chat for new message');
                setIsMinimized(false);
                return updatedChat;
              }
              return prevSelected;
            });
            
            return updatedChats;
          });
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
  }, [userEmail]);

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

  // Sync selectedChat with activeChats to ensure messages are up to date
  useEffect(() => {
    if (selectedChat && !selectedChat.isVideoCall) {
      const chatInActiveChats = activeChats.find(chat => 
        chat.userEmail === selectedChat.userEmail && !chat.isVideoCall
      );
      
      // If chat exists in activeChats and has more messages, update selectedChat
      if (chatInActiveChats && chatInActiveChats.messages) {
        const messagesDiff = chatInActiveChats.messages.length - (selectedChat.messages?.length || 0);
        if (messagesDiff > 0) {
          console.log(`💬 MessengerChat: Syncing ${messagesDiff} new messages to selectedChat`);
          setSelectedChat(chatInActiveChats);
        }
      }
    }
  }, [activeChats, selectedChat]);
  
  // Load messages from localStorage when chat is selected
  useEffect(() => {
    if (selectedChat && !selectedChat.isVideoCall && (!selectedChat.messages || selectedChat.messages.length === 0)) {
      const savedMessages = loadMessagesFromStorage(selectedChat.userEmail);
      if (savedMessages.length > 0) {
        setActiveChats(prev => prev.map(chat =>
          chat.userEmail === selectedChat.userEmail
            ? { ...chat, messages: savedMessages }
            : chat
        ));
        setSelectedChat(prev => ({ ...prev, messages: savedMessages }));
      }
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
      // Remove duplicates before saving
      const uniqueMessages = messages.filter((msg, index, self) =>
        index === self.findIndex(m => 
          m.text === msg.text && m.timestamp === msg.timestamp && m.sender === msg.sender
        )
      );
      localStorage.setItem(key, JSON.stringify(uniqueMessages));
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  // Load messages from localStorage
  const loadMessagesFromStorage = (friendEmail) => {
    try {
      const key = `chat_messages_${userEmail}_${friendEmail}`;
      const saved = localStorage.getItem(key);
      if (!saved) return [];
      
      const messages = JSON.parse(saved);
      // Remove duplicates
      return messages.filter((msg, index, self) =>
        index === self.findIndex(m => 
          m.text === msg.text && m.timestamp === msg.timestamp && m.sender === msg.sender
        )
      );
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
      
      // Send via WebSocket (ensure user is registered first)
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        showNotification('Lỗi', 'WebSocket chưa kết nối. Vui lòng thử lại.', 'error');
        return;
      }
      
      const chatMsg = {
        type: 'chat-message',
        from: userEmail,
        to: selectedChat.userEmail,
        message: message.text,
        timestamp: message.timestamp
      };
      console.log('💬 MessengerChat: Sending message:', chatMsg);
      ws.send(JSON.stringify(chatMsg));
      
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
  }, []);

  // Always render (hidden) to maintain WebSocket connection for receiving messages
  // This ensures users receive messages even when chat window is not open

  if (activeChats.length === 0 && !isMinimized) {
    // Hide chat container if no active chats and not minimized
    // But WebSocket is still active in the background
    return null;
  }

  return (
    <div className={`messenger-chat-container ${isMinimized ? 'minimized' : ''} ${activeChats.length === 0 ? 'hidden' : ''}`}>
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
