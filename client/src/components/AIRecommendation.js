import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { schools } from '../data/schoolsData';
import './AIRecommendation.css';

const AIRecommendation = () => {
  const [userProfile, setUserProfile] = useState({
    budget: '',
    major: '',
    city: '',
    topik: '',
    gpa: '',
    english: false
  });
  const [recommendations, setRecommendations] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewHistory, setViewHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user viewing history from localStorage
    const history = JSON.parse(localStorage.getItem('schoolViewHistory') || '[]');
    setViewHistory(history);
  }, []);

  const getBudgetCategory = (tuition) => {
    if (tuition < 2500000) return 'low';
    if (tuition < 3500000) return 'medium';
    return 'high';
  };

  const getTopikLevel = (language) => {
    // Extract TOPIK level from string like "TOPIK 3-5" or "TOPIK 2-3"
    const match = language.match(/TOPIK\s*(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const calculateMatch = (school, profile) => {
    let score = 0;
    let reasons = [];

    // Budget match
    if (profile.budget) {
      const schoolBudget = getBudgetCategory(school.tuition);
      if (schoolBudget === profile.budget) {
        score += 30;
        reasons.push('Phù hợp với ngân sách');
      }
    }

    // Major match
    if (profile.major && school.majors && school.majors.some(m => m.includes(profile.major))) {
      score += 25;
      reasons.push('Có ngành học bạn quan tâm');
    }

    // City match
    if (profile.city && school.city === profile.city) {
      score += 20;
      reasons.push('Ở thành phố bạn muốn');
    }

    // TOPIK match
    if (profile.topik) {
      const schoolTopik = getTopikLevel(school.language);
      if (parseInt(profile.topik) >= schoolTopik) {
        score += 15;
        reasons.push('Đáp ứng yêu cầu TOPIK');
      }
    }

    // GPA match (estimate based on ranking - top schools require higher GPA)
    if (profile.gpa) {
      const requiredGpa = school.ranking <= 10 ? 3.5 : school.ranking <= 20 ? 3.0 : 2.5;
      if (parseFloat(profile.gpa) >= requiredGpa) {
        score += 10;
        reasons.push('GPA đạt yêu cầu');
      }
    }

    // History boost (if user viewed this school before)
    const hasViewed = viewHistory.includes(school.id);
    if (hasViewed) {
      score += 10;
      reasons.push('Bạn đã từng xem trường này');
    }

    return { score, reasons };
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const scoredSchools = schools.map(school => {
        const match = calculateMatch(school, userProfile);
        return {
          ...school,
          matchScore: match.score,
          matchReasons: match.reasons
        };
      });

      // Sort by match score
      const sorted = scoredSchools
        .filter(s => s.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      setRecommendations(sorted);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="ai-recommendation">
      <div className="ai-header">
        <h2>🤖 AI Gợi ý trường phù hợp</h2>
        <p>Điền thông tin để nhận gợi ý trường đại học phù hợp nhất với bạn</p>
      </div>

      <div className="ai-content">
        <div className="profile-form">
          <h3>📝 Thông tin của bạn</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Ngân sách</label>
              <select name="budget" value={userProfile.budget} onChange={handleChange}>
                <option value="">Chọn ngân sách</option>
                <option value="low">Thấp (dưới 200 triệu/năm)</option>
                <option value="medium">Trung bình (200-400 triệu/năm)</option>
                <option value="high">Cao (trên 400 triệu/năm)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Ngành học quan tâm</label>
              <select name="major" value={userProfile.major} onChange={handleChange}>
                <option value="">Chọn ngành</option>
                <option value="Kinh doanh">Kinh doanh</option>
                <option value="Kỹ thuật">Kỹ thuật</option>
                <option value="Y khoa">Y khoa</option>
                <option value="Nghệ thuật">Nghệ thuật</option>
                <option value="Ngôn ngữ">Ngôn ngữ</option>
              </select>
            </div>

            <div className="form-group">
              <label>Thành phố mong muốn</label>
              <select name="city" value={userProfile.city} onChange={handleChange}>
                <option value="">Chọn thành phố</option>
                <option value="Seoul">Seoul</option>
                <option value="Busan">Busan</option>
                <option value="Incheon">Incheon</option>
                <option value="Daegu">Daegu</option>
                <option value="Daejeon">Daejeon</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trình độ TOPIK</label>
              <select name="topik" value={userProfile.topik} onChange={handleChange}>
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
              <label>GPA (Điểm trung bình)</label>
              <input
                type="number"
                name="gpa"
                value={userProfile.gpa}
                onChange={handleChange}
                min="0"
                max="4.5"
                step="0.1"
                placeholder="Ví dụ: 3.5"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="english"
                  checked={userProfile.english}
                  onChange={handleChange}
                />
                Có chứng chỉ tiếng Anh (TOEFL/IELTS)
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
                Đang phân tích...
              </>
            ) : (
              <>
                🔍 Phân tích và gợi ý
              </>
            )}
          </button>
        </div>

        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="recommendations-section"
          >
            <h3>🎯 Trường phù hợp với bạn</h3>
            <div className="recommendations-list">
              {recommendations.map((school, index) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="recommendation-card"
                >
                  <div className="match-score">
                    <div className="score-circle">
                      <span>{school.matchScore}%</span>
                    </div>
                    <div className="match-label">Độ phù hợp</div>
                  </div>
                  <div className="school-info">
                    <h4>{school.name}</h4>
                    <div className="school-details">
                      <span>📍 {school.city}</span>
                      <span>📚 {school.major}</span>
                    </div>
                    <div className="match-reasons">
                      <strong>Lý do phù hợp:</strong>
                      <ul>
                        {school.matchReasons.map((reason, idx) => (
                          <li key={idx}>✓ {reason}</li>
                        ))}
                      </ul>
                    </div>
                    <Link 
                      to={`/school-comparison#school-${school.id}`}
                      className="view-school-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/school-comparison#school-${school.id}`);
                        // Scroll to school after navigation
                        setTimeout(() => {
                          const element = document.getElementById(`school-${school.id}`);
                          if (element) {
                            const offset = 100;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: 'smooth'
                            });
                          }
                        }, 100);
                      }}
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {viewHistory.length > 0 && (
          <div className="history-section">
            <h3>📚 Trường bạn đã xem</h3>
            <p>Dựa trên lịch sử xem của bạn, chúng tôi đã tính vào gợi ý</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
