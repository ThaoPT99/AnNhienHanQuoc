import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import './AIMatching.css';

const AIMatching = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [questionnaire, setQuestionnaire] = useState({
    user_email: '',
    major: '',
    budget_range: '',
    location_preference: '',
    language_level: '',
    scholarship_priority: 0,
    university_type: '',
    duration_preference: '',
    accommodation_preference: '',
    career_goals: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://annhienhanquoc-production.up.railway.app';
  const userEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    if (userEmail) {
      setQuestionnaire(prev => ({ ...prev, user_email: userEmail }));
      loadExistingQuestionnaire();
    }
  }, [userEmail]);

  const loadExistingQuestionnaire = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`${API_URL}/api/matching/questionnaire/${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setQuestionnaire(prev => ({ ...prev, ...data }));
        }
      }
    } catch (error) {
      console.error('Error loading questionnaire:', error);
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!userEmail) {
      alert('Vui lòng nhập email để sử dụng tính năng này');
      return;
    }

    setLoading(true);
    try {
      // Save questionnaire
      await fetch(`${API_URL}/api/matching/questionnaire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionnaire)
      });

      // Calculate matches
      const res = await fetch(`${API_URL}/api/matching/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: userEmail })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
        setStep(6);
      }
    } catch (error) {
      console.error('Error calculating matches:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-matching-page">
      <SEO
        title="AI Matching - Tìm trường phù hợp - Du học An Nhiên"
        description="Sử dụng AI để tìm trường đại học Hàn Quốc phù hợp nhất với bạn"
      />

      <div className="matching-container">
        <h1>🤖 AI Matching - Tìm trường phù hợp</h1>
        <p className="subtitle">Trả lời các câu hỏi để AI tìm trường đại học phù hợp nhất với bạn</p>

        {step <= 5 && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="question-step"
          >
            <h2>Bạn muốn học ngành gì?</h2>
            <div className="options-grid">
              {['Kinh tế', 'Kỹ thuật', 'Y tế', 'Nghệ thuật', 'Nhân văn', 'Luật'].map(option => (
                <button
                  key={option}
                  className={`option-btn ${questionnaire.major === option ? 'selected' : ''}`}
                  onClick={() => setQuestionnaire({ ...questionnaire, major: option })}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="btn-next" onClick={handleNext} disabled={!questionnaire.major}>
              Tiếp theo →
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="question-step"
          >
            <h2>Khả năng tài chính của bạn?</h2>
            <div className="options-grid">
              {['low', 'medium', 'high'].map(option => (
                <button
                  key={option}
                  className={`option-btn ${questionnaire.budget_range === option ? 'selected' : ''}`}
                  onClick={() => setQuestionnaire({ ...questionnaire, budget_range: option })}
                >
                  {option === 'low' ? '💰 Thấp' : option === 'medium' ? '💰💰 Trung bình' : '💰💰💰 Cao'}
                </button>
              ))}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={() => setStep(step - 1)}>← Quay lại</button>
              <button className="btn-next" onClick={handleNext} disabled={!questionnaire.budget_range}>
                Tiếp theo →
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="question-step"
          >
            <h2>Bạn muốn học ở đâu?</h2>
            <div className="options-grid">
              {['Seoul', 'Busan', 'Other'].map(option => (
                <button
                  key={option}
                  className={`option-btn ${questionnaire.location_preference === option ? 'selected' : ''}`}
                  onClick={() => setQuestionnaire({ ...questionnaire, location_preference: option })}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={() => setStep(step - 1)}>← Quay lại</button>
              <button className="btn-next" onClick={handleNext} disabled={!questionnaire.location_preference}>
                Tiếp theo →
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="question-step"
          >
            <h2>Loại trường đại học?</h2>
            <div className="options-grid">
              {['public', 'private'].map(option => (
                <button
                  key={option}
                  className={`option-btn ${questionnaire.university_type === option ? 'selected' : ''}`}
                  onClick={() => setQuestionnaire({ ...questionnaire, university_type: option })}
                >
                  {option === 'public' ? '🏛️ Công lập' : '🏢 Tư thục'}
                </button>
              ))}
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={() => setStep(step - 1)}>← Quay lại</button>
              <button className="btn-next" onClick={handleNext} disabled={!questionnaire.university_type}>
                Tiếp theo →
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="question-step"
          >
            <h2>Mức độ ưu tiên học bổng?</h2>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="5"
                value={questionnaire.scholarship_priority}
                onChange={(e) => setQuestionnaire({ ...questionnaire, scholarship_priority: parseInt(e.target.value) })}
                className="slider"
              />
              <div className="slider-labels">
                <span>Không quan trọng</span>
                <span>Rất quan trọng</span>
              </div>
              <p className="slider-value">Giá trị: {questionnaire.scholarship_priority}/5</p>
            </div>
            <div className="step-nav">
              <button className="btn-back" onClick={() => setStep(step - 1)}>← Quay lại</button>
              <button className="btn-next" onClick={handleNext}>
                {loading ? 'Đang tính toán...' : 'Tìm trường phù hợp 🎯'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="results-step"
          >
            <h2>🎯 Kết quả Matching</h2>
            <div className="results-list">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="result-card"
                >
                  <div className="result-header">
                    <h3>{result.school_name}</h3>
                    <span className="match-score">{result.match_score}%</span>
                  </div>
                  <div className="match-reasons">
                    {result.match_reasons.split('; ').map((reason, i) => (
                      <span key={i} className="reason-tag">✓ {reason}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <button className="btn-restart" onClick={() => { setStep(1); setResults([]); }}>
              🔄 Làm lại
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIMatching;



