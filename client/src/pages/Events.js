import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Events.css';

const Events = () => {
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

  const events = [
    {
      id: 1,
      title: 'Hội thảo du học Hàn Quốc 2025',
      date: '25/01/2025',
      time: '14:00 - 17:00',
      location: 'Văn phòng Du học An Nhiên, Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa, Cầu Giấy, Hà Nội',
      type: 'Hội thảo',
      status: 'upcoming',
      image: 'https://res.cloudinary.com/dy84xpayv/image/upload/v1765942857/z7335282956837_dccc007a84cec34742579005d959eaec_j7sjs7.jpg',
      description: 'Hội thảo giới thiệu về du học Hàn Quốc 2025 với các chủ đề: Chi phí du học, Học bổng, Visa, Chọn trường phù hợp. Có tư vấn trực tiếp với các chuyên gia.',
      agenda: [
        '14:00 - 14:30: Đón tiếp và khai mạc',
        '14:30 - 15:30: Giới thiệu tổng quan về du học Hàn Quốc',
        '15:30 - 16:00: Chia sẻ kinh nghiệm từ cựu du học sinh',
        '16:00 - 17:00: Tư vấn trực tiếp và giải đáp thắc mắc'
      ],
      speakers: [
        'Chuyên gia tư vấn Du học An Nhiên',
        'Cựu du học sinh Đại học Yonsei',
        'Đại diện các trường đại học Hàn Quốc'
      ],
      capacity: 50,
      registered: 32
    },
    {
      id: 2,
      title: 'Workshop: Luyện thi TOPIK hiệu quả',
      date: '02/02/2025',
      time: '09:00 - 12:00',
      location: 'Online (Zoom)',
      type: 'Workshop',
      status: 'upcoming',
      image: 'https://i.pinimg.com/736x/30/1a/09/301a09086923fa9127185cdad0d995d8.jpg',
      description: 'Workshop hướng dẫn phương pháp luyện thi TOPIK hiệu quả, chia sẻ tips và tricks để đạt điểm cao. Phù hợp cho người mới bắt đầu và đang ôn thi.',
      agenda: [
        '09:00 - 09:30: Giới thiệu về kỳ thi TOPIK',
        '09:30 - 10:30: Phương pháp luyện thi từng kỹ năng',
        '10:30 - 11:00: Nghỉ giải lao',
        '11:00 - 12:00: Tips và tricks, Q&A'
      ],
      speakers: [
        'Giáo viên tiếng Hàn TOPIK 6',
        'Chuyên gia luyện thi TOPIK'
      ],
      capacity: 100,
      registered: 67
    },
    {
      id: 3,
      title: 'Webinar: Học bổng du học Hàn Quốc 2025',
      date: '10/02/2025',
      time: '19:00 - 20:30',
      location: 'Online (Facebook Live)',
      type: 'Webinar',
      status: 'upcoming',
      image: 'https://i.pinimg.com/1200x/0e/da/d5/0edad57379e672c6dd8f659d991aa185.jpg',
      description: 'Webinar giới thiệu các loại học bổng du học Hàn Quốc, cách xin học bổng và những lưu ý quan trọng. Phù hợp cho học sinh có ý định xin học bổng.',
      agenda: [
        '19:00 - 19:15: Giới thiệu các loại học bổng',
        '19:15 - 19:45: Cách xin học bổng thành công',
        '19:45 - 20:15: Chia sẻ từ học sinh đã nhận học bổng',
        '20:15 - 20:30: Q&A'
      ],
      speakers: [
        'Chuyên gia tư vấn học bổng',
        'Học sinh đã nhận học bổng KGSP'
      ],
      capacity: 500,
      registered: 234
    },
    {
      id: 4,
      title: 'Hội thảo: Chọn trường và ngành học phù hợp',
      date: '15/02/2025',
      time: '14:00 - 17:00',
      location: 'Văn phòng Du học An Nhiên, Tòa nhà Central Point, tháp C/219 P. Trung Kính, Yên Hòa, Cầu Giấy, Hà Nội',
      type: 'Hội thảo',
      status: 'upcoming',
      image: 'https://i.pinimg.com/1200x/49/6b/f6/496bf6ea630f923608b20c08c7af05ae.jpg',
      description: 'Hội thảo tư vấn chọn trường và ngành học phù hợp với năng lực, sở thích và khả năng tài chính. Có test năng lực và tư vấn cá nhân.',
      agenda: [
        '14:00 - 14:30: Đón tiếp',
        '14:30 - 15:30: Giới thiệu các trường và ngành học',
        '15:30 - 16:00: Test năng lực và sở thích',
        '16:00 - 17:00: Tư vấn cá nhân chọn trường'
      ],
      speakers: [
        'Chuyên gia tư vấn chọn trường',
        'Đại diện các trường đại học Hàn Quốc'
      ],
      capacity: 40,
      registered: 18
    },
    {
      id: 5,
      title: 'Hội thảo du học Hàn Quốc - Tháng 12/2024',
      date: '20/12/2024',
      time: '14:00 - 17:00',
      location: 'Văn phòng Du học An Nhiên',
      type: 'Hội thảo',
      status: 'past',
      image: 'https://i.pinimg.com/1200x/52/cf/09/52cf090db4bf9bcbf3f386cd1693e50c.jpg',
      description: 'Hội thảo đã diễn ra thành công với sự tham gia của hơn 50 phụ huynh và học sinh.',
      attendees: 52,
      highlights: [
        'Hơn 50 người tham gia',
        'Nhiều câu hỏi được giải đáp',
        'Nhiều học sinh đăng ký tư vấn'
      ]
    }
  ];

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
    
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
              Sự kiện sắp tới
            </h2>
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
                    <img src={event.image} alt={event.title} loading="lazy" width="400" height="250" />
                    <div className="event-badge">{event.type}</div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{event.date}</span>
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
              Sự kiện đã qua
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
                    <img src={event.image} alt={event.title} loading="lazy" width="400" height="250" />
                    <div className="event-badge past-badge">Đã kết thúc</div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span>{event.date}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👥</span>
                        <span>{event.attendees} người tham gia</span>
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
                <strong>📅 Ngày:</strong> {selectedEvent.date}
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

