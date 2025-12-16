import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', url: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const load = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin-login');
        return;
      }
      const res = await axios.get(`${API_URL}/api/gallery`, {
        headers: { 'x-admin-token': token },
      });
      setItems(res.data || []);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc đăng nhập lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/gallery/${editingId}`, form, {
          headers: { 'x-admin-token': token },
        });
      } else {
        await axios.post(`${API_URL}/api/gallery`, form, {
          headers: { 'x-admin-token': token },
        });
      }
      setForm({ title: '', url: '', category: '' });
      setEditingId(null);
      load();
    } catch (err) {
      alert('Lưu thất bại. Vui lòng thử lại.');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, url: item.url, category: item.category });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa ảnh này?')) return;
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/gallery/${id}`, {
        headers: { 'x-admin-token': token },
      });
      load();
    } catch (err) {
      alert('Xóa thất bại. Vui lòng thử lại.');
      console.error(err);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Quản lý thư viện ảnh</h1>
        <div className="admin-actions">
          <button className="refresh-btn" onClick={load}>🔄 Làm mới</button>
          <button className="refresh-btn" onClick={() => navigate('/admin')}>⬅ Quay về Admin</button>
        </div>
      </div>

      <div className="admin-content">
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Cập nhật ảnh' : 'Thêm ảnh mới'}</h2>
          <div className="form-group">
            <label>Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>URL ảnh</label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              required
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Danh mục</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="VD: Trường học, Cảnh đẹp..."
            />
          </div>
          <button type="submit" className="refresh-btn">
            {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
          </button>
          {editingId && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ title: '', url: '', category: '' });
              }}
            >
              Hủy chỉnh sửa
            </button>
          )}
        </form>

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : items.length === 0 ? (
          <div className="no-data">Chưa có ảnh nào.</div>
        ) : (
          <div className="contacts-table-wrapper">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Danh mục</th>
                  <th>URL</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>
                      <a href={item.url} target="_blank" rel="noreferrer">Xem ảnh</a>
                    </td>
                    <td>
                      <button className="refresh-btn" onClick={() => handleEdit(item)}>Sửa</button>
                      <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️ Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;


