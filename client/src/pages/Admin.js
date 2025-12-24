import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

      const [contactsRes, newsletterRes, eventsRes, recruitmentRes, resourcesRes, consultationsRes, bookingsRes, visitsRes, statsRes, communityRes, eventListRes] = await Promise.all([
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
        axios.get(`${API_URL}/api/events/list`, { headers }).catch(() => ({ data: [] }))
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { id: 'contacts', label: '📞 Liên hệ', count: contacts.length, icon: '💬' },
    { id: 'consultations', label: '🎓 Tư vấn', count: consultations.length, icon: '💬' },
    { id: 'bookings', label: '📅 Đặt lịch', count: bookings.length, icon: '📆' },
    { id: 'visits', label: '👁️ Truy cập', count: visits.length, icon: '🌐' },
    { id: 'community', label: '💬 Cộng đồng', count: communityPosts.length, icon: '👥' },
    { id: 'newsletter', label: '📧 Newsletter', count: newsletter.length, icon: '📨' },
    { id: 'events', label: '📅 Sự kiện', count: events.length, icon: '🎉' },
    { id: 'recruitment', label: '💼 Tuyển dụng', count: recruitment.length, icon: '👔' },
    { id: 'resources', label: '📥 Tài liệu', count: resources.length, icon: '📚' }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'contacts': return contacts;
      case 'consultations': return consultations;
      case 'bookings': return bookings;
      case 'visits': return visits;
      case 'community': return communityPosts;
      case 'newsletter': return newsletter;
      case 'events': return events;
      case 'recruitment': return recruitment;
      case 'resources': return resources;
      default: return [];
    }
  };

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
                          <td>{item.resource_title || `Tài liệu #${item.resource_id}`}</td>
                          <td>#{item.resource_id}</td>
                          <td>{formatDate(item.downloaded_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
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
