import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', url: '', category: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File quá lớn. Kích thước tối đa là 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    try {
      setUploading(true);

      if (editingId) {
        // Update existing image (metadata only)
        await axios.patch(`${API_URL}/api/gallery/${editingId}`, form, {
          headers: { 'x-admin-token': token },
        });
      } else {
        // Upload new image
        if (!selectedFile && !form.url) {
          alert('Vui lòng chọn file ảnh hoặc nhập URL ảnh');
          setUploading(false);
          return;
        }

        if (selectedFile) {
          // Upload file
          const formData = new FormData();
          formData.append('image', selectedFile);
          formData.append('title', form.title);
          formData.append('category', form.category || 'Khác');
          formData.append('description', form.description || '');

          await axios.post(`${API_URL}/api/gallery`, formData, {
            headers: {
              'x-admin-token': token,
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          // Use URL (for backward compatibility)
          await axios.post(`${API_URL}/api/gallery`, {
            title: form.title,
            url: form.url,
            category: form.category || 'Khác',
            description: form.description || '',
          }, {
            headers: { 'x-admin-token': token },
          });
        }
      }

      // Reset form
      setForm({ title: '', url: '', category: '', description: '' });
      setEditingId(null);
      setSelectedFile(null);
      setPreview(null);
      document.getElementById('image-input')?.value && (document.getElementById('image-input').value = '');
      
      load();
    } catch (err) {
      alert('Lưu thất bại. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ 
      title: item.title || '', 
      url: item.url || '', 
      category: item.category || 'Khác',
      description: item.description || ''
    });
    setEditingId(item.id);
    setSelectedFile(null);
    setPreview(item.url);
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
          
          {!editingId && (
            <div className="form-group">
              <label>Chọn ảnh (hoặc nhập URL bên dưới)</label>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          )}

          {!selectedFile && !editingId && (
            <div className="form-group">
              <label>Hoặc nhập URL ảnh</label>
              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          )}

          <div className="form-group">
            <label>Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Nhập tiêu đề ảnh"
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
              placeholder="VD: Trường học, Cảnh đẹp, Sinh viên..."
            />
          </div>

          <div className="form-group">
            <label>Mô tả (tùy chọn)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Nhập mô tả cho ảnh..."
            />
          </div>

          <button type="submit" className="refresh-btn" disabled={uploading}>
            {uploading ? 'Đang tải lên...' : (editingId ? 'Lưu thay đổi' : 'Thêm mới')}
          </button>
          
          {editingId && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ title: '', url: '', category: '', description: '' });
                setPreview(null);
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
                    <td>{item.title || '(Không có tiêu đề)'}</td>
                    <td>{item.category || 'Khác'}</td>
                    <td>
                      <a href={item.url} target="_blank" rel="noreferrer">
                        <img 
                          src={item.url} 
                          alt={item.title || 'Gallery image'} 
                          style={{ maxWidth: '100px', maxHeight: '60px', objectFit: 'cover', borderRadius: '4px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span style={{ display: 'none' }}>Xem ảnh</span>
                      </a>
                    </td>
                    <td>
                      <button className="refresh-btn" onClick={() => handleEdit(item)}>✏️ Sửa</button>
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


