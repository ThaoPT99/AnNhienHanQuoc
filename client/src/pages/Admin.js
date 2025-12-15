import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  // Use env if set; fallback to deployed backend to avoid localhost in production
  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/contacts`);
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối server.');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
      try {
        await axios.delete(`${API_URL}/api/contacts/${id}`);
        setContacts(contacts.filter(contact => contact.id !== id));
      } catch (err) {
        alert('Không thể xóa liên hệ. Vui lòng thử lại.');
        console.error('Error deleting contact:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý thông tin liên hệ</h1>
        <button onClick={fetchContacts} className="refresh-btn">🔄 Làm mới</button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="no-data">Chưa có thông tin liên hệ nào</div>
        ) : (
          <div className="contacts-table-wrapper">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Tin nhắn</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.id}</td>
                    <td>{contact.name}</td>
                    <td>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </td>
                    <td>
                      <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                    </td>
                    <td className="message-cell">
                      {contact.message || <em>Không có</em>}
                    </td>
                    <td>{formatDate(contact.created_at)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="delete-btn"
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Tổng số liên hệ</h3>
            <p className="stat-number">{contacts.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

