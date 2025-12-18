import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './ConsultationForm.css';

const ConsultationForm = ({ isOpen, onClose, triggerSource = 'general' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    currentGrade: '',
    interestedMajor: '',
    interestedCity: '',
    budget: '',
    topikLevel: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_URL}/api/consultation/register`, {
        ...formData,
        triggerSource,
        submittedAt: new Date().toISOString()
      });

      if (response.data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          phone: '',
          email: '',
          currentGrade: '',
          interestedMajor: '',
          interestedCity: '',
          budget: '',
          topikLevel: '',
          message: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting consultation form:', error);
      if (error.response) {
        // Server responded with error status
        console.error('Server error:', error.response.data);
        setSubmitStatus('error');
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        setSubmitStatus('error');
      } else {
        // Something else happened
        console.error('Error:', error.message);
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="consultation-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="consultation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-consultation-btn" onClick={onClose}>×</button>
            
            <div className="consultation-header">
              <h2>🎓 Đăng ký tư vấn miễn phí</h2>
              <p>Điền thông tin để nhận tư vấn chi tiết về du học Hàn Quốc</p>
            </div>

            {submitStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="consultation-success"
              >
                <div className="success-icon">✅</div>
                <h3>Cảm ơn bạn đã đăng ký!</h3>
                <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="consultation-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="currentGrade">Lớp hiện tại / Trình độ</label>
                    <select
                      id="currentGrade"
                      name="currentGrade"
                      value={formData.currentGrade}
                      onChange={handleChange}
                    >
                      <option value="">Chọn trình độ</option>
                      <option value="Lớp 10">Lớp 10</option>
                      <option value="Lớp 11">Lớp 11</option>
                      <option value="Lớp 12">Lớp 12</option>
                      <option value="Đã tốt nghiệp THPT">Đã tốt nghiệp THPT</option>
                      <option value="Sinh viên">Sinh viên</option>
                      <option value="Đã tốt nghiệp ĐH">Đã tốt nghiệp ĐH</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="interestedMajor">Ngành học quan tâm</label>
                    <select
                      id="interestedMajor"
                      name="interestedMajor"
                      value={formData.interestedMajor}
                      onChange={handleChange}
                    >
                      <option value="">Chọn ngành học</option>
                      <option value="Kinh tế">Kinh tế</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Y tế">Y tế</option>
                      <option value="Nghệ thuật">Nghệ thuật</option>
                      <option value="Nhân văn">Nhân văn</option>
                      <option value="Luật">Luật</option>
                      <option value="Khoa học">Khoa học</option>
                      <option value="Ngôn ngữ">Ngôn ngữ</option>
                      <option value="Truyền thông">Truyền thông</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="interestedCity">Thành phố quan tâm</label>
                    <select
                      id="interestedCity"
                      name="interestedCity"
                      value={formData.interestedCity}
                      onChange={handleChange}
                    >
                      <option value="">Chọn thành phố</option>
                      <option value="Seoul">Seoul</option>
                      <option value="Busan">Busan</option>
                      <option value="Incheon">Incheon</option>
                      <option value="Daegu">Daegu</option>
                      <option value="Daejeon">Daejeon</option>
                      <option value="Gwangju">Gwangju</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget">Ngân sách dự kiến</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Chọn ngân sách</option>
                      <option value="Dưới 200 triệu/năm">Dưới 200 triệu/năm</option>
                      <option value="200-300 triệu/năm">200-300 triệu/năm</option>
                      <option value="300-400 triệu/năm">300-400 triệu/năm</option>
                      <option value="Trên 400 triệu/năm">Trên 400 triệu/năm</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="topikLevel">Trình độ TOPIK hiện tại</label>
                    <select
                      id="topikLevel"
                      name="topikLevel"
                      value={formData.topikLevel}
                      onChange={handleChange}
                    >
                      <option value="">Chọn trình độ</option>
                      <option value="Chưa có">Chưa có</option>
                      <option value="TOPIK 1">TOPIK 1</option>
                      <option value="TOPIK 2">TOPIK 2</option>
                      <option value="TOPIK 3">TOPIK 3</option>
                      <option value="TOPIK 4">TOPIK 4</option>
                      <option value="TOPIK 5">TOPIK 5</option>
                      <option value="TOPIK 6">TOPIK 6</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Câu hỏi hoặc yêu cầu khác</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Nhập câu hỏi hoặc yêu cầu của bạn..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="form-error">
                    Có lỗi xảy ra. Vui lòng thử lại sau.
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" onClick={onClose} className="cancel-btn">
                    Hủy
                  </button>
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsultationForm;

