import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RightSidebar.css';

const RightSidebar = ({ userEmail, friends, navigate }) => {
  const [contacts, setContacts] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    if (friends && friends.length > 0) {
      const contactsList = friends.map(friend => ({
        name: friend.name || friend.author_name || friend.email?.split('@')[0] || 'Unknown',
        email: friend.email,
        online: Math.random() > 0.3 // Random online status for demo
      }));
      setContacts(contactsList.slice(0, 16)); // Limit to 16 contacts
    }
  }, [friends]);

  return (
    <div className="right-sidebar-content">
      {/* Birthday Section - Hidden until API endpoint is ready */}
      {/* Future: Add API endpoint to fetch birthdays from friends list */}
      {false && (
        <div className="sidebar-birthday">
          <div className="sidebar-birthday-header">
            <span className="sidebar-birthday-icon">🎂</span>
            <h3 className="sidebar-birthday-title">Sinh nhật</h3>
          </div>
          <p className="sidebar-birthday-text">
            Hôm nay là sinh nhật của <strong>Ngocc Anhh</strong> và 2 người khác.
          </p>
        </div>
      )}

      {/* Contacts Section */}
      <div className="sidebar-contacts">
        <div className="sidebar-contacts-header">
          <h3 className="sidebar-contacts-title">Người liên hệ</h3>
          <div className="sidebar-contacts-actions">
            <button className="sidebar-contacts-action-btn" title="Tìm kiếm">
              🔍
            </button>
            <button className="sidebar-contacts-action-btn" title="Tùy chọn">
              ⋯
            </button>
          </div>
        </div>
        
        {contacts.length > 0 ? (
          <div className="sidebar-contact-list">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="sidebar-contact-item"
                onClick={(e) => {
                  e.preventDefault();
                  // Open chat with this contact
                  if (window.startMessengerTextChat && contact.email) {
                    window.startMessengerTextChat(contact.email, contact.name);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="sidebar-contact-avatar">
                  {contact.name.charAt(0).toUpperCase()}
                  {contact.online && <div className="sidebar-contact-online"></div>}
                </div>
                <span className="sidebar-contact-name">{contact.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            padding: '24px', 
            textAlign: 'center', 
            color: 'var(--fb-text-secondary)', 
            fontSize: '15px' 
          }}>
            Chưa có bạn bè
          </div>
        )}
      </div>

      {/* Floating Message Button */}
      <button className="floating-message-btn" title="Soạn tin nhắn">
        ✏️
      </button>
    </div>
  );
};

export default RightSidebar;
