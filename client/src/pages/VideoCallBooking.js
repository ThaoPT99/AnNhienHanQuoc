import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import VideoCall from '../components/VideoCall';
import './VideoCallBooking.css';

const VideoCallBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_email: '',
    user_name: '',
    call_type: 'consultation',
    platform: 'zoom',
    scheduled_time: '',
    duration: 30,
    timezone: 'Asia/Ho_Chi_Minh',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, user_email: userEmail, user_name: localStorage.getItem('userName') || '' }));
      loadBookings();
    }
  }, [userEmail]);

  const loadBookings = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/video-call/bookings/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      alert('Vui lòng nhập email để đặt lịch');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/video-call/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const booking = await res.json();
        setBookings([booking, ...bookings]);
        setShowForm(false);
        setFormData({
          user_email: userEmail,
          user_name: localStorage.getItem('userName') || '',
          call_type: 'consultation',
          platform: 'zoom',
          scheduled_time: '',
          duration: 30,
          timezone: 'Asia/Ho_Chi_Minh',
          notes: ''
        });
        alert('Đặt lịch thành công!');
      } else {
        alert('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="video-call-page"><div className="loading">Đang tải...</div></div>;
  }

  return (
    <div className="video-call-page">
      <SEO
        title="Đặt lịch Video Call - Du học An Nhiên"
        description="Đặt lịch tư vấn qua Zoom hoặc Google Meet"
      />

      <div className="booking-container">
        <div className="header-section">
          <h1>📹 Đặt lịch Video Call</h1>
          <p>Tư vấn trực tuyến qua Zoom hoặc Google Meet</p>
          <button className="btn-new-booking" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✖️ Hủy' : '+ Đặt lịch mới'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="booking-form"
            onSubmit={handleSubmit}
          >
            <h2>Thông tin đặt lịch</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Loại cuộc gọi</label>
                <select
                  value={formData.call_type}
                  onChange={(e) => setFormData({ ...formData, call_type: e.target.value })}
                  required
                >
                  <option value="consultation">Tư vấn</option>
                  <option value="admission">Tư vấn tuyển sinh</option>
                  <option value="visa">Tư vấn visa</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nền tảng</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  required
                >
                  <option value="zoom">Zoom</option>
                  <option value="google-meet">Google Meet</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Thời gian</label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thời lượng (phút)</label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>
            <button type="submit" className="btn-submit">📅 Đặt lịch</button>
          </motion.form>
        )}

        <div className="bookings-list">
          <h2>Lịch đã đặt</h2>
          {bookings.length === 0 ? (
            <div className="empty-state">
              <p>Chưa có lịch đặt nào</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="booking-card"
              >
                <div className="booking-header">
                  <div>
                    <h3>{booking.call_type === 'consultation' ? 'Tư vấn' : 
                         booking.call_type === 'admission' ? 'Tư vấn tuyển sinh' :
                         booking.call_type === 'visa' ? 'Tư vấn visa' : 'Khác'}</h3>
                    <p className="booking-time">{formatDateTime(booking.scheduled_time)}</p>
                  </div>
                  <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                </div>
                <div className="booking-details">
                  <p><strong>Nền tảng:</strong> {booking.platform === 'zoom' ? 'Zoom' : 'Google Meet'}</p>
                  <p><strong>Thời lượng:</strong> {booking.duration} phút</p>
                  {booking.meeting_url && (
                    <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer" className="meeting-link">
                      🔗 Tham gia cuộc gọi
                    </a>
                  )}
                  {booking.notes && <p className="booking-notes">{booking.notes}</p>}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* WebRTC Video Call Component */}
      {activeCall && (
        <VideoCall
          roomId={activeCall.roomId}
          userEmail={activeCall.userEmail}
          userName={activeCall.userName}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
};

export default VideoCallBooking;

