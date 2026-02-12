import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatVietnamDateTime } from '../utils/timezone';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [newsletter, setNewsletter] = useState([]);
  const [events, setEvents] = useState([]);
  const [recruitment, setRecruitment] = useState([]);
  const [resources, setResources] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [visitStats, setVisitStats] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [users, setUsers] = useState([]);
  // const [editingUser, setEditingUser] = useState(null); // Unused but kept for potential future use
  const [serviceRedemptions, setServiceRedemptions] = useState([]);
  const [documentReviews, setDocumentReviews] = useState([]);
  const [visaSupport, setVisaSupport] = useState([]);
  const [luckyDrawParticipants, setLuckyDrawParticipants] = useState([]);
  const [luckyDrawRewards, setLuckyDrawRewards] = useState([]);
  const [luckyDrawStats, setLuckyDrawStats] = useState(null);
  const [luckyDrawSettings, setLuckyDrawSettings] = useState({ win_rate: 30, is_active: 1 });
  const [showLuckyDrawRewardModal, setShowLuckyDrawRewardModal] = useState(false);
  const [editingLuckyDrawReward, setEditingLuckyDrawReward] = useState(null);
  const [luckyDrawRewardForm, setLuckyDrawRewardForm] = useState({ name: '', description: '', image: '', stock_quantity: 0, is_active: 1 });
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'Hội thảo',
    status: 'upcoming',
    image: '',
    agenda: [],
    speakers: [],
    capacity: 50
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingResource, setUploadingResource] = useState(false);
  const [uploadResourceFile, setUploadResourceFile] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const getToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return null;
    }
    return token;
  };

  const fetchAllData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const headers = { 'x-admin-token': token };

      const [contactsRes, newsletterRes, eventsRes, recruitmentRes, resourcesRes, consultationsRes, bookingsRes, visitsRes, statsRes, communityRes, eventListRes, usersRes, serviceRes, reviewsRes, visaRes, participantsRes, rewardsRes, statsLuckyRes, settingsRes] = await Promise.all([
        axios.get(`${API_URL}/api/contacts`, { headers }),
        axios.get(`${API_URL}/api/newsletter/subscribers`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/events/registrations`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/recruitment/applications`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/resources/downloads`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/consultation/registrations`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/consultation/bookings`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/visits`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/visits/stats`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/community/posts/admin/all`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/events/list`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/users`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/service-redemptions`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/document-reviews`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/visa-support`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/lucky-draw/participants`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/lucky-draw/rewards`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/admin/lucky-draw/stats`, { headers }).catch(() => ({ data: null })),
        axios.get(`${API_URL}/api/admin/lucky-draw/settings`, { headers }).catch(() => ({ data: { win_rate: 30, is_active: 1 } }))
      ]);

      setContacts(contactsRes.data || []);
      setNewsletter(newsletterRes.data || []);
      setEvents(eventsRes.data || []);
      setRecruitment(recruitmentRes.data || []);
      setResources(resourcesRes.data || []);
      setConsultations(consultationsRes.data || []);
      setBookings(bookingsRes.data || []);
      setVisits(visitsRes.data || []);
      setVisitStats(statsRes.data || []);
      setCommunityPosts(communityRes.data || []);
      setEventList(eventListRes.data || []);
      setUsers(usersRes.data || []);
      setServiceRedemptions(serviceRes.data || []);
      setDocumentReviews(reviewsRes.data || []);
      setVisaSupport(visaRes.data || []);
      setLuckyDrawParticipants(participantsRes.data || []);
      setLuckyDrawRewards(rewardsRes.data || []);
      setLuckyDrawStats(statsLuckyRes.data || null);
      setLuckyDrawSettings(settingsRes.data || { win_rate: 30, is_active: 1 });
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối server hoặc đăng nhập lại.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục này?')) return;

    const token = getToken();
    if (!token) return;

    try {
      let endpoint = '';
      switch (type) {
        case 'contacts':
          endpoint = `/api/contacts/${id}`;
          await axios.delete(`${API_URL}${endpoint}`, { headers: { 'x-admin-token': token } });
          setContacts(contacts.filter(item => item.id !== id));
          break;
        case 'community':
          endpoint = `/api/community/posts/${id}`;
          await axios.delete(`${API_URL}${endpoint}`, { headers: { 'x-admin-token': token } });
          setCommunityPosts(communityPosts.filter(item => item.id !== id));
          break;
        default:
          alert('Chức năng xóa chưa được hỗ trợ cho mục này');
      }
    } catch (err) {
      alert('Không thể xóa. Vui lòng thử lại.');
      console.error('Error deleting:', err);
    }
  };

  const handleStatusUpdate = async (type, id, status) => {
    const token = getToken();
    if (!token) return;

    try {
      let endpoint = '';
      switch (type) {
        case 'recruitment':
          endpoint = `/api/recruitment/${id}/status`;
          await axios.patch(`${API_URL}${endpoint}`, { status }, { headers: { 'x-admin-token': token } });
          setRecruitment(recruitment.map(item => item.id === id ? { ...item, status } : item));
          break;
        default:
          alert('Chức năng cập nhật status chưa được hỗ trợ');
      }
    } catch (err) {
      alert('Không thể cập nhật. Vui lòng thử lại.');
      console.error('Error updating status:', err);
    }
  };

  const handleUpdateUserPoints = async (email, points, level) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(`${API_URL}/api/admin/users/${encodeURIComponent(email)}/points`, 
        { points, level },
        { headers: { 'x-admin-token': token } }
      );
      setUsers(users.map(user => 
        user.user_email === email ? { ...user, points, level } : user
      ));
      alert('✅ Đã cập nhật điểm thành công!');
    } catch (err) {
      alert('Không thể cập nhật điểm. Vui lòng thử lại.');
      console.error('Error updating user points:', err);
    }
  };

  const handleUpdateServiceStatus = async (id, status, admin_notes = null) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(`${API_URL}/api/admin/service-redemptions/${id}`, 
        { status, admin_notes },
        { headers: { 'x-admin-token': token } }
      );
      setServiceRedemptions(serviceRedemptions.map(item => 
        item.id === id ? { ...item, status, admin_notes: admin_notes || item.admin_notes } : item
      ));
      if (admin_notes) {
        alert('✅ Đã cập nhật ghi chú thành công!');
      }
    } catch (err) {
      alert('Không thể cập nhật. Vui lòng thử lại.');
      console.error('Error updating service redemption:', err);
    }
  };

  const handleUpdateDocumentReview = async (id, admin_review, admin_feedback, status) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(`${API_URL}/api/admin/document-reviews/${id}`, 
        { admin_review, admin_feedback, status },
        { headers: { 'x-admin-token': token } }
      );
      setDocumentReviews(documentReviews.map(item => 
        item.id === id ? { ...item, admin_review, admin_feedback, status } : item
      ));
      alert('✅ Đã cập nhật review thành công!');
    } catch (err) {
      alert('Không thể cập nhật. Vui lòng thử lại.');
      console.error('Error updating document review:', err);
    }
  };

  const handleUpdateVisaSupport = async (id, admin_response, status) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(`${API_URL}/api/admin/visa-support/${id}`, 
        { admin_response, status },
        { headers: { 'x-admin-token': token } }
      );
      setVisaSupport(visaSupport.map(item => 
        item.id === id ? { ...item, admin_response, status } : item
      ));
      alert('✅ Đã cập nhật phản hồi thành công!');
    } catch (err) {
      alert('Không thể cập nhật. Vui lòng thử lại.');
      console.error('Error updating visa support:', err);
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${email}?`)) return;

    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/admin/users/${encodeURIComponent(email)}`, {
        headers: { 'x-admin-token': token }
      });
      setUsers(users.filter(user => user.user_email !== email));
      alert('✅ Đã xóa người dùng thành công!');
    } catch (err) {
      alert('Không thể xóa. Vui lòng thử lại.');
      console.error('Error deleting user:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return formatVietnamDateTime(dateString, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'Hội thảo',
      status: 'upcoming',
      image: '',
      agenda: [],
      speakers: [],
      capacity: 50
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      type: event.type || 'Hội thảo',
      status: event.status || 'upcoming',
      image: event.image || '',
      agenda: Array.isArray(event.agenda) ? event.agenda : [],
      speakers: Array.isArray(event.speakers) ? event.speakers : [],
      capacity: event.capacity || 50
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;

    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/events/list/${id}`, {
        headers: { 'x-admin-token': token }
      });
      setEventList(eventList.filter(item => item.id !== id));
      alert('Đã xóa sự kiện thành công!');
    } catch (err) {
      alert('Không thể xóa. Vui lòng thử lại.');
      console.error('Error deleting event:', err);
    }
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    try {
      if (editingEvent) {
        // Update
        await axios.put(`${API_URL}/api/events/list/${editingEvent.id}`, eventForm, {
          headers: { 'x-admin-token': token }
        });
        alert('Đã cập nhật sự kiện thành công!');
      } else {
        // Create
        await axios.post(`${API_URL}/api/events/list`, eventForm, {
          headers: { 'x-admin-token': token }
        });
        alert('Đã tạo sự kiện thành công!');
      }
      setShowEventModal(false);
      fetchAllData();
    } catch (err) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error saving event:', err);
    }
  };

  const addAgendaItem = () => {
    setEventForm(prev => ({
      ...prev,
      agenda: [...prev.agenda, '']
    }));
  };

  const updateAgendaItem = (index, value) => {
    setEventForm(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => i === index ? value : item)
    }));
  };

  const removeAgendaItem = (index) => {
    setEventForm(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const addSpeaker = () => {
    setEventForm(prev => ({
      ...prev,
      speakers: [...prev.speakers, '']
    }));
  };

  const updateSpeaker = (index, value) => {
    setEventForm(prev => ({
      ...prev,
      speakers: prev.speakers.map((item, i) => i === index ? value : item)
    }));
  };

  const removeSpeaker = (index) => {
    setEventForm(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh data every 30 seconds when on lucky-draw tab
    const interval = setInterval(() => {
      if (activeTab === 'lucky-draw') {
        fetchAllData();
      }
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const tabs = [
    { id: 'contacts', label: '📞 Liên hệ', count: contacts.length, icon: '💬' },
    { id: 'consultations', label: '🎓 Tư vấn', count: consultations.length, icon: '💬' },
    { id: 'bookings', label: '📅 Đặt lịch', count: bookings.length, icon: '📆' },
    { id: 'visits', label: '👁️ Truy cập', count: visits.length, icon: '🌐' },
    { id: 'community', label: '💬 Cộng đồng', count: communityPosts.length, icon: '👥' },
    { id: 'users', label: '👤 Người dùng', count: users.length, icon: '⭐' },
    { id: 'services', label: '🎯 Dịch vụ', count: serviceRedemptions.length, icon: '🎯' },
    { id: 'reviews', label: '📄 Review', count: documentReviews.length, icon: '📄' },
    { id: 'visa', label: '🛂 Visa', count: visaSupport.length, icon: '🛂' },
    { id: 'newsletter', label: '📧 Newsletter', count: newsletter.length, icon: '📨' },
    { id: 'events', label: '📅 Sự kiện', count: events.length, icon: '🎉' },
    { id: 'recruitment', label: '💼 Tuyển dụng', count: recruitment.length, icon: '👔' },
    { id: 'resources', label: '📥 Tài liệu', count: resources.length, icon: '📚' },
    { id: 'lucky-draw', label: '🎁 Vòng quay may mắn', count: luckyDrawParticipants.length, icon: '🎰' }
  ];

  // const getCurrentData = () => { // Unused but kept for potential future use
  // const _getCurrentData = () => {
  //   switch (activeTab) {
  //     case 'contacts': return contacts;
  //     case 'consultations': return consultations;
  //     case 'bookings': return bookings;
  //     case 'visits': return visits;
  //     case 'community': return communityPosts;
  //     case 'newsletter': return newsletter;
  //     case 'events': return events;
  //     case 'recruitment': return recruitment;
  //     case 'resources': return resources;
  //     default: return [];
  //   }
  // }; // Unused but kept for potential future use

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>📊 Quản lý dữ liệu</h1>
        <div className="admin-actions">
          <button onClick={fetchAllData} className="refresh-btn">🔄 Làm mới</button>
          <button onClick={() => navigate('/admin-gallery')} className="refresh-btn">🖼 Quản lý thư viện ảnh</button>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {activeTab === 'contacts' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Danh sách liên hệ ({contacts.length})</h2>
                {contacts.length === 0 ? (
                  <div className="no-data">Chưa có thông tin liên hệ nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Tin nhắn</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contacts.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                          <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                          <td className="message-cell">{item.message || <em>Không có</em>}</td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>
                            <button onClick={() => handleDelete('contacts', item.id)} className="delete-btn">
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'consultations' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Đăng ký tư vấn miễn phí ({consultations.length})</h2>
                {consultations.length === 0 ? (
                  <div className="no-data">Chưa có đăng ký tư vấn nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Trình độ</th>
                        <th>Ngành quan tâm</th>
                        <th>Thành phố</th>
                        <th>Ngân sách</th>
                        <th>TOPIK</th>
                        <th>Nguồn</th>
                        <th>Ngày đăng ký</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                          <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                          <td>{item.current_grade || <em>Không có</em>}</td>
                          <td>{item.interested_major || <em>Không có</em>}</td>
                          <td>{item.interested_city || <em>Không có</em>}</td>
                          <td>{item.budget || <em>Không có</em>}</td>
                          <td>{item.topik_level || <em>Không có</em>}</td>
                          <td>
                            <span className="source-badge">
                              {item.trigger_source === 'floating-button' ? '🔘 Nút nổi' : 
                               item.trigger_source === 'general' ? '🌐 Website' : item.trigger_source}
                            </span>
                          </td>
                          <td>{formatDate(item.submitted_at)}</td>
                          <td>
                            {item.message && (
                              <button 
                                onClick={() => alert(item.message || 'Không có tin nhắn')}
                                className="view-message-btn"
                                title="Xem tin nhắn"
                              >
                                💬
                              </button>
                            )}
                            <button onClick={() => handleDelete('consultations', item.id)} className="delete-btn">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'community' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Quản lý bài viết cộng đồng ({communityPosts.length})</h2>
                {communityPosts.length === 0 ? (
                  <div className="no-data">Chưa có bài viết nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Tác giả</th>
                        <th>Danh mục</th>
                        <th>Loại</th>
                        <th>Likes</th>
                        <th>Comments</th>
                        <th>Views</th>
                        <th>Nổi bật</th>
                        <th>Ngày đăng</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {communityPosts.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td className="message-cell" title={item.title}>
                            {item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}
                          </td>
                          <td>{item.author_name || 'N/A'}</td>
                          <td>{item.category}</td>
                          <td>
                            {item.type === 'discussion' ? '💬 Thảo luận' :
                             item.type === 'question' ? '❓ Hỏi đáp' :
                             item.type === 'experience' ? '📖 Kinh nghiệm' : item.type}
                          </td>
                          <td>{item.likes_count || 0}</td>
                          <td>{item.comments_count || 0}</td>
                          <td>{item.views_count || 0}</td>
                          <td>
                            {item.is_featured ? '⭐' : '-'}
                          </td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>
                            <button
                              onClick={async () => {
                                const token = getToken();
                                if (!token) return;
                                try {
                                  await axios.patch(
                                    `${API_URL}/api/community/posts/${item.id}/featured`,
                                    {},
                                    { headers: { 'x-admin-token': token } }
                                  );
                                  fetchAllData();
                                } catch (err) {
                                  alert('Không thể cập nhật. Vui lòng thử lại.');
                                }
                              }}
                              className="feature-btn"
                              title={item.is_featured ? 'Bỏ đánh dấu nổi bật' : 'Đánh dấu nổi bật'}
                            >
                              {item.is_featured ? '⭐' : '☆'}
                            </button>
                            <button onClick={() => handleDelete('community', item.id)} className="delete-btn">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">👤 Quản lý người dùng ({users.length})</h2>
                {users.length === 0 ? (
                  <div className="no-data">Chưa có người dùng nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Hạng</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Xác thực</th>
                        <th>Điểm</th>
                        <th>Level</th>
                        <th>Ngày đăng ký</th>
                        <th>Đăng nhập cuối</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.user_email}>
                          <td>
                            {user.rank ? (
                              <span style={{
                                display: 'inline-block',
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: user.rank <= 3 ? '#ffd700' : '#667eea',
                                color: 'white',
                                textAlign: 'center',
                                lineHeight: '30px',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                              }}>
                                {user.rank}
                              </span>
                            ) : (
                              <span style={{ color: '#999', fontSize: '0.9rem' }}>-</span>
                            )}
                          </td>
                          <td><a href={`mailto:${user.user_email}`}>{user.user_email}</a></td>
                          <td>{user.user_name || user.display_name || '-'}</td>
                          <td>
                            {user.phone ? (
                              <a href={`tel:${user.phone}`}>{user.phone}</a>
                            ) : (
                              <em style={{ color: '#999' }}>Không có</em>
                            )}
                          </td>
                          <td>
                            {user.email_verified === true ? (
                              <span style={{
                                padding: '4px 8px',
                                background: '#e8f5e9',
                                borderRadius: '4px',
                                fontWeight: '600',
                                color: '#2e7d32',
                                fontSize: '0.85rem'
                              }}>
                                ✅ Đã xác thực
                              </span>
                            ) : user.email_verified === false ? (
                              <span style={{
                                padding: '4px 8px',
                                background: '#fff3e0',
                                borderRadius: '4px',
                                fontWeight: '600',
                                color: '#f57c00',
                                fontSize: '0.85rem'
                              }}>
                                ⏳ Chưa xác thực
                              </span>
                            ) : (
                              <span style={{ color: '#999', fontSize: '0.85rem' }}>-</span>
                            )}
                          </td>
                          <td>
                            <strong style={{ color: '#667eea', fontSize: '1.1rem' }}>
                              {user.points || 0}
                            </strong>
                          </td>
                          <td>
                            <span style={{
                              padding: '4px 8px',
                              background: '#e8f5e9',
                              borderRadius: '4px',
                              fontWeight: '600',
                              color: '#2e7d32'
                            }}>
                              Level {user.level || 1}
                            </span>
                          </td>
                          <td>{formatDate(user.registered_at || user.created_at)}</td>
                          <td>{formatDate(user.last_login) || <em style={{ color: '#999' }}>Chưa đăng nhập</em>}</td>
                          <td>
                            <button
                              onClick={() => {
                                const newPoints = prompt(`Nhập điểm mới cho ${user.user_email}:`, user.points || 0);
                                if (newPoints !== null) {
                                  const pointsNum = parseInt(newPoints);
                                  if (isNaN(pointsNum)) {
                                    alert('Vui lòng nhập số hợp lệ!');
                                    return;
                                  }
                                  const levelNum = Math.floor(pointsNum / 500) + 1;
                                  handleUpdateUserPoints(user.user_email, pointsNum, levelNum);
                                }
                              }}
                              className="edit-btn"
                              title="Chỉnh sửa điểm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.user_email)}
                              className="delete-btn"
                              title="Xóa người dùng"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">🎯 Đăng ký dịch vụ ({serviceRedemptions.length})</h2>
                {serviceRedemptions.length === 0 ? (
                  <div className="no-data">Chưa có đăng ký dịch vụ nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Email</th>
                        <th>Dịch vụ</th>
                        <th>Ngày mong muốn</th>
                        <th>Giờ</th>
                        <th>Phương thức</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                        <th>Ngày đăng ký</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRedemptions.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td><a href={`mailto:${item.user_email}`}>{item.user_email}</a></td>
                          <td><strong>{item.reward_name || 'N/A'}</strong></td>
                          <td>{item.preferred_date || '-'}</td>
                          <td>{item.preferred_time || '-'}</td>
                          <td>
                            {item.preferred_method === 'zoom' ? '📹 Zoom' :
                             item.preferred_method === 'phone' ? '📞 Điện thoại' :
                             item.preferred_method === 'office' ? '🏢 Văn phòng' : item.preferred_method}
                          </td>
                          <td className="message-cell">
                            {item.notes ? (
                              <button onClick={() => alert(item.notes)} className="view-message-btn" title="Xem ghi chú">
                                💬 {item.notes.length > 30 ? item.notes.substring(0, 30) + '...' : item.notes}
                              </button>
                            ) : <em>Không có</em>}
                          </td>
                          <td>
                            <select
                              value={item.status}
                              onChange={(e) => handleUpdateServiceStatus(item.id, e.target.value)}
                              className={`status-select ${item.status}`}
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="confirmed">✅ Đã xác nhận</option>
                              <option value="completed">✅ Hoàn thành</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>
                            <button
                              onClick={() => {
                                const notes = prompt('Ghi chú admin:', item.admin_notes || '');
                                if (notes !== null) {
                                  handleUpdateServiceStatus(item.id, item.status, notes);
                                }
                              }}
                              className="edit-btn"
                              title="Thêm ghi chú"
                            >
                              📝
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">📄 Review hồ sơ ({documentReviews.length})</h2>
                {documentReviews.length === 0 ? (
                  <div className="no-data">Chưa có yêu cầu review nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Email</th>
                        <th>Loại review</th>
                        <th>Link/Tên file</th>
                        <th>Ghi chú user</th>
                        <th>Review admin</th>
                        <th>Feedback</th>
                        <th>Trạng thái</th>
                        <th>Ngày gửi</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentReviews.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td><a href={`mailto:${item.user_email}`}>{item.user_email}</a></td>
                          <td><strong>{item.reward_name || 'N/A'}</strong></td>
                          <td>
                            {item.document_url ? (
                              <a href={item.document_url} target="_blank" rel="noopener noreferrer">
                                🔗 Link
                              </a>
                            ) : (
                              item.document_name || '-'
                            )}
                          </td>
                          <td className="message-cell">
                            {item.user_notes ? (
                              <button onClick={() => alert(item.user_notes)} className="view-message-btn" title="Xem ghi chú">
                                💬 {item.user_notes.length > 30 ? item.user_notes.substring(0, 30) + '...' : item.user_notes}
                              </button>
                            ) : <em>Không có</em>}
                          </td>
                          <td className="message-cell">
                            {item.admin_review ? (
                              <button onClick={() => alert(item.admin_review)} className="view-message-btn" title="Xem review">
                                📝 {item.admin_review.length > 30 ? item.admin_review.substring(0, 30) + '...' : item.admin_review}
                              </button>
                            ) : <em>Chưa review</em>}
                          </td>
                          <td className="message-cell">
                            {item.admin_feedback ? (
                              <button onClick={() => alert(item.admin_feedback)} className="view-message-btn" title="Xem feedback">
                                💬 {item.admin_feedback.length > 30 ? item.admin_feedback.substring(0, 30) + '...' : item.admin_feedback}
                              </button>
                            ) : <em>Chưa có</em>}
                          </td>
                          <td>
                            <select
                              value={item.status}
                              onChange={(e) => {
                                const review = prompt('Review:', item.admin_review || '');
                                const feedback = prompt('Feedback:', item.admin_feedback || '');
                                if (review !== null && feedback !== null) {
                                  handleUpdateDocumentReview(item.id, review, feedback, e.target.value);
                                }
                              }}
                              className={`status-select ${item.status}`}
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="reviewing">👀 Đang review</option>
                              <option value="completed">✅ Hoàn thành</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>
                            <button
                              onClick={() => {
                                const review = prompt('Review:', item.admin_review || '');
                                const feedback = prompt('Feedback:', item.admin_feedback || '');
                                if (review !== null && feedback !== null) {
                                  handleUpdateDocumentReview(item.id, review, feedback, item.status);
                                }
                              }}
                              className="edit-btn"
                              title="Cập nhật review"
                            >
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'visa' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">🛂 Hỗ trợ visa ({visaSupport.length})</h2>
                {visaSupport.length === 0 ? (
                  <div className="no-data">Chưa có yêu cầu hỗ trợ visa nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Email</th>
                        <th>Loại hỗ trợ</th>
                        <th>Tình trạng</th>
                        <th>Câu hỏi</th>
                        <th>Tài liệu</th>
                        <th>Phản hồi admin</th>
                        <th>Trạng thái</th>
                        <th>Ngày gửi</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visaSupport.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td><a href={`mailto:${item.user_email}`}>{item.user_email}</a></td>
                          <td><strong>{item.reward_name || 'N/A'}</strong></td>
                          <td>{item.current_status || '-'}</td>
                          <td className="message-cell">
                            {item.questions ? (
                              <button onClick={() => alert(item.questions)} className="view-message-btn" title="Xem câu hỏi">
                                💬 {item.questions.length > 30 ? item.questions.substring(0, 30) + '...' : item.questions}
                              </button>
                            ) : <em>Không có</em>}
                          </td>
                          <td>
                            {item.documents_uploaded ? (
                              <a href={item.documents_uploaded} target="_blank" rel="noopener noreferrer">
                                🔗 Link
                              </a>
                            ) : '-'}
                          </td>
                          <td className="message-cell">
                            {item.admin_response ? (
                              <button onClick={() => alert(item.admin_response)} className="view-message-btn" title="Xem phản hồi">
                                📝 {item.admin_response.length > 30 ? item.admin_response.substring(0, 30) + '...' : item.admin_response}
                              </button>
                            ) : <em>Chưa phản hồi</em>}
                          </td>
                          <td>
                            <select
                              value={item.status}
                              onChange={(e) => {
                                const response = prompt('Phản hồi admin:', item.admin_response || '');
                                if (response !== null) {
                                  handleUpdateVisaSupport(item.id, response, e.target.value);
                                }
                              }}
                              className={`status-select ${item.status}`}
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="in_progress">🔄 Đang xử lý</option>
                              <option value="completed">✅ Hoàn thành</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>
                            <button
                              onClick={() => {
                                const response = prompt('Phản hồi admin:', item.admin_response || '');
                                if (response !== null) {
                                  handleUpdateVisaSupport(item.id, response, item.status);
                                }
                              }}
                              className="edit-btn"
                              title="Cập nhật phản hồi"
                            >
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Đặt lịch tư vấn ({bookings.length})</h2>
                {bookings.length === 0 ? (
                  <div className="no-data">Chưa có đặt lịch nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Phương thức</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                          <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                          <td>
                            <strong style={{ color: '#667eea' }}>
                              {item.formatted_date || item.date || 'N/A'}
                            </strong>
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              background: '#e8f5e9', 
                              borderRadius: '4px', 
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: '#2e7d32'
                            }}>
                              {item.time || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              background: '#fff3e0', 
                              borderRadius: '4px', 
                              fontSize: '0.85rem'
                            }}>
                              {item.preferred_method === 'zoom' ? '📹 Zoom' : 
                               item.preferred_method === 'phone' ? '📞 Điện thoại' : 
                               item.preferred_method === 'office' ? '🏢 Văn phòng' : 
                               item.preferred_method || 'Zoom'}
                            </span>
                          </td>
                          <td className="message-cell">
                            {item.notes ? (
                              <button 
                                onClick={() => alert(item.notes || 'Không có ghi chú')}
                                className="view-message-btn"
                                title="Xem ghi chú"
                              >
                                💬 {item.notes.length > 30 ? item.notes.substring(0, 30) + '...' : item.notes}
                              </button>
                            ) : (
                              <em>Không có</em>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${item.status || 'pending'}`}>
                              {item.status === 'confirmed' ? '✅ Đã xác nhận' : 
                               item.status === 'completed' ? '✅ Hoàn thành' : 
                               item.status === 'cancelled' ? '❌ Đã hủy' : 
                               '⏳ Chờ xử lý'}
                            </span>
                          </td>
                          <td>{formatDate(item.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Lịch sử truy cập ({visits.length})</h2>
                
                {visitStats.length > 0 && (
                  <div className="stats-section" style={{ marginBottom: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                    <h3 style={{ marginBottom: '15px', color: '#333' }}>📊 Thống kê 30 ngày gần nhất</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                      {visitStats.map((stat, idx) => (
                        <div key={idx} style={{ padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>{stat.page_path || 'Trang chủ'}</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{stat.page_views}</div>
                          <div style={{ fontSize: '0.8rem', color: '#999' }}>lượt xem</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {visits.length === 0 ? (
                  <div className="no-data">Chưa có dữ liệu truy cập</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>IP Address</th>
                        <th>Trang</th>
                        <th>Thiết bị</th>
                        <th>Trình duyệt</th>
                        <th>Hệ điều hành</th>
                        <th>Referrer</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.ip_address || 'Unknown'}</td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              background: '#e3f2fd', 
                              borderRadius: '4px', 
                              fontSize: '0.85rem',
                              fontFamily: 'monospace'
                            }}>
                              {item.page_path || '/'}
                            </span>
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 8px', 
                              background: '#f3e5f5', 
                              borderRadius: '4px', 
                              fontSize: '0.85rem'
                            }}>
                              {item.device_type || 'Unknown'}
                            </span>
                          </td>
                          <td>{item.browser || 'Unknown'}</td>
                          <td>{item.os || 'Unknown'}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.referrer ? (
                              <a href={item.referrer} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none' }}>
                                {item.referrer.length > 30 ? item.referrer.substring(0, 30) + '...' : item.referrer}
                              </a>
                            ) : (
                              <em style={{ color: '#999' }}>Direct</em>
                            )}
                          </td>
                          <td>{formatDate(item.visited_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Danh sách đăng ký Newsletter ({newsletter.length})</h2>
                {newsletter.length === 0 ? (
                  <div className="no-data">Chưa có người đăng ký nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Nguồn</th>
                        <th>Trạng thái</th>
                        <th>Ngày đăng ký</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newsletter.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                          <td>{item.name || <em>Không có</em>}</td>
                          <td>
                            {item.phone ? (
                              <a href={`tel:${item.phone}`}>{item.phone}</a>
                            ) : (
                              <em>Không có</em>
                            )}
                          </td>
                          <td>{item.source || 'website'}</td>
                          <td>
                            <span className={`status-badge ${item.status}`}>
                              {item.status === 'active' ? '✅ Đang hoạt động' : '❌ Đã hủy'}
                            </span>
                          </td>
                          <td>{formatDate(item.subscribed_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="data-table-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 className="section-title">Quản lý sự kiện ({eventList.length})</h2>
                  <button onClick={handleCreateEvent} className="refresh-btn" style={{ background: '#667eea' }}>
                    ➕ Tạo sự kiện mới
                  </button>
                </div>
                
                {eventList.length === 0 ? (
                  <div className="no-data">Chưa có sự kiện nào. Click "Tạo sự kiện mới" để bắt đầu.</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Địa điểm</th>
                        <th>Loại</th>
                        <th>Trạng thái</th>
                        <th>Đã đăng ký</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventList.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td className="message-cell" title={item.title}>
                            {item.title.length > 40 ? item.title.substring(0, 40) + '...' : item.title}
                          </td>
                          <td>{item.date}</td>
                          <td>{item.time}</td>
                          <td className="message-cell" title={item.location}>
                            {item.location.length > 30 ? item.location.substring(0, 30) + '...' : item.location}
                          </td>
                          <td>{item.type}</td>
                          <td>
                            <span className={`status-badge ${item.status}`}>
                              {item.status === 'upcoming' ? '⏳ Sắp tới' : '✅ Đã qua'}
                            </span>
                          </td>
                          <td>{item.registered || 0}/{item.capacity || 50}</td>
                          <td>
                            <button onClick={() => handleEditEvent(item)} className="feature-btn" title="Sửa">
                              ✏️
                            </button>
                            <button onClick={() => handleDeleteEvent(item.id)} className="delete-btn" title="Xóa">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #eee' }}>
                  <h2 className="section-title">Đăng ký sự kiện ({events.length})</h2>
                  {events.length === 0 ? (
                    <div className="no-data">Chưa có đăng ký sự kiện nào</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Họ và tên</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>ID Sự kiện</th>
                          <th>Trạng thái</th>
                          <th>Ngày đăng ký</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                            <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                            <td>Sự kiện #{item.event_id}</td>
                            <td>
                              <span className={`status-badge ${item.status}`}>
                                {item.status === 'pending' ? '⏳ Chờ xử lý' : '✅ Đã xử lý'}
                              </span>
                            </td>
                            <td>{formatDate(item.registered_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'recruitment' && (
              <div className="data-table-wrapper">
                <h2 className="section-title">Đơn ứng tuyển ({recruitment.length})</h2>
                {recruitment.length === 0 ? (
                  <div className="no-data">Chưa có đơn ứng tuyển nào</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vị trí</th>
                        <th>CV</th>
                        <th>Trạng thái</th>
                        <th>Ngày ứng tuyển</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruitment.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                          <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                          <td>{item.position}</td>
                          <td>
                            {item.cv_file_path ? (
                              <a href={item.cv_file_path} target="_blank" rel="noopener noreferrer" className="cv-link">
                                📄 Xem CV
                              </a>
                            ) : (
                              <em>Không có</em>
                            )}
                          </td>
                          <td>
                            <select
                              value={item.status || 'pending'}
                              onChange={(e) => handleStatusUpdate('recruitment', item.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="pending">⏳ Chờ xử lý</option>
                              <option value="reviewing">👀 Đang xem xét</option>
                              <option value="accepted">✅ Chấp nhận</option>
                              <option value="rejected">❌ Từ chối</option>
                            </select>
                          </td>
                          <td>{formatDate(item.applied_at)}</td>
                          <td>
                            <button onClick={() => handleDelete('recruitment', item.id)} className="delete-btn">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <>
                {/* Upload Resource File Section */}
                <div className="admin-login-form" style={{ marginBottom: '30px' }}>
                  <h2 className="section-title">📤 Upload Tài liệu</h2>
                  <div style={{ marginBottom: '15px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: '600' }}>Danh sách tài liệu cần upload:</p>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      <li>1. checklist-ho-so-du-hoc-han-quoc.pdf</li>
                      <li>2. huong-dan-xin-visa-d2.pdf</li>
                      <li>3. template-thu-gioi-thieu-ban-than.docx</li>
                      <li>4. ke-hoach-hoc-tap-mau.docx</li>
                      <li>5. danh-sach-truong-dai-hoc-han-quoc.pdf</li>
                      <li>6. huong-dan-luyen-thi-topik.pdf</li>
                      <li>7. tu-vung-tieng-han-du-hoc-sinh.pdf</li>
                      <li>8. huong-dan-tim-nha-o-han-quoc.pdf</li>
                      <li>9. checklist-chuan-bi-len-duong.pdf</li>
                      <li>10. huong-dan-lam-them-han-quoc.pdf</li>
                    </ul>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                      ⚠️ <strong>Lưu ý:</strong> Tên file phải chính xác như trên (không phân biệt hoa thường)
                    </p>
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!uploadResourceFile) {
                      alert('Vui lòng chọn file để upload');
                      return;
                    }

                    const token = getToken();
                    if (!token) return;

                    const formData = new FormData();
                    formData.append('file', uploadResourceFile);

                    try {
                      setUploadingResource(true);
                      const response = await axios.post(
                        `${API_URL}/api/admin/resources/upload`,
                        formData,
                        {
                          headers: {
                            'x-admin-token': token,
                            'Content-Type': 'multipart/form-data'
                          }
                        }
                      );

                      alert(`✅ Upload thành công!\n\nFile: ${response.data.filename}\nKích thước: ${(response.data.size / 1024).toFixed(2)} KB`);
                      setUploadResourceFile(null);
                      document.getElementById('resource-file-input').value = '';
                    } catch (err) {
                      console.error('Upload error:', err);
                      alert(`❌ Lỗi upload: ${err.response?.data?.error || err.message || 'Không thể upload file'}`);
                    } finally {
                      setUploadingResource(false);
                    }
                  }}>
                    <div className="form-group">
                      <label>Chọn file PDF hoặc DOCX</label>
                      <input
                        id="resource-file-input"
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setUploadResourceFile(e.target.files[0])}
                        disabled={uploadingResource}
                      />
                      {uploadResourceFile && (
                        <p style={{ marginTop: '10px', color: '#666' }}>
                          File đã chọn: <strong>{uploadResourceFile.name}</strong> ({(uploadResourceFile.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="refresh-btn"
                      disabled={uploadingResource || !uploadResourceFile}
                      style={{ opacity: (uploadingResource || !uploadResourceFile) ? 0.6 : 1 }}
                    >
                      {uploadingResource ? '⏳ Đang upload...' : '📤 Upload File'}
                    </button>
                  </form>
                </div>

                {/* Download History */}
                <div className="data-table-wrapper">
                  <h2 className="section-title">Lịch sử tải tài liệu ({resources.length})</h2>
                  {resources.length === 0 ? (
                    <div className="no-data">Chưa có lượt tải nào</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Tài liệu</th>
                          <th>ID Tài liệu</th>
                          <th>Ngày tải</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resources.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
                            <td>
                              {item.phone ? (
                                <a href={`tel:${item.phone}`}>{item.phone}</a>
                              ) : (
                                <em style={{ color: '#999' }}>Không có</em>
                              )}
                            </td>
                            <td>{item.resource_title || `Tài liệu #${item.resource_id}`}</td>
                            <td>#{item.resource_id}</td>
                            <td>{formatDate(item.downloaded_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {activeTab === 'lucky-draw' && (
              <>
                <div className="data-table-wrapper">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 className="section-title">🎁 Quản lý Vòng Quay May Mắn</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={async () => {
                        if (!window.confirm('Bạn có chắc muốn xóa TẤT CẢ phần quà? Hành động này không thể hoàn tác!')) return;
                        const token = getToken();
                        if (!token) return;
                        try {
                          await axios.delete(`${API_URL}/api/admin/lucky-draw/rewards`, {
                            headers: { 'x-admin-token': token }
                          });
                          // Reload rewards list
                          const rewardsRes = await axios.get(`${API_URL}/api/admin/lucky-draw/rewards`, {
                            headers: { 'x-admin-token': token }
                          });
                          setLuckyDrawRewards(rewardsRes.data || []);
                          alert('✅ Đã xóa tất cả phần quà thành công!');
                        } catch (err) {
                          alert('Không thể xóa. Vui lòng thử lại.');
                        }
                      }} className="refresh-btn" style={{ background: '#dc3545' }}>🗑️ Xóa tất cả phần quà</button>
                      <button onClick={() => {
                        setEditingLuckyDrawReward(null);
                        setLuckyDrawRewardForm({ name: '', description: '', image: '', stock_quantity: 0, is_active: 1 });
                        setShowLuckyDrawRewardModal(true);
                      }} className="refresh-btn">➕ Thêm phần quà</button>
                    </div>
                  </div>

                  {/* Settings */}
                  <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '15px' }}>⚙️ Cài đặt</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                      <div>
                        <label>Tỷ lệ trúng thưởng (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={luckyDrawSettings.win_rate || 30}
                          onChange={async (e) => {
                            const newRate = parseFloat(e.target.value);
                            const token = getToken();
                            if (!token) return;
                            try {
                              await axios.put(`${API_URL}/api/admin/lucky-draw/settings`, 
                                { win_rate: newRate, is_active: luckyDrawSettings.is_active },
                                { headers: { 'x-admin-token': token } }
                              );
                              setLuckyDrawSettings({ ...luckyDrawSettings, win_rate: newRate });
                              alert('✅ Đã cập nhật tỷ lệ trúng thưởng!');
                            } catch (err) {
                              alert('Không thể cập nhật. Vui lòng thử lại.');
                            }
                          }}
                          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                      </div>
                      <div>
                        <label>Trạng thái</label>
                        <select
                          value={luckyDrawSettings.is_active || 1}
                          onChange={async (e) => {
                            const newIsActive = parseInt(e.target.value);
                            const token = getToken();
                            if (!token) return;
                            try {
                              await axios.put(`${API_URL}/api/admin/lucky-draw/settings`, 
                                { win_rate: luckyDrawSettings.win_rate || 30, is_active: newIsActive },
                                { headers: { 'x-admin-token': token } }
                              );
                              setLuckyDrawSettings({ ...luckyDrawSettings, is_active: newIsActive });
                              alert(`✅ Đã ${newIsActive === 1 ? 'bật' : 'tắt'} vòng quay may mắn!`);
                            } catch (err) {
                              alert('Không thể cập nhật. Vui lòng thử lại.');
                            }
                          }}
                          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        >
                          <option value={1}>✅ Hoạt động</option>
                          <option value={0}>❌ Tạm dừng</option>
                        </select>
                        <p style={{ marginTop: '5px', fontSize: '0.85rem', color: '#666' }}>
                          {luckyDrawSettings.is_active === 1 
                            ? 'Chương trình vòng quay may mắn đang hoạt động' 
                            : 'Chương trình vòng quay may mắn đang tạm dừng'}
                        </p>
                      </div>
                    </div>
                    {luckyDrawStats && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng người tham gia</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>{luckyDrawStats.total_participants || 0}</div>
                        </div>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>Số người trúng</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>{luckyDrawStats.total_winners || 0}</div>
                        </div>
                        <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>Số người không trúng</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>{luckyDrawStats.total_losers || 0}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rewards Management */}
                  <h3 style={{ marginBottom: '15px' }}>🎁 Danh sách phần quà</h3>
                  {luckyDrawRewards.length === 0 ? (
                    <div className="no-data">Chưa có phần quà nào</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Tên phần quà</th>
                          <th>Mô tả</th>
                          <th>Số lượng còn lại</th>
                          <th>Trạng thái</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {luckyDrawRewards.map((reward, index) => (
                          <tr key={reward.id}>
                            <td>{index + 1}</td>
                            <td><strong>{reward.name}</strong></td>
                            <td>{reward.description || '-'}</td>
                            <td>{reward.stock_quantity || 0}</td>
                            <td>{reward.is_active === 1 ? '✅ Hoạt động' : '❌ Tạm dừng'}</td>
                            <td>
                              <button onClick={() => {
                                setEditingLuckyDrawReward(reward);
                                setLuckyDrawRewardForm({
                                  name: reward.name || '',
                                  description: reward.description || '',
                                  image: reward.image || '',
                                  stock_quantity: reward.stock_quantity || 0,
                                  is_active: reward.is_active || 1
                                });
                                setShowLuckyDrawRewardModal(true);
                              }} style={{ marginRight: '5px', padding: '5px 10px', fontSize: '0.85rem' }}>✏️ Sửa</button>
                              <button onClick={async () => {
                                if (!window.confirm(`Bạn có chắc muốn xóa phần quà "${reward.name}"?`)) return;
                                const token = getToken();
                                if (!token) return;
                                try {
                                  await axios.delete(`${API_URL}/api/admin/lucky-draw/rewards/${reward.id}`, {
                                    headers: { 'x-admin-token': token }
                                  });
                                  setLuckyDrawRewards(luckyDrawRewards.filter(r => r.id !== reward.id));
                                  alert('✅ Đã xóa phần quà thành công!');
                                } catch (err) {
                                  alert('Không thể xóa. Vui lòng thử lại.');
                                }
                              }} style={{ padding: '5px 10px', fontSize: '0.85rem', background: '#dc3545', color: 'white' }}>🗑️ Xóa</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Participants List */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '15px' }}>
                    <h3>👥 Danh sách người tham gia ({luckyDrawParticipants.length})</h3>
                    <button 
                      onClick={fetchAllData} 
                      className="refresh-btn"
                      style={{ padding: '8px 15px', fontSize: '0.9rem' }}
                    >
                      🔄 Làm mới
                    </button>
                  </div>
                  {luckyDrawParticipants.length === 0 ? (
                    <div className="no-data">Chưa có người tham gia nào</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Email</th>
                          <th>Số điện thoại</th>
                          <th>Kết quả</th>
                          <th>Phần quà</th>
                          <th>Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {luckyDrawParticipants.map((participant, index) => (
                          <tr key={participant.id}>
                            <td>{index + 1}</td>
                            <td><a href={`mailto:${participant.email}`}>{participant.email}</a></td>
                            <td>{participant.phone}</td>
                            <td>{participant.won === 1 ? <span style={{ color: '#28a745', fontWeight: 'bold' }}>🎉 Trúng</span> : <span style={{ color: '#666' }}>❌ Không trúng</span>}</td>
                            <td>{participant.reward_name || '-'}</td>
                            <td>{formatDate(participant.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Reward Modal */}
                {showLuckyDrawRewardModal && (
                  <div className="modal-overlay" onClick={() => setShowLuckyDrawRewardModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>{editingLuckyDrawReward ? 'Sửa phần quà' : 'Thêm phần quà mới'}</h2>
                        <button onClick={() => setShowLuckyDrawRewardModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
                      </div>
                      
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const token = getToken();
                        if (!token) return;
                        try {
                          if (editingLuckyDrawReward) {
                            await axios.put(`${API_URL}/api/admin/lucky-draw/rewards/${editingLuckyDrawReward.id}`, luckyDrawRewardForm, {
                              headers: { 'x-admin-token': token }
                            });
                            alert('✅ Đã cập nhật phần quà thành công!');
                          } else {
                            await axios.post(`${API_URL}/api/admin/lucky-draw/rewards`, luckyDrawRewardForm, {
                              headers: { 'x-admin-token': token }
                            });
                            alert('✅ Đã thêm phần quà thành công!');
                          }
                          setShowLuckyDrawRewardModal(false);
                          fetchAllData();
                        } catch (err) {
                          console.error('Error saving reward:', err);
                          const errorMessage = err.response?.data?.error || err.message || 'Không thể lưu. Vui lòng thử lại.';
                          alert(`❌ Lỗi: ${errorMessage}`);
                        }
                      }}>
                        <div style={{ marginBottom: '15px' }}>
                          <label>Tên phần quà *</label>
                          <input
                            type="text"
                            value={luckyDrawRewardForm.name}
                            onChange={(e) => setLuckyDrawRewardForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            placeholder="Gấu bông"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label>Mô tả</label>
                          <textarea
                            value={luckyDrawRewardForm.description}
                            onChange={(e) => setLuckyDrawRewardForm(prev => ({ ...prev, description: e.target.value }))}
                            rows="3"
                            placeholder="Mô tả về phần quà..."
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <label>URL ảnh</label>
                          <input
                            type="url"
                            value={luckyDrawRewardForm.image}
                            onChange={(e) => setLuckyDrawRewardForm(prev => ({ ...prev, image: e.target.value }))}
                            placeholder="https://example.com/image.jpg"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                          <div>
                            <label>Số lượng</label>
                            <input
                              type="number"
                              min="0"
                              value={luckyDrawRewardForm.stock_quantity}
                              onChange={(e) => setLuckyDrawRewardForm(prev => ({ ...prev, stock_quantity: parseInt(e.target.value) || 0 }))}
                              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            />
                          </div>
                          <div>
                            <label>Trạng thái</label>
                            <select
                              value={luckyDrawRewardForm.is_active}
                              onChange={(e) => setLuckyDrawRewardForm(prev => ({ ...prev, is_active: parseInt(e.target.value) }))}
                              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            >
                              <option value={1}>Hoạt động</option>
                              <option value={0}>Tạm dừng</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setShowLuckyDrawRewardModal(false)} style={{ padding: '10px 20px', background: '#f0f0f0' }}>Hủy</button>
                          <button type="submit" style={{ padding: '10px 20px', background: '#667eea', color: 'white' }}>Lưu</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className="admin-stats">
          <div className="stat-card">
            <h3>👁️ Truy cập</h3>
            <p className="stat-number">{visits.length}</p>
            <p className="stat-subtitle">Tổng lượt truy cập</p>
          </div>
          <div className="stat-card">
            <h3>📞 Liên hệ</h3>
            <p className="stat-number">{contacts.length}</p>
          </div>
          <div className="stat-card">
            <h3>📧 Newsletter</h3>
            <p className="stat-number">{newsletter.length}</p>
          </div>
          <div className="stat-card">
            <h3>📅 Sự kiện</h3>
            <p className="stat-number">{events.length}</p>
          </div>
          <div className="stat-card">
            <h3>💼 Tuyển dụng</h3>
            <p className="stat-number">{recruitment.length}</p>
          </div>
          <div className="stat-card">
            <h3>📥 Tài liệu</h3>
            <p className="stat-number">{resources.length}</p>
          </div>
          <div className="stat-card">
            <h3>🎓 Tư vấn</h3>
            <p className="stat-number">{consultations.length}</p>
          </div>
          <div className="stat-card">
            <h3>📅 Đặt lịch</h3>
            <p className="stat-number">{bookings.length}</p>
          </div>
          <div className="stat-card total">
            <h3>Tổng cộng</h3>
            <p className="stat-number">{contacts.length + consultations.length + bookings.length + newsletter.length + events.length + recruitment.length + resources.length}</p>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>{editingEvent ? 'Sửa sự kiện' : 'Tạo sự kiện mới'}</h2>
              <button onClick={() => setShowEventModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            
            <form onSubmit={handleSaveEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                    placeholder="Hội thảo du học Hàn Quốc 2025"
                  />
                </div>
                <div>
                  <label>Loại sự kiện</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="Hội thảo">Hội thảo</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Sự kiện">Sự kiện</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Mô tả</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  placeholder="Mô tả về sự kiện..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label>Ngày *</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label>Giờ *</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                    required
                    placeholder="14:00 - 17:00"
                  />
                </div>
                <div>
                  <label>Sức chứa</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                    min="1"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Địa điểm *</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                  required
                  placeholder="Văn phòng Du học An Nhiên..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label>Trạng thái</label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="upcoming">Sắp tới</option>
                    <option value="past">Đã qua</option>
                  </select>
                </div>
                <div>
                  <label>URL ảnh</label>
                  <input
                    type="url"
                    value={eventForm.image}
                    onChange={(e) => setEventForm(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Chương trình (Agenda)</label>
                {eventForm.agenda.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateAgendaItem(index, e.target.value)}
                      placeholder={`Mục ${index + 1}: 14:00 - 14:30: Nội dung...`}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => removeAgendaItem(index)} style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Xóa
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addAgendaItem} style={{ padding: '8px 15px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  + Thêm mục chương trình
                </button>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Diễn giả (Speakers)</label>
                {eventForm.speakers.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateSpeaker(index, e.target.value)}
                      placeholder={`Diễn giả ${index + 1}`}
                      style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => removeSpeaker(index)} style={{ padding: '5px 10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Xóa
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addSpeaker} style={{ padding: '8px 15px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  + Thêm diễn giả
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowEventModal(false)} style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Hủy
                </button>
                <button type="submit" style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {editingEvent ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
