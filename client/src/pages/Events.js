import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';
import CountdownTimer from '../components/CountdownTimer';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventId: ''
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Sự kiện du học Hàn Quốc - Du học An Nhiên",
    "description": "Tham gia các sự kiện, hội thảo và workshop về du học Hàn Quốc do Du học An Nhiên tổ chức",
    "url": "https://duhocannhien.vercel.app/events",
    "organizer": {
      "@type": "Organization",
      "name": "Du học An Nhiên"
    }
  };

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    // If already in DD/MM/YYYY format, return as is
    if (dateStr.includes('/')) return dateStr;
    // If in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/events/list`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/api/events/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: registrationForm.eventId,
          name: registrationForm.name,
          email: registrationForm.email,
          phone: registrationForm.phone
        }),
      });

      if (response.ok) {
        alert(`Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn sớm nhất.`);
        setRegistrationForm({ name: '', email: '', phone: '', eventId: '' });
        setSelectedEvent(null);
      } else {
        const error = await response.json();
        alert(`Có lỗi xảy ra: ${error.error || 'Vui lòng thử lại sau.'}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'past');

  if (loading) {
    return (
      <div className="events-page">
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="loading">Đang tải sự kiện...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      <SEO
        title="Sự kiện du học Hàn Quốc - Du học An Nhiên"
        description="Tham gia các sự kiện, hội thảo và workshop về du học Hàn Quốc do Du học An Nhiên tổ chức. Đăng ký ngay để nhận thông tin mới nhất."
        keywords="sự kiện du học Hàn Quốc, hội thảo du học, workshop TOPIK, webinar du học, sự kiện Du học An Nhiên"
        url="https://duhocannhien.vercel.app/events"
        structuredData={structuredData}
      />
      
      <div className="page-header">
        <div className="header-sparkles">
          <span className="sparkle">✨</span>
          <span className="sparkle">⭐</span>
          <span className="sparkle">💫</span>
          <span className="sparkle">✨</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <h1 className="page-title">
            <span className="title-icon">📅</span>
            Sự kiện & Hội thảo
          </h1>
          <p className="page-subtitle">
            Tham gia các sự kiện, hội thảo và workshop về du học Hàn Quốc
          </p>
        </motion.div>
      </div>

      <div className="events-content">
        {upcomingEvents.length > 0 && (
          <section className="upcoming-events-section">
            <h2 className="section-title">
              <span>🎯</span>
              <span className="section-title-text">Sự kiện sắp tới</span>
            </h2>
            {upcomingEvents[0] && upcomingEvents[0].date && (() => {
              // Handle both DD/MM/YYYY and YYYY-MM-DD formats
              let dateStr = upcomingEvents[0].date;
              let targetDate;
              if (dateStr.includes('/')) {
                // DD/MM/YYYY format
                const parts = dateStr.split('/');
                targetDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
              } else {
                // YYYY-MM-DD format
                targetDate = new Date(dateStr);
              }
              return (
                <div className="event-countdown-wrapper">
                  <CountdownTimer 
                    targetDate={targetDate.toISOString()}
                    title={`⏰ ${upcomingEvents[0].title} bắt đầu sau`}
                  />
                </div>
              );
            })()}
            <div className="events-grid">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="event-card"
                >
                  <div className="event-image">
                    <OptimizedImage src={event.image} alt={event.title} loading="lazy" width="400" height="250" />
                    <div className="event-badge">{event.type}</div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{formatDateDisplay(event.date)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">⏰</span>
                        <span>{event.time}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">📍</span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-stats">
                      <div className="stat-item">
                        <span className="stat-label">Đã đăng ký:</span>
                        <span className="stat-value">{event.registered}/{event.capacity}</span>
                      </div>
                      <div className="stat-progress">
                        <div 
                          className="progress-bar"
                          style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                    <button
                      className="register-btn"
                      onClick={() => {
                        setSelectedEvent(event);
                        setRegistrationForm(prev => ({ ...prev, eventId: event.id }));
                      }}
                    >
                      <span>📝</span>
                      Đăng ký tham gia
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section className="past-events-section">
            <h2 className="section-title">
              <span>📚</span>
              <span className="section-title-text">Sự kiện đã qua</span>
            </h2>
            <div className="events-grid">
              {pastEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="event-card past"
                >
                  <div className="event-image">
                    <OptimizedImage src={event.image} alt={event.title} loading="lazy" width="400" height="250" />
                    <div className="event-badge past-badge">Đã kết thúc</div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{formatDateDisplay(event.date)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span>{event.registered || 0} người tham gia</span>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    {event.highlights && (
                      <div className="event-highlights">
                        <strong>Điểm nổi bật:</strong>
                        <ul>
                          {event.highlights.map((highlight, idx) => (
                            <li key={idx}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="registration-modal-overlay"
          onClick={() => setSelectedEvent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="registration-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal-btn" onClick={() => setSelectedEvent(null)}>×</button>
            <h2 className="modal-title">Đăng ký tham gia: {selectedEvent.title}</h2>
            
            <div className="event-details">
              <div className="detail-item">
                <strong>📅 Ngày:</strong> {formatDateDisplay(selectedEvent.date)}
              </div>
              <div className="detail-item">
                <strong>⏰ Giờ:</strong> {selectedEvent.time}
              </div>
              <div className="detail-item">
                <strong>📍 Địa điểm:</strong> {selectedEvent.location}
              </div>
            </div>

            {selectedEvent.agenda && (
              <div className="event-agenda">
                <h3>📋 Chương trình:</h3>
                <ul>
                  {selectedEvent.agenda.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedEvent.speakers && (
              <div className="event-speakers">
                <h3>🎤 Diễn giả:</h3>
                <ul>
                  {selectedEvent.speakers.map((speaker, idx) => (
                    <li key={idx}>{speaker}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleRegistration} className="registration-form">
              <div className="form-group">
                <label htmlFor="name">Họ và tên *</label>
                <input
                  type="text"
                  id="name"
                  value={registrationForm.name}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={registrationForm.email}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                  placeholder="example@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  value={registrationForm.phone}
                  onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  placeholder="0123456789"
                />
              </div>
              <button type="submit" className="submit-registration-btn">
                <span>✓</span>
                Xác nhận đăng ký
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Events;

