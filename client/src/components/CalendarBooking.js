import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './CalendarBooking.css';

const CalendarBooking = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredMethod: 'zoom', // zoom, google-meet, phone
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends if needed, or make all days available
      dates.push(date);
    }
    return dates;
  };

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const availableDates = generateAvailableDates();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Vui lòng chọn ngày và giờ tư vấn');
      return;
    }

    if (!formData.name || !formData.phone || !formData.email) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const bookingData = {
        ...formData,
        date: selectedDate.toISOString(),
        time: selectedTime,
        formattedDate: formatDate(selectedDate),
        createdAt: new Date().toISOString()
      };

      const response = await axios.post(`${API_URL}/api/consultation/book`, bookingData);

      if (response.data.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          preferredMethod: 'zoom',
          notes: ''
        });
        setSelectedDate(null);
        setSelectedTime(null);
        
        // Close after 3 seconds
        setTimeout(() => {
          onClose();
          setSubmitStatus(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      setSubmitStatus('error');
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
          className="calendar-booking-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="calendar-booking-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-calendar-btn" onClick={onClose}>×</button>

            <div className="calendar-booking-header">
              <h2>📅 Đặt lịch tư vấn trực tuyến</h2>
              <p>Chọn ngày và giờ phù hợp với bạn. Chúng tôi sẽ gửi link Zoom/Google Meet qua email.</p>
            </div>

            {submitStatus === 'success' ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="booking-success"
              >
                <div className="success-icon">✅</div>
                <h3>Đặt lịch thành công!</h3>
                <p>Chúng tôi đã ghi nhận lịch tư vấn của bạn.</p>
                <p className="success-details">
                  <strong>Ngày:</strong> {selectedDate && formatDate(selectedDate)}<br />
                  <strong>Giờ:</strong> {selectedTime}
                </p>
                <p className="success-note">Link tư vấn sẽ được gửi qua email trước 1 giờ.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="calendar-booking-form">
                {/* Date Selection */}
                <div className="form-section">
                  <label className="form-label">📆 Chọn ngày</label>
                  <div className="date-grid">
                    {availableDates.map((date, index) => {
                      const isSelected = selectedDate && 
                        date.toDateString() === selectedDate.toDateString();
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <button
                          key={index}
                          type="button"
                          className={`date-option ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                          onClick={() => handleDateSelect(date)}
                        >
                          <div className="date-day">{formatDateShort(date).split('/')[0]}</div>
                          <div className="date-month">{formatDateShort(date).split('/')[1]}</div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedDate && (
                    <div className="selected-date-display">
                      Bạn đã chọn: <strong>{formatDate(selectedDate)}</strong>
                    </div>
                  )}
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="form-section"
                  >
                    <label className="form-label">⏰ Chọn giờ</label>
                    <div className="time-grid">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Contact Information */}
                <div className="form-section">
                  <label className="form-label">📝 Thông tin liên hệ</label>
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên *"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại *"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Preferred Method */}
                <div className="form-section">
                  <label className="form-label">💻 Phương thức tư vấn</label>
                  <div className="method-options">
                    <label className="method-option">
                      <input
                        type="radio"
                        name="preferredMethod"
                        value="zoom"
                        checked={formData.preferredMethod === 'zoom'}
                        onChange={handleChange}
                      />
                      <span>Zoom</span>
                    </label>
                    <label className="method-option">
                      <input
                        type="radio"
                        name="preferredMethod"
                        value="google-meet"
                        checked={formData.preferredMethod === 'google-meet'}
                        onChange={handleChange}
                      />
                      <span>Google Meet</span>
                    </label>
                    <label className="method-option">
                      <input
                        type="radio"
                        name="preferredMethod"
                        value="phone"
                        checked={formData.preferredMethod === 'phone'}
                        onChange={handleChange}
                      />
                      <span>Điện thoại</span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="form-section">
                  <label className="form-label">📋 Ghi chú (tùy chọn)</label>
                  <textarea
                    name="notes"
                    placeholder="Bạn muốn tư vấn về vấn đề gì? (ví dụ: chọn trường, học bổng, visa...)"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="submit-booking-btn"
                  disabled={isSubmitting || !selectedDate || !selectedTime}
                >
                  {isSubmitting ? 'Đang xử lý...' : '✅ Xác nhận đặt lịch'}
                </button>

                {submitStatus === 'error' && (
                  <div className="error-message">
                    ❌ Có lỗi xảy ra. Vui lòng thử lại sau.
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendarBooking;

