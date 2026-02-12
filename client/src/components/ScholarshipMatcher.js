import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ScholarshipMatcher.css';

const ScholarshipMatcher = () => {
  const [profile, setProfile] = useState({
    gpa: '',
    topik: '',
    english: false,
    major: '',
    nationality: 'Vietnamese',
    financialNeed: false
  });
  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';

  const scholarships = [
    {
      id: 1,
      name: 'Học bổng KGSP (Korean Government Scholarship)',
      provider: 'Chính phủ Hàn Quốc',
      coverage: '100%',
      amount: 'Toàn bộ học phí + sinh hoạt phí + vé máy bay',
      requirements: {
        gpa: 3.5,
        topik: 3,
        english: false,
        major: 'all',
        nationality: 'all',
        financialNeed: false
      },
      deadline: 'Tháng 9 hàng năm',
      description: 'Học bổng toàn phần từ chính phủ Hàn Quốc, bao gồm học phí, sinh hoạt phí và vé máy bay',
      applicationLink: '#'
    },
    {
      id: 2,
      name: 'Học bổng Đại học Yonsei',
      provider: 'Đại học Yonsei',
      coverage: '50-100%',
      amount: '50-100% học phí',
      requirements: {
        gpa: 3.8,
        topik: 4,
        english: false,
        major: 'all',
        nationality: 'all',
        financialNeed: false
      },
      deadline: 'Tháng 3 và tháng 9',
      description: 'Học bổng từ Đại học Yonsei dành cho sinh viên quốc tế xuất sắc',
      applicationLink: '#'
    },
    {
      id: 3,
      name: 'Học bổng Đại học Korea',
      provider: 'Đại học Korea',
      coverage: '30-70%',
      amount: '30-70% học phí',
      requirements: {
        gpa: 3.5,
        topik: 3,
        english: false,
        major: 'all',
        nationality: 'all',
        financialNeed: false
      },
      deadline: 'Tháng 2 và tháng 8',
      description: 'Học bổng đa dạng từ Đại học Korea cho sinh viên quốc tế',
      applicationLink: '#'
    },
    {
      id: 4,
      name: 'Học bổng SNU Global',
      provider: 'Đại học Quốc gia Seoul',
      coverage: '50-100%',
      amount: '50-100% học phí + sinh hoạt phí',
      requirements: {
        gpa: 4.0,
        topik: 5,
        english: true,
        major: 'all',
        nationality: 'all',
        financialNeed: false
      },
      deadline: 'Tháng 1 và tháng 7',
      description: 'Học bổng danh giá từ trường đại học số 1 Hàn Quốc',
      applicationLink: '#'
    },
    {
      id: 5,
      name: 'Học bổng ASEAN',
      provider: 'Chính phủ Hàn Quốc',
      coverage: '100%',
      amount: 'Toàn bộ học phí + sinh hoạt phí',
      requirements: {
        gpa: 3.0,
        topik: 2,
        english: false,
        major: 'all',
        nationality: 'ASEAN',
        financialNeed: true
      },
      deadline: 'Tháng 10 hàng năm',
      description: 'Học bổng đặc biệt dành cho sinh viên các nước ASEAN',
      applicationLink: '#'
    }
  ];

  const checkEligibility = (scholarship) => {
    let matchScore = 0;
    let reasons = [];
    let requirements = scholarship.requirements;

    // GPA check
    if (profile.gpa && parseFloat(profile.gpa) >= requirements.gpa) {
      matchScore += 25;
      reasons.push(`GPA ${profile.gpa} đạt yêu cầu (≥${requirements.gpa})`);
    } else if (profile.gpa) {
      reasons.push(`GPA ${profile.gpa} chưa đạt yêu cầu (cần ≥${requirements.gpa})`);
    }

    // TOPIK check
    if (profile.topik && parseInt(profile.topik) >= requirements.topik) {
      matchScore += 25;
      reasons.push(`TOPIK ${profile.topik} đạt yêu cầu (≥${requirements.topik})`);
    } else if (profile.topik) {
      reasons.push(`TOPIK ${profile.topik} chưa đạt yêu cầu (cần ≥${requirements.topik})`);
    }

    // English check
    if (!requirements.english || profile.english) {
      matchScore += 15;
      if (requirements.english) {
        reasons.push('Có chứng chỉ tiếng Anh');
      }
    } else if (requirements.english) {
      reasons.push('Cần chứng chỉ tiếng Anh (TOEFL/IELTS)');
    }

    // Nationality check
    if (requirements.nationality === 'all' || requirements.nationality === profile.nationality) {
      matchScore += 15;
      reasons.push('Đáp ứng yêu cầu quốc tịch');
    } else {
      reasons.push(`Chỉ dành cho công dân ${requirements.nationality}`);
    }

    // Financial need check
    if (!requirements.financialNeed || profile.financialNeed) {
      matchScore += 10;
      if (requirements.financialNeed) {
        reasons.push('Có nhu cầu tài chính');
      }
    }

    // Major check
    if (requirements.major === 'all' || requirements.major === profile.major) {
      matchScore += 10;
    }

    return { matchScore, reasons, eligible: matchScore >= 50 };
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const results = scholarships.map(scholarship => {
        const eligibility = checkEligibility(scholarship);
        return {
          ...scholarship,
          ...eligibility
        };
      });

      const sorted = results
        .filter(s => s.eligible)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatchedScholarships(sorted);
      setIsAnalyzing(false);
      // Show contact form after getting results
      if (sorted.length > 0) {
        setShowContactForm(true);
      }
    }, 1500);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      alert('Email không hợp lệ!');
      return;
    }

    // Validate phone
    const cleanPhone = contactInfo.phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    if (!phoneRegex.test(cleanPhone)) {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (ví dụ: 0912345678)');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/scholarship/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactInfo.name,
          email: contactInfo.email,
          phone: cleanPhone,
          profile: profile,
          matchedScholarships: matchedScholarships.map(s => s.id)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Cảm ơn bạn đã để lại thông tin! Chúng tôi sẽ liên hệ với bạn sớm nhất.' });
        setContactInfo({ name: '', email: '', phone: '' });
        setTimeout(() => {
          setShowContactForm(false);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus({ type: 'error', message: data.error || 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="scholarship-matcher">
      <div className="matcher-header">
        <h2>🎓 Tìm học bổng phù hợp</h2>
        <p>Điền thông tin để tìm học bổng phù hợp nhất với profile của bạn</p>
      </div>

      <div className="matcher-content">
        <div className="profile-form">
          <h3>📝 Thông tin của bạn</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>GPA (Điểm trung bình)</label>
              <input
                type="number"
                name="gpa"
                value={profile.gpa}
                onChange={handleChange}
                min="0"
                max="4.5"
                step="0.1"
                placeholder="Ví dụ: 3.5"
              />
            </div>

            <div className="form-group">
              <label>Trình độ TOPIK</label>
              <select name="topik" value={profile.topik} onChange={handleChange}>
                <option value="">Chọn TOPIK</option>
                <option value="1">TOPIK 1</option>
                <option value="2">TOPIK 2</option>
                <option value="3">TOPIK 3</option>
                <option value="4">TOPIK 4</option>
                <option value="5">TOPIK 5</option>
                <option value="6">TOPIK 6</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngành học</label>
              <select name="major" value={profile.major} onChange={handleChange}>
                <option value="">Chọn ngành</option>
                <option value="Kinh doanh">Kinh doanh</option>
                <option value="Kỹ thuật">Kỹ thuật</option>
                <option value="Y khoa">Y khoa</option>
                <option value="Nghệ thuật">Nghệ thuật</option>
                <option value="all">Tất cả ngành</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quốc tịch</label>
              <select name="nationality" value={profile.nationality} onChange={handleChange}>
                <option value="Vietnamese">Việt Nam</option>
                <option value="ASEAN">ASEAN (khác)</option>
                <option value="all">Khác</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="english"
                  checked={profile.english}
                  onChange={handleChange}
                />
                Có chứng chỉ tiếng Anh (TOEFL/IELTS)
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="financialNeed"
                  checked={profile.financialNeed}
                  onChange={handleChange}
                />
                Có nhu cầu hỗ trợ tài chính
              </label>
            </div>
          </div>

          <button 
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                Đang tìm kiếm...
              </>
            ) : (
              <>
                🔍 Tìm học bổng phù hợp
              </>
            )}
          </button>
        </div>

        {matchedScholarships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-section"
          >
            <h3>🎯 Học bổng phù hợp với bạn</h3>
            <div className="scholarships-list">
              {matchedScholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="scholarship-card"
                >
                  <div className="scholarship-header">
                    <div>
                      <h4>{scholarship.name}</h4>
                      <p className="scholarship-provider">{scholarship.provider}</p>
                    </div>
                    <div className="match-badge">
                      <span>{scholarship.matchScore}%</span>
                      <small>Phù hợp</small>
                    </div>
                  </div>

                  <div className="scholarship-details">
                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <div>
                        <div className="detail-label">Mức hỗ trợ</div>
                        <div className="detail-value">{scholarship.coverage}</div>
                        <div className="detail-amount">{scholarship.amount}</div>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <div>
                        <div className="detail-label">Hạn nộp</div>
                        <div className="detail-value">{scholarship.deadline}</div>
                      </div>
                    </div>
                  </div>

                  <p className="scholarship-description">{scholarship.description}</p>

                  <div className="eligibility-reasons">
                    <strong>Lý do phù hợp:</strong>
                    <ul>
                      {scholarship.reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="scholarship-actions">
                    <a href={scholarship.applicationLink} className="apply-btn">
                      Xem chi tiết và đăng ký →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {matchedScholarships.length === 0 && !isAnalyzing && (
          <div className="no-results">
            <p>Chưa có kết quả. Vui lòng điền thông tin và nhấn "Tìm học bổng phù hợp"</p>
          </div>
        )}

        {/* Contact Form */}
        {showContactForm && matchedScholarships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-form-section"
            style={{
              marginTop: '40px',
              padding: '30px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: '2px solid #667eea'
            }}
          >
            <h3 style={{ marginBottom: '20px', color: '#667eea' }}>
              📞 Để lại thông tin để được tư vấn về học bổng
            </h3>
            <p style={{ marginBottom: '20px', color: '#666' }}>
              Điền thông tin liên hệ để chúng tôi có thể hỗ trợ bạn tốt nhất về các học bổng phù hợp
            </p>
            <form onSubmit={handleContactSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    required
                    placeholder="Nhập họ và tên của bạn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    required
                    placeholder="example@email.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    required
                    pattern="(\+84|0)[0-9]{9,10}"
                    placeholder="0912345678"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
              {submitStatus && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: submitStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {submitStatus.message}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowContactForm(false);
                    setContactInfo({ name: '', email: '', phone: '' });
                    setSubmitStatus(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Bỏ qua
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipMatcher;
