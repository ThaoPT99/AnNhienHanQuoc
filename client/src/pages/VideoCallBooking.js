import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import VideoCall from '../components/VideoCall';
import { isLoggedIn, getUserEmail, getAuthToken } from '../utils/auth';
import { showNotification } from '../components/NotificationCenter';
import './VideoCallBooking.css';

const VideoCallBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showCallFriendForm, setShowCallFriendForm] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [formData, setFormData] = useState({
    user_email: '',
    user_name: '',
    call_type: 'consultation',
    platform: 'webrtc',
    scheduled_time: '',
    duration: 30,
    timezone: 'Asia/Ho_Chi_Minh',
    notes: ''
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const userEmail = getUserEmail() || '';

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      showNotification('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để sử dụng tính năng Video Call', 'info');
      navigate(`/login?redirect=${encodeURIComponent('/video-call')}`);
      return;
    }

    if (userEmail) {
      setFormData(prev => ({ ...prev, user_email: userEmail, user_name: localStorage.getItem('userName') || '' }));
      loadBookings();
      loadFriends();
    }
    
    // Check for room parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId) {
      const userEmail = getUserEmail() || '';
      const userName = localStorage.getItem('userName') || userEmail;
      setActiveCall({
        roomId,
        userEmail,
        userName
      });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [userEmail, navigate]);

  const loadFriends = async () => {
    if (!userEmail) return;
    setLoadingFriends(true);
    try {
      const res = await fetch(`${API_URL}/api/social/following/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setFriends(data || []);
      }
    } catch (error) {
      console.error('Error loading friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const callFriend = async (friendEmail, friendName) => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userEmail = localStorage.getItem('userEmail') || '';
    const userName = localStorage.getItem('userName') || userEmail;
    const roomLink = `${window.location.origin}/video-call?room=${roomId}`;
    
    setActiveCall({
      roomId,
      userEmail,
      userName,
      friendEmail,
      friendName
    });
    
    setShowCallFriendForm(false);
    
    // Send real-time call notification via WebSocket (like Messenger)
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = API_URL.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '');
      const wsUrl = `${wsProtocol}//${wsHost}/webrtc-signaling`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        // First, join the room
        ws.send(JSON.stringify({
          type: 'join-room',
          roomId: roomId,
          userId: userEmail
        }));
        
        // Then send incoming call notification to friend
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'incoming-call',
            roomId: roomId,
            roomLink: roomLink,
            targetUserId: friendEmail,
            callerName: userName,
            callerEmail: userEmail
          }));
          ws.close();
        }, 500);
      };
    } catch (error) {
      console.error('Error sending WebSocket notification:', error);
    }
    
    // Also send email notification (optional)
    try {
      const res = await fetch(`${API_URL}/api/video-call/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          roomLink,
          callerEmail: userEmail,
          callerName: userName,
          recipientEmail: friendEmail,
          recipientName: friendName
        })
      });
      
      if (res.ok) {
        console.log('✅ Email notification sent');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
    
    alert(`📞 Đang gọi ${friendName || friendEmail}...\n\n💡 Họ sẽ nhận được thông báo cuộc gọi đến ngay lập tức (như Messenger)!`);
  };

  const loadBookings = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    // Only load bookings if user is authenticated
    const token = getAuthToken();
    if (!token) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const res = await fetch(`${API_URL}/api/video-call/bookings/${encodeURIComponent(userEmail)}`, {
        headers
      });
      
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else if (res.status === 401 || res.status === 403) {
        // Token expired or invalid - clear and show empty
        console.log('Authentication failed, showing empty bookings');
        setBookings([]);
      } else {
        console.error('Error loading bookings:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      showNotification('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để đặt lịch video call', 'info');
      navigate(`/login?redirect=${encodeURIComponent('/video-call')}`);
      return;
    }
    
    if (!userEmail) {
      showNotification('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để đặt lịch video call', 'info');
      navigate(`/login?redirect=${encodeURIComponent('/video-call')}`);
      return;
    }

    try {
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(`${API_URL}/api/video-call/bookings`, {
        method: 'POST',
        headers,
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
          platform: 'webrtc',
          scheduled_time: '',
          duration: 30,
          timezone: 'Asia/Ho_Chi_Minh',
          notes: ''
        });
        
        // If WebRTC, start call immediately
        if (formData.platform === 'webrtc') {
          const roomId = booking.meeting_id || `room_${Date.now()}`;
          setActiveCall({
            roomId,
            userEmail,
            userName: formData.user_name || userEmail
          });
        } else {
          alert('Đặt lịch thành công! Link cuộc gọi sẽ được gửi qua email.');
        }
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
          <p>Tư vấn trực tuyến - Gọi trực tiếp trên website hoặc qua Zoom/Google Meet</p>
          <div className="header-actions">
            <button 
              className="btn-call-now webrtc-call-btn"
              onClick={() => {
                const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const userEmail = localStorage.getItem('userEmail') || '';
                const userName = localStorage.getItem('userName') || userEmail;
                setActiveCall({
                  roomId,
                  userEmail,
                  userName
                });
              }}
            >
              📹 Gọi ngay trên website
            </button>
            <button 
              className="btn-call-friend"
              onClick={() => {
                if (!userEmail) {
                  alert('Vui lòng nhập email để sử dụng tính năng này');
                  return;
                }
                setShowCallFriendForm(!showCallFriendForm);
              }}
            >
              👥 Gọi cho bạn
            </button>
            <button className="btn-new-booking" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✖️ Hủy' : '+ Đặt lịch mới'}
            </button>
          </div>
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
                  <option value="webrtc">📹 Gọi trực tiếp trên website (WebRTC)</option>
                  <option value="zoom">Zoom</option>
                  <option value="google-meet">Google Meet</option>
                </select>
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                  {formData.platform === 'webrtc' 
                    ? '✅ Gọi trực tiếp trên website, không cần cài app' 
                    : 'Cần link từ Zoom/Google Meet'}
                </small>
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

        {showCallFriendForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="call-friend-form"
          >
            <h2>👥 Gọi cho bạn</h2>
            <p className="form-description">Chọn người bạn muốn gọi hoặc nhập email</p>
            
            {loadingFriends ? (
              <div className="loading">Đang tải danh sách bạn...</div>
            ) : friends.length > 0 ? (
              <div className="friends-list">
                <h3>Bạn bè của bạn:</h3>
                <div className="friends-grid">
                  {friends.map((friend) => (
                    <div 
                      key={friend.email} 
                      className="friend-card"
                      onClick={() => callFriend(friend.email, friend.name)}
                    >
                      <div className="friend-avatar">
                        {friend.name ? friend.name.charAt(0).toUpperCase() : friend.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="friend-info">
                        <div className="friend-name">{friend.name || friend.email}</div>
                        <div className="friend-email">{friend.email}</div>
                      </div>
                      <button className="call-friend-btn">📞 Gọi</button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-friends">
                <p>Bạn chưa follow ai. Hãy follow người khác trong Community để gọi họ!</p>
                <a href="/community" className="go-to-community-btn">Đi đến Community</a>
              </div>
            )}
            
            <div className="call-by-email">
              <h3>Hoặc gọi bằng email:</h3>
              <div className="email-input-group">
                <input
                  type="email"
                  placeholder="Nhập email người bạn muốn gọi"
                  className="friend-email-input"
                  id="friend-email-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value) {
                      callFriend(e.target.value, e.target.value);
                    }
                  }}
                />
                <button 
                  className="call-email-btn"
                  onClick={(e) => {
                    const input = document.getElementById('friend-email-input');
                    if (input && input.value) {
                      callFriend(input.value, input.value);
                    }
                  }}
                >
                  📞 Gọi
                </button>
              </div>
              <p className="call-info-text">
                💡 Họ sẽ nhận được thông báo cuộc gọi đến ngay lập tức (như Messenger)!<br/>
                Không cần mở email, chỉ cần đang ở trên website.
              </p>
            </div>
            
            <button 
              className="close-form-btn"
              onClick={() => setShowCallFriendForm(false)}
            >
              ✖️ Đóng
            </button>
          </motion.div>
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
                  <p><strong>Nền tảng:</strong> {
                    booking.platform === 'webrtc' ? '📹 Gọi trực tiếp trên website' :
                    booking.platform === 'zoom' ? 'Zoom' : 
                    booking.platform === 'google-meet' ? 'Google Meet' : 'Khác'
                  }</p>
                  <p><strong>Thời lượng:</strong> {booking.duration} phút</p>
                  <div className="booking-actions">
                    {booking.platform === 'webrtc' ? (
                      <button
                        className="meeting-link webrtc-btn"
                        onClick={() => {
                          setActiveCall({
                            roomId: booking.meeting_id || `room_${booking.id}`,
                            userEmail: booking.user_email,
                            userName: booking.user_name || booking.user_email
                          });
                        }}
                      >
                        📹 Bắt đầu cuộc gọi trên website
                      </button>
                    ) : booking.meeting_url ? (
                      <a href={booking.meeting_url} target="_blank" rel="noopener noreferrer" className="meeting-link">
                        🔗 Tham gia cuộc gọi ({booking.platform === 'zoom' ? 'Zoom' : 'Google Meet'})
                      </a>
                    ) : null}
                    {/* Always show WebRTC option as alternative */}
                    <button
                      className="meeting-link webrtc-alternative-btn"
                      onClick={() => {
                        const roomId = booking.meeting_id || `room_${booking.id}_${Date.now()}`;
                        setActiveCall({
                          roomId,
                          userEmail: booking.user_email,
                          userName: booking.user_name || booking.user_email
                        });
                      }}
                      title="Gọi trực tiếp trên website thay vì dùng Zoom/Google Meet"
                    >
                      📹 Gọi trên website
                    </button>
                  </div>
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

