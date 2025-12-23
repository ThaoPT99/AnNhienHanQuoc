import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import './Resources.css';

const Resources = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Tài liệu miễn phí du học Hàn Quốc - Du học An Nhiên",
    "description": "Tải miễn phí các tài liệu hữu ích về du học Hàn Quốc: checklist hồ sơ, hướng dẫn xin visa, template thư xin việc, và nhiều tài liệu khác",
    "url": "https://duhocannhien.vercel.app/resources"
  };

  const resources = [
    {
      id: 1,
      title: 'Checklist hồ sơ du học Hàn Quốc',
      description: 'Danh sách đầy đủ các giấy tờ cần chuẩn bị cho hồ sơ du học Hàn Quốc. Bao gồm tất cả các bước từ A-Z.',
      icon: '📋',
      category: 'Hồ sơ',
      format: 'PDF',
      size: '2.5 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 2,
      title: 'Hướng dẫn xin visa D-2 chi tiết',
      description: 'Hướng dẫn từng bước xin visa du học Hàn Quốc. Bao gồm các mẫu đơn, cách điền form và lưu ý quan trọng.',
      icon: '📝',
      category: 'Visa',
      format: 'PDF',
      size: '3.2 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 3,
      title: 'Template thư giới thiệu bản thân',
      description: 'Mẫu thư giới thiệu bản thân bằng tiếng Hàn và tiếng Anh. Có thể tùy chỉnh theo hoàn cảnh của bạn.',
      icon: '✉️',
      category: 'Hồ sơ',
      format: 'DOCX',
      size: '150 KB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 4,
      title: 'Kế hoạch học tập mẫu',
      description: 'Mẫu kế hoạch học tập (Study Plan) chuyên nghiệp. Bao gồm các phần quan trọng cần có trong kế hoạch học tập.',
      icon: '📚',
      category: 'Hồ sơ',
      format: 'DOCX',
      size: '180 KB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 5,
      title: 'Danh sách trường đại học Hàn Quốc',
      description: 'Danh sách đầy đủ các trường đại học Hàn Quốc với thông tin về học phí, ranking, ngành học và yêu cầu đầu vào.',
      icon: '🏫',
      category: 'Thông tin',
      format: 'PDF',
      size: '4.8 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 6,
      title: 'Hướng dẫn luyện thi TOPIK',
      description: 'Tài liệu hướng dẫn luyện thi TOPIK từ cơ bản đến nâng cao. Bao gồm tips, chiến lược và tài liệu tham khảo.',
      icon: '📖',
      category: 'TOPIK',
      format: 'PDF',
      size: '5.5 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 7,
      title: 'Từ vựng tiếng Hàn du học sinh',
      description: 'Danh sách từ vựng tiếng Hàn cần thiết cho du học sinh. Bao gồm từ vựng về trường học, cuộc sống hàng ngày.',
      icon: '💬',
      category: 'TOPIK',
      format: 'PDF',
      size: '1.8 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 8,
      title: 'Hướng dẫn tìm nhà ở tại Hàn Quốc',
      description: 'Hướng dẫn chi tiết về các loại nhà ở, cách tìm nhà, giá cả và các lưu ý khi thuê nhà tại Hàn Quốc.',
      icon: '🏠',
      category: 'Cuộc sống',
      format: 'PDF',
      size: '2.2 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 9,
      title: 'Checklist chuẩn bị lên đường',
      description: 'Danh sách những thứ cần chuẩn bị trước khi lên đường du học Hàn Quốc. Từ giấy tờ đến đồ dùng cá nhân.',
      icon: '✈️',
      category: 'Cuộc sống',
      format: 'PDF',
      size: '1.5 MB',
      downloadUrl: '#',
      preview: true
    },
    {
      id: 10,
      title: 'Hướng dẫn làm thêm tại Hàn Quốc',
      description: 'Thông tin về quy định làm thêm, các công việc phổ biến, mức lương và cách tìm việc làm thêm.',
      icon: '💼',
      category: 'Cuộc sống',
      format: 'PDF',
      size: '2.8 MB',
      downloadUrl: '#',
      preview: true
    }
  ];

  const categories = ['Tất cả', 'Hồ sơ', 'Visa', 'TOPIK', 'Thông tin', 'Cuộc sống'];
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const filteredResources = selectedCategory === 'Tất cả'
    ? resources
    : resources.filter(r => r.category === selectedCategory);

  const handleDownload = async (resource) => {
    if (!submitted) {
      setSelectedResource(resource);
      return;
    }

    // Gửi thông tin download lên backend
    const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
    
    try {
      const response = await fetch(`${API_URL}/api/resources/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          resource_id: resource.id,
          resource_title: resource.title
        }),
      });

      if (response.ok) {
        // Check if response is a file (blob) or JSON
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          // Error response
          const error = await response.json();
          alert(`Có lỗi xảy ra: ${error.error || error.message || 'Vui lòng thử lại sau.'}`);
        } else {
          // File download
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          
          // Get filename from Content-Disposition header or use resource title
          const contentDisposition = response.headers.get('content-disposition');
          let filename = resource.title;
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
            }
          }
          
          // Add file extension if not present
          if (!filename.includes('.')) {
            filename += resource.format === 'PDF' ? '.pdf' : '.docx';
          }
          
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Reset form
          setEmail('');
          setSubmitted(false);
          setSelectedResource(null);
        }
      } else {
        const error = await response.json();
        alert(`Có lỗi xảy ra: ${error.error || error.message || 'Vui lòng thử lại sau.'}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubmitted(true);
      if (selectedResource) {
        handleDownload(selectedResource);
      }
    } else {
      alert('Vui lòng nhập email hợp lệ');
    }
  };

  return (
    <div className="resources-page">
      <SEO
        title="Tài liệu miễn phí du học Hàn Quốc - Du học An Nhiên"
        description="Tải miễn phí các tài liệu hữu ích về du học Hàn Quốc: checklist hồ sơ, hướng dẫn xin visa, template thư xin việc, và nhiều tài liệu khác"
        keywords="tài liệu du học Hàn Quốc, download tài liệu du học, checklist hồ sơ du học, hướng dẫn visa Hàn Quốc, template du học"
        url="https://duhocannhien.vercel.app/resources"
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
            <span className="title-icon">📥</span>
            Tài liệu miễn phí
          </h1>
          <p className="page-subtitle">
            Tải miễn phí các tài liệu hữu ích về du học Hàn Quốc
          </p>
        </motion.div>
      </div>

      <div className="resources-content">
        {!submitted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="email-form-section"
          >
            <div className="email-form-card">
              <h3>📧 Nhận tài liệu miễn phí</h3>
              <p>Để tải tài liệu, vui lòng cung cấp email của bạn. Chúng tôi sẽ gửi link download qua email.</p>
              <form onSubmit={handleEmailSubmit} className="email-form">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-input"
                />
                <button type="submit" className="submit-email-btn">
                  Xác nhận
                </button>
              </form>
            </div>
          </motion.div>
        )}

        <div className="categories-section">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="resources-grid">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="resource-card"
            >
              <div className="resource-icon">{resource.icon}</div>
              <div className="resource-category">{resource.category}</div>
              <h3 className="resource-title">{resource.title}</h3>
              <p className="resource-description">{resource.description}</p>
              <div className="resource-meta">
                <span className="resource-format">{resource.format}</span>
                <span className="resource-size">{resource.size}</span>
              </div>
              <button
                className="download-btn"
                onClick={() => handleDownload(resource)}
              >
                <span>⬇️</span>
                Tải xuống
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;

