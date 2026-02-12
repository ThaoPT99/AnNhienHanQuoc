import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';
import { getPoints, syncPointsToServer } from '../utils/pointsSystem';
import './Redemption.css';

const Redemption = () => {
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    preferred_date: '',
    preferred_time: '',
    preferred_method: 'zoom',
    notes: ''
  });
  const [reviewForm, setReviewForm] = useState({
    document_url: '',
    document_name: '',
    user_notes: ''
  });
  const [visaForm, setVisaForm] = useState({
    current_status: '',
    questions: '',
    documents_uploaded: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  useEffect(() => {
    loadRewards();
    loadUserPoints();
    loadUserEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, rewards]);

  useEffect(() => {
    const handlePointsUpdate = (event) => {
      setUserPoints(event.detail.newPoints);
    };
    window.addEventListener('pointsUpdated', handlePointsUpdate);
    return () => window.removeEventListener('pointsUpdated', handlePointsUpdate);
  }, []);

  const loadRewards = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rewards`);
      setRewards(response.data);
      setFilteredRewards(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading rewards:', error);
      setLoading(false);
    }
  };

  const loadUserPoints = () => {
    const points = getPoints();
    setUserPoints(points);
  };

  const loadUserEmail = () => {
    const email = localStorage.getItem('userEmail') || '';
    const phone = localStorage.getItem('userPhone') || '';
    setUserEmail(email);
    setUserPhone(phone);
  };

  const loadRedemptionHistory = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/api/rewards/redemptions/${email}`);
      setRedemptionHistory(response.data);
    } catch (error) {
      console.error('Error loading redemption history:', error);
    }
  };

  const filterRewards = () => {
    if (selectedCategory === 'all') {
      setFilteredRewards(rewards);
    } else {
      setFilteredRewards(rewards.filter(r => r.category === selectedCategory));
    }
  };

  const handleRedeem = async (reward) => {
    if (userPoints < reward.points_required) {
      alert(`Bạn cần ${reward.points_required} điểm để đổi phần thưởng này. Bạn hiện có ${userPoints} điểm.`);
      return;
    }

    // Check if user has email and phone
    if (!userEmail || !userPhone) {
      setSelectedReward(reward);
      setShowEmailModal(true);
      return;
    }

    // For Phase 2 rewards (service), show form modal
    if (reward.category === 'service' && reward.type === 'service') {
      setSelectedReward(reward);
      
      // Determine which modal to show
      if (reward.value && reward.value.includes('CONSULTATION')) {
        setShowServiceModal(true);
      } else if (reward.value && reward.value.includes('REVIEW')) {
        setShowReviewModal(true);
      } else if (reward.value && reward.value.includes('VISA')) {
        setShowVisaModal(true);
      } else {
        // Fallback to service modal
        setShowServiceModal(true);
      }
      return;
    }

    // For Phase 1 rewards, proceed directly
    if (!window.confirm(`Bạn có chắc muốn đổi "${reward.name}" với ${reward.points_required} điểm?`)) {
      return;
    }

    await processRedemption(reward, userEmail);
  };

  const processRedemption = async (reward, email, additionalData = {}) => {
    setRedeeming(reward.id);

    try {
      const requestData = {
        user_email: email,
        reward_id: reward.id
      };

      // Add Phase 2 data if available
      if (reward.category === 'service' && reward.type === 'service') {
        if (reward.value && reward.value.includes('CONSULTATION')) {
          requestData.service_data = additionalData.service_data || serviceForm;
        } else if (reward.value && reward.value.includes('REVIEW')) {
          requestData.review_data = additionalData.review_data || reviewForm;
        } else if (reward.value && reward.value.includes('VISA')) {
          requestData.visa_data = additionalData.visa_data || visaForm;
        }
      }

      const response = await axios.post(`${API_URL}/api/rewards/redeem`, requestData);

      if (response.data.success) {
        // Deduct points
        const currentPoints = getPoints();
        const newPoints = currentPoints - reward.points_required;
        localStorage.setItem('userPoints', newPoints.toString());
        
        // Sync to server
        syncPointsToServer(newPoints, Math.floor(newPoints / 500) + 1);
        
        // Trigger points update event
        window.dispatchEvent(new CustomEvent('pointsUpdated', {
          detail: {
            newPoints,
            pointsAdded: -reward.points_required
          }
        }));

        setUserPoints(newPoints);
        
        // Show success message
        alert(response.data.message || `✅ Đổi phần thưởng thành công!\n\nMã đổi thưởng: ${response.data.redemption.redemption_code}\n\nVui lòng lưu mã này và liên hệ với chúng tôi để nhận phần thưởng.`);
        
        // Close modals
        setShowServiceModal(false);
        setShowReviewModal(false);
        setShowVisaModal(false);
        setSelectedReward(null);
        
        // Reset forms
        setServiceForm({ preferred_date: '', preferred_time: '', preferred_method: 'zoom', notes: '' });
        setReviewForm({ document_url: '', document_name: '', user_notes: '' });
        setVisaForm({ current_status: '', questions: '', documents_uploaded: '' });
        
        // Reload redemption history
        loadRedemptionHistory(email);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`❌ ${error.response.data.error}`);
      } else {
        alert('Có lỗi xảy ra khi đổi phần thưởng. Vui lòng thử lại.');
      }
    } finally {
      setRedeeming(null);
    }
  };

  const handleServiceSubmit = () => {
    if (!serviceForm.preferred_date || !serviceForm.preferred_time) {
      alert('Vui lòng điền đầy đủ thông tin ngày và giờ mong muốn.');
      return;
    }
    processRedemption(selectedReward, userEmail, { service_data: serviceForm });
  };

  const handleReviewSubmit = () => {
    if (!reviewForm.document_url && !reviewForm.document_name) {
      alert('Vui lòng cung cấp link hoặc tên file hồ sơ.');
      return;
    }
    processRedemption(selectedReward, userEmail, { review_data: reviewForm });
  };

  const handleVisaSubmit = () => {
    if (!visaForm.questions && !visaForm.current_status) {
      alert('Vui lòng điền ít nhất một trong các thông tin: câu hỏi hoặc tình trạng hiện tại.');
      return;
    }
    processRedemption(selectedReward, userEmail, { visa_data: visaForm });
  };

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🎁' },
    { id: 'voucher', name: 'Voucher', icon: '💰' },
    { id: 'document', name: 'Tài liệu', icon: '📚' },
    { id: 'access', name: 'Quyền truy cập', icon: '🔓' },
    { id: 'service', name: 'Dịch vụ', icon: '🎯' }
  ];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : '🎁';
  };

  return (
    <div className="redemption-page">
      <SEO
        title="Đổi điểm thưởng - Du học An Nhiên"
        description="Đổi điểm thưởng lấy voucher, tài liệu độc quyền và quyền truy cập đặc biệt. Kiếm điểm và nhận phần thưởng ngay hôm nay!"
        keywords="đổi điểm thưởng, voucher, tài liệu, quyền truy cập, phần thưởng"
      />

      <div className="redemption-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="redemption-header"
        >
          <h1>💎 Đổi Điểm Thưởng</h1>
          <div className="points-display-header">
            <div className="points-number-large">{userPoints}</div>
            <div className="points-label-large">điểm</div>
          </div>
          <div className="header-actions">
            <button 
              className="btn-history"
              onClick={() => {
                if (userEmail) {
                  loadRedemptionHistory(userEmail);
                  setShowHistory(true);
                } else {
                  setShowEmailModal(true);
                }
              }}
            >
              📜 Lịch sử đổi thưởng
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="category-filter"
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Rewards Grid */}
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : filteredRewards.length === 0 ? (
          <div className="no-rewards">Không có phần thưởng nào trong danh mục này.</div>
        ) : (
          <div className="rewards-grid">
            {filteredRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`reward-card ${userPoints < reward.points_required ? 'insufficient-points' : ''}`}
              >
                <div className="reward-icon">{getCategoryIcon(reward.category)}</div>
                <h3>{reward.name}</h3>
                <p className="reward-description">{reward.description}</p>
                <div className="reward-points">
                  <span className="points-required">{reward.points_required}</span>
                  <span className="points-label">điểm</span>
                </div>
                {userPoints < reward.points_required ? (
                  <div className="insufficient-message">
                    Cần thêm {reward.points_required - userPoints} điểm
                  </div>
                ) : (
                  <button
                    className="btn-redeem"
                    onClick={() => handleRedeem(reward)}
                    disabled={redeeming === reward.id}
                  >
                    {redeeming === reward.id ? 'Đang xử lý...' : 'Đổi ngay'}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Nhập thông tin để {selectedReward ? 'đổi phần thưởng' : 'xem lịch sử'}</h3>
            <input
              type="email"
              placeholder="Email của bạn *"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
            />
            <input
              type="tel"
              placeholder="Số điện thoại * (ví dụ: 0912345678)"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
              pattern="(\+84|0)[0-9]{9,10}"
              style={{ width: '100%', padding: '10px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userEmail && userPhone) {
                  const cleanPhone = userPhone.replace(/\s+/g, '');
                  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
                  if (phoneRegex.test(cleanPhone)) {
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userPhone', cleanPhone);
                    if (!selectedReward) {
                      loadRedemptionHistory(userEmail);
                      setShowHistory(true);
                    } else {
                      // If redeeming, continue with redemption
                      const reward = selectedReward;
                      setSelectedReward(null);
                      // For Phase 2 rewards (service), show form modal
                      if (reward.category === 'service' && reward.type === 'service') {
                        setSelectedReward(reward);
                        if (reward.value && reward.value.includes('CONSULTATION')) {
                          setShowServiceModal(true);
                        } else if (reward.value && reward.value.includes('REVIEW')) {
                          setShowReviewModal(true);
                        } else if (reward.value && reward.value.includes('VISA')) {
                          setShowVisaModal(true);
                        } else {
                          setShowServiceModal(true);
                        }
                      } else {
                        // For Phase 1 rewards, proceed directly
                        if (window.confirm(`Bạn có chắc muốn đổi "${reward.name}" với ${reward.points_required} điểm?`)) {
                          processRedemption(reward, userEmail);
                        }
                      }
                    }
                    setShowEmailModal(false);
                  } else {
                    alert('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0912345678)');
                  }
                }
              }}
            />
            <div className="modal-actions">
              <button onClick={() => {
                setShowEmailModal(false);
                setSelectedReward(null);
              }}>Hủy</button>
              <button
                onClick={() => {
                  if (!userEmail || !userPhone) {
                    alert('Vui lòng nhập đầy đủ email và số điện thoại!');
                    return;
                  }
                  const cleanPhone = userPhone.replace(/\s+/g, '');
                  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
                  if (!phoneRegex.test(cleanPhone)) {
                    alert('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0912345678)');
                    return;
                  }
                  localStorage.setItem('userEmail', userEmail);
                  localStorage.setItem('userPhone', cleanPhone);
                  const reward = selectedReward;
                  setShowEmailModal(false);
                  setSelectedReward(null);
                  
                  if (!reward) {
                    // View history
                    loadRedemptionHistory(userEmail);
                    setShowHistory(true);
                  } else {
                    // Continue with redemption
                    // For Phase 2 rewards (service), show form modal
                    if (reward.category === 'service' && reward.type === 'service') {
                      setSelectedReward(reward);
                      if (reward.value && reward.value.includes('CONSULTATION')) {
                        setShowServiceModal(true);
                      } else if (reward.value && reward.value.includes('REVIEW')) {
                        setShowReviewModal(true);
                      } else if (reward.value && reward.value.includes('VISA')) {
                        setShowVisaModal(true);
                      } else {
                        setShowServiceModal(true);
                      }
                    } else {
                      // For Phase 1 rewards, proceed directly
                      if (window.confirm(`Bạn có chắc muốn đổi "${reward.name}" với ${reward.points_required} điểm?`)) {
                        processRedemption(reward, userEmail);
                      }
                    }
                  }
                }}
                disabled={!userEmail || !userPhone}
              >
                {selectedReward ? 'Xác nhận' : 'Xem lịch sử'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email & Phone Modal - Updated */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => {
          setShowEmailModal(false);
          setSelectedReward(null);
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Nhập thông tin để {selectedReward ? 'đổi phần thưởng' : 'xem lịch sử'}</h3>
            <input
              type="email"
              placeholder="Email của bạn *"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
            />
            <input
              type="tel"
              placeholder="Số điện thoại * (ví dụ: 0912345678)"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
              pattern="(\+84|0)[0-9]{9,10}"
              style={{ width: '100%', padding: '10px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userEmail && userPhone) {
                  const cleanPhone = userPhone.replace(/\s+/g, '');
                  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
                  if (phoneRegex.test(cleanPhone)) {
                    localStorage.setItem('userEmail', userEmail);
                    localStorage.setItem('userPhone', cleanPhone);
                    if (!selectedReward) {
                      loadRedemptionHistory(userEmail);
                      setShowHistory(true);
                    } else {
                      // If redeeming, continue with redemption
                      handleRedeem(selectedReward);
                    }
                    setShowEmailModal(false);
                    setSelectedReward(null);
                  } else {
                    alert('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0912345678)');
                  }
                }
              }}
            />
            <div className="modal-actions">
              <button onClick={() => {
                setShowEmailModal(false);
                setSelectedReward(null);
              }}>Hủy</button>
              <button
                onClick={() => {
                  if (!userEmail || !userPhone) {
                    alert('Vui lòng nhập đầy đủ email và số điện thoại!');
                    return;
                  }
                  const cleanPhone = userPhone.replace(/\s+/g, '');
                  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
                  if (!phoneRegex.test(cleanPhone)) {
                    alert('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0912345678)');
                    return;
                  }
                  localStorage.setItem('userEmail', userEmail);
                  localStorage.setItem('userPhone', cleanPhone);
                  if (!selectedReward) {
                    loadRedemptionHistory(userEmail);
                    setShowHistory(true);
                  } else {
                    // If redeeming, continue with redemption
                    handleRedeem(selectedReward);
                  }
                  setShowEmailModal(false);
                  setSelectedReward(null);
                }}
                disabled={!userEmail || !userPhone}
              >
                {selectedReward ? 'Xác nhận' : 'Xem lịch sử'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content history-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📜 Lịch sử đổi thưởng</h3>
            {redemptionHistory.length === 0 ? (
              <p>Bạn chưa đổi phần thưởng nào.</p>
            ) : (
              <div className="history-list">
                {redemptionHistory.map((redemption) => (
                  <div key={redemption.id} className="history-item">
                    <div className="history-reward-name">{redemption.reward_name}</div>
                    <div className="history-details">
                      <div>Mã: <strong>{redemption.redemption_code}</strong></div>
                      <div>Điểm đã dùng: {redemption.points_used}</div>
                      <div>Trạng thái: 
                        <span className={`status ${redemption.status}`}>
                          {redemption.status === 'pending' ? '⏳ Đang xử lý' : 
                           redemption.status === 'completed' ? '✅ Hoàn thành' : 
                           '❌ Đã hủy'}
                        </span>
                      </div>
                      <div className="history-date">
                        {new Date(redemption.created_at).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="btn-close" onClick={() => setShowHistory(false)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Service Redemption Modal (Phase 2) */}
      {showServiceModal && selectedReward && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-content service-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📅 Đăng ký dịch vụ: {selectedReward.name}</h3>
            <p className="modal-description">
              Vui lòng điền thông tin để chúng tôi có thể sắp xếp dịch vụ cho bạn.
            </p>
            <div className="form-group">
              <label>Ngày mong muốn *</label>
              <input
                type="date"
                value={serviceForm.preferred_date}
                onChange={(e) => setServiceForm({ ...serviceForm, preferred_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Giờ mong muốn *</label>
              <input
                type="time"
                value={serviceForm.preferred_time}
                onChange={(e) => setServiceForm({ ...serviceForm, preferred_time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phương thức tư vấn</label>
              <select
                value={serviceForm.preferred_method}
                onChange={(e) => setServiceForm({ ...serviceForm, preferred_method: e.target.value })}
              >
                <option value="zoom">📹 Zoom</option>
                <option value="phone">📞 Điện thoại</option>
                <option value="office">🏢 Văn phòng</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ghi chú thêm (tùy chọn)</label>
              <textarea
                value={serviceForm.notes}
                onChange={(e) => setServiceForm({ ...serviceForm, notes: e.target.value })}
                placeholder="Ví dụ: Tôi muốn tư vấn về trường Yonsei..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowServiceModal(false)}>
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={handleServiceSubmit}
                disabled={redeeming === selectedReward.id}
              >
                {redeeming === selectedReward.id ? 'Đang xử lý...' : `Đổi ${selectedReward.points_required} điểm`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Review Modal (Phase 2) */}
      {showReviewModal && selectedReward && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <h3>📄 Gửi hồ sơ để review: {selectedReward.name}</h3>
            <p className="modal-description">
              Vui lòng cung cấp link hoặc tên file hồ sơ của bạn. Chúng tôi sẽ review và phản hồi sớm nhất.
            </p>
            <div className="form-group">
              <label>Link hồ sơ (Google Drive, Dropbox, v.v.)</label>
              <input
                type="url"
                value={reviewForm.document_url}
                onChange={(e) => setReviewForm({ ...reviewForm, document_url: e.target.value })}
                placeholder="https://drive.google.com/..."
              />
            </div>
            <div className="form-group">
              <label>Hoặc tên file hồ sơ</label>
              <input
                type="text"
                value={reviewForm.document_name}
                onChange={(e) => setReviewForm({ ...reviewForm, document_name: e.target.value })}
                placeholder="Ví dụ: Ho_so_du_hoc_2024.pdf"
              />
            </div>
            <div className="form-group">
              <label>Ghi chú thêm (tùy chọn)</label>
              <textarea
                value={reviewForm.user_notes}
                onChange={(e) => setReviewForm({ ...reviewForm, user_notes: e.target.value })}
                placeholder="Ví dụ: Tôi muốn review phần personal statement..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowReviewModal(false)}>
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={handleReviewSubmit}
                disabled={redeeming === selectedReward.id}
              >
                {redeeming === selectedReward.id ? 'Đang xử lý...' : `Đổi ${selectedReward.points_required} điểm`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visa Support Modal (Phase 2) */}
      {showVisaModal && selectedReward && (
        <div className="modal-overlay" onClick={() => setShowVisaModal(false)}>
          <div className="modal-content visa-modal" onClick={(e) => e.stopPropagation()}>
            <h3>🛂 Yêu cầu hỗ trợ visa: {selectedReward.name}</h3>
            <p className="modal-description">
              Vui lòng điền thông tin về tình trạng visa của bạn. Chúng tôi sẽ hỗ trợ bạn sớm nhất.
            </p>
            <div className="form-group">
              <label>Tình trạng visa hiện tại</label>
              <select
                value={visaForm.current_status}
                onChange={(e) => setVisaForm({ ...visaForm, current_status: e.target.value })}
              >
                <option value="">Chọn tình trạng...</option>
                <option value="chua_xin">Chưa xin visa</option>
                <option value="dang_chuan_bi">Đang chuẩn bị hồ sơ</option>
                <option value="da_nop">Đã nộp hồ sơ</option>
                <option value="dang_cho">Đang chờ kết quả</option>
                <option value="bi_tu_choi">Bị từ chối</option>
                <option value="da_co">Đã có visa</option>
              </select>
            </div>
            <div className="form-group">
              <label>Câu hỏi hoặc vấn đề cần hỗ trợ *</label>
              <textarea
                value={visaForm.questions}
                onChange={(e) => setVisaForm({ ...visaForm, questions: e.target.value })}
                placeholder="Ví dụ: Tôi cần hỗ trợ điền form visa D-2..."
                rows={4}
                required
              />
            </div>
            <div className="form-group">
              <label>Link tài liệu đã chuẩn bị (nếu có)</label>
              <input
                type="text"
                value={visaForm.documents_uploaded}
                onChange={(e) => setVisaForm({ ...visaForm, documents_uploaded: e.target.value })}
                placeholder="Link Google Drive, Dropbox..."
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowVisaModal(false)}>
                Hủy
              </button>
              <button
                className="btn-submit"
                onClick={handleVisaSubmit}
                disabled={redeeming === selectedReward.id}
              >
                {redeeming === selectedReward.id ? 'Đang xử lý...' : `Đổi ${selectedReward.points_required} điểm`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Redemption;

