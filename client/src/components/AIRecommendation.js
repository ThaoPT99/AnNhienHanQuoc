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
  const [gpaScale, setGpaScale] = useState('4'); // '4' hoặc '10'
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

  // Chuyển đổi GPA từ thang 10 sang thang 4
  const convertGpaToScale4 = (gpa, scale) => {
    if (scale === '10') {
      // Chuyển đổi thang 10 sang thang 4: GPA_4 = (GPA_10 / 10) * 4
      return (parseFloat(gpa) / 10) * 4;
    }
    return parseFloat(gpa);
  };

  const calculateMatch = (school, profile) => {
    let score = 0;
    let maxScore = 0;
    let reasons = [];

    // Budget match (30 điểm)
    if (profile.budget) {
      maxScore += 30;
      const schoolBudget = getBudgetCategory(school.tuition);
      if (schoolBudget === profile.budget) {
        score += 30;
        reasons.push('Phù hợp với ngân sách');
      } else {
        // Partial match: gần với ngân sách
        const budgetOrder = ['low', 'medium', 'high'];
        const profileIndex = budgetOrder.indexOf(profile.budget);
        const schoolIndex = budgetOrder.indexOf(schoolBudget);
        if (Math.abs(profileIndex - schoolIndex) === 1) {
          score += 15;
          reasons.push('Ngân sách gần phù hợp');
        }
      }
    }

    // Major match (25 điểm)
    if (profile.major) {
      maxScore += 25;
      if (school.majors && school.majors.some(m => m.includes(profile.major))) {
        score += 25;
        reasons.push('Có ngành học bạn quan tâm');
      } else if (school.topMajors && school.topMajors.some(m => m.includes(profile.major))) {
        score += 20;
        reasons.push('Có ngành học liên quan');
      }
    }

    // City match (20 điểm)
    if (profile.city) {
      maxScore += 20;
      if (school.city === profile.city) {
        score += 20;
        reasons.push('Ở thành phố bạn muốn');
      }
    }

    // TOPIK match (15 điểm)
    if (profile.topik) {
      maxScore += 15;
      const schoolTopik = getTopikLevel(school.language);
      const userTopik = parseInt(profile.topik);
      if (userTopik >= schoolTopik) {
        score += 15;
        reasons.push('Đáp ứng yêu cầu TOPIK');
      } else if (userTopik >= schoolTopik - 1) {
        score += 8;
        reasons.push('TOPIK gần đạt yêu cầu');
      }
    }

    // GPA match (10 điểm)
    // Note: Logic này sử dụng thang 4 làm chuẩn, nếu user nhập thang 10 sẽ được chuyển đổi
    if (profile.gpa) {
      maxScore += 10;
      const requiredGpa = school.ranking <= 10 ? 3.5 : school.ranking <= 20 ? 3.0 : 2.5;
      // Chuyển đổi GPA của user sang thang 4 để so sánh
      const userGpaScale4 = convertGpaToScale4(profile.gpa, profile.gpaScale || '4');
      if (userGpaScale4 >= requiredGpa) {
        score += 10;
        reasons.push('GPA đạt yêu cầu');
      } else if (userGpaScale4 >= requiredGpa - 0.3) {
        score += 5;
        reasons.push('GPA gần đạt yêu cầu');
      }
    }

    // Perfect match check (nếu tất cả tiêu chí đã điền đều khớp hoàn hảo)
    const filledCriteria = [profile.budget, profile.major, profile.city, profile.topik, profile.gpa].filter(Boolean).length;
    let perfectMatchCount = 0;
    
    if (profile.budget && getBudgetCategory(school.tuition) === profile.budget) perfectMatchCount++;
    if (profile.major && school.majors && school.majors.some(m => m.includes(profile.major))) perfectMatchCount++;
    if (profile.city && school.city === profile.city) perfectMatchCount++;
    if (profile.topik && parseInt(profile.topik) >= getTopikLevel(school.language)) perfectMatchCount++;
    if (profile.gpa) {
      const requiredGpa = school.ranking <= 10 ? 3.5 : school.ranking <= 20 ? 3.0 : 2.5;
      const userGpaScale4 = convertGpaToScale4(profile.gpa, profile.gpaScale || '4');
      if (userGpaScale4 >= requiredGpa) perfectMatchCount++;
    }
    
    // Nếu tất cả tiêu chí đã điền đều khớp hoàn hảo → đạt 100%
    if (filledCriteria > 0 && perfectMatchCount === filledCriteria) {
      score = maxScore; // Đặt score = maxScore để đạt 100%
      if (!reasons.some(r => r.includes('Khớp hoàn hảo'))) {
        reasons.push('⭐ Khớp hoàn hảo với tất cả tiêu chí');
      }
    }

    // History boost (bonus điểm, nhưng không vượt quá maxScore)
    const hasViewed = viewHistory.includes(school.id);
    if (hasViewed && score < maxScore) {
      const remainingScore = maxScore - score;
      score += Math.min(5, remainingScore);
      if (!reasons.some(r => r.includes('từng xem'))) {
        reasons.push('Bạn đã từng xem trường này');
      }
    }

    // Tính phần trăm (đảm bảo maxScore > 0)
    // Nếu maxScore = 0 (không điền tiêu chí nào), trả về 0
    const percentage = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;

    return { score: percentage, reasons, rawScore: score, maxScore };
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const scoredSchools = schools.map(school => {
        const match = calculateMatch(school, { ...userProfile, gpaScale });
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

  const handleGpaScaleChange = (newScale) => {
    // Tự động chuyển đổi giá trị GPA khi đổi thang điểm
    if (userProfile.gpa && !isNaN(parseFloat(userProfile.gpa))) {
      const currentGpa = parseFloat(userProfile.gpa);
      let convertedGpa = '';
      
      if (gpaScale === '4' && newScale === '10') {
        // Chuyển từ thang 4 sang thang 10: GPA_10 = (GPA_4 / 4) * 10
        convertedGpa = ((currentGpa / 4) * 10).toFixed(2);
      } else if (gpaScale === '10' && newScale === '4') {
        // Chuyển từ thang 10 sang thang 4: GPA_4 = (GPA_10 / 10) * 4
        convertedGpa = ((currentGpa / 10) * 4).toFixed(2);
      } else {
        convertedGpa = userProfile.gpa;
      }
      
      setUserProfile(prev => ({
        ...prev,
        gpa: convertedGpa
      }));
    }
    setGpaScale(newScale);
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
              <div className="gpa-scale-selector">
                <label className="scale-option">
                  <input
                    type="radio"
                    name="gpaScale"
                    value="4"
                    checked={gpaScale === '4'}
                    onChange={(e) => handleGpaScaleChange(e.target.value)}
                  />
                  <span>Thang 4</span>
                </label>
                <label className="scale-option">
                  <input
                    type="radio"
                    name="gpaScale"
                    value="10"
                    checked={gpaScale === '10'}
                    onChange={(e) => handleGpaScaleChange(e.target.value)}
                  />
                  <span>Thang 10</span>
                </label>
              </div>
              <input
                type="number"
                name="gpa"
                value={userProfile.gpa}
                onChange={handleChange}
                min="0"
                max={gpaScale === '10' ? '10' : '4.5'}
                step={gpaScale === '10' ? '0.01' : '0.1'}
                placeholder={gpaScale === '10' ? 'Ví dụ: 8.5' : 'Ví dụ: 3.5'}
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
