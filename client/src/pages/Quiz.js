import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import './Quiz.css';

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Quiz tìm trường đại học phù hợp - Du học An Nhiên",
    "description": "Làm quiz để tìm trường đại học Hàn Quốc phù hợp nhất với bạn dựa trên sở thích, ngành học và khả năng tài chính",
    "url": "https://duhocannhien.vercel.app/quiz"
  };

  const questions = [
    {
      id: 1,
      question: 'Bạn muốn học ngành gì?',
      type: 'single',
      options: [
        { id: 'economics', label: 'Kinh tế / Quản trị kinh doanh', icon: '💼' },
        { id: 'engineering', label: 'Kỹ thuật / Công nghệ thông tin', icon: '💻' },
        { id: 'medicine', label: 'Y tế / Dược', icon: '⚕️' },
        { id: 'arts', label: 'Nghệ thuật / Thiết kế', icon: '🎨' },
        { id: 'humanities', label: 'Nhân văn / Ngôn ngữ', icon: '📚' },
        { id: 'law', label: 'Luật', icon: '⚖️' }
      ]
    },
    {
      id: 2,
      question: 'Bạn muốn học ở thành phố nào?',
      type: 'single',
      options: [
        { id: 'seoul', label: 'Seoul (Thủ đô, đắt đỏ nhưng nhiều cơ hội)', icon: '🏙️' },
        { id: 'busan', label: 'Busan (Thành phố biển, chi phí vừa phải)', icon: '🌊' },
        { id: 'other', label: 'Thành phố khác (Chi phí thấp hơn)', icon: '🏘️' },
        { id: 'any', label: 'Không quan trọng', icon: '🌍' }
      ]
    },
    {
      id: 3,
      question: 'Khả năng tài chính của bạn?',
      type: 'single',
      options: [
        { id: 'high', label: 'Cao (Có thể chi trả học phí trường top)', icon: '💰' },
        { id: 'medium', label: 'Trung bình (Cần học bổng 30-50%)', icon: '💵' },
        { id: 'low', label: 'Thấp (Cần học bổng 70-100%)', icon: '💸' }
      ]
    },
    {
      id: 4,
      question: 'Trình độ TOPIK hiện tại của bạn?',
      type: 'single',
      options: [
        { id: 'topik6', label: 'TOPIK 5-6 (Cao cấp)', icon: '⭐' },
        { id: 'topik4', label: 'TOPIK 3-4 (Trung cấp)', icon: '✨' },
        { id: 'topik2', label: 'TOPIK 1-2 (Sơ cấp)', icon: '🌟' },
        { id: 'none', label: 'Chưa có TOPIK', icon: '📖' }
      ]
    },
    {
      id: 5,
      question: 'Bạn quan tâm điều gì nhất khi chọn trường?',
      type: 'multiple',
      options: [
        { id: 'ranking', label: 'Ranking / Uy tín trường', icon: '🏆' },
        { id: 'scholarship', label: 'Cơ hội học bổng', icon: '🎓' },
        { id: 'location', label: 'Vị trí địa lý', icon: '📍' },
        { id: 'cost', label: 'Chi phí học tập', icon: '💳' },
        { id: 'program', label: 'Chương trình đào tạo', icon: '📋' },
        { id: 'facilities', label: 'Cơ sở vật chất', icon: '🏫' }
      ]
    },
    {
      id: 6,
      question: 'Bạn muốn loại trường nào?',
      type: 'single',
      options: [
        { id: 'public', label: 'Trường công lập (Học phí thấp hơn)', icon: '🏛️' },
        { id: 'private', label: 'Trường tư thục (Nhiều lựa chọn hơn)', icon: '🏢' },
        { id: 'any', label: 'Không quan trọng', icon: '✅' }
      ]
    }
  ];

  const schoolRecommendations = {
    'economics-seoul-high-topik6': [
      { name: 'Đại học Quốc gia Seoul (SNU)', score: 95, reason: 'Trường top 1, mạnh về Kinh tế, ranking cao' },
      { name: 'Đại học Yonsei', score: 90, reason: 'SKY, nổi tiếng về Kinh tế, môi trường quốc tế' },
      { name: 'Đại học Korea', score: 88, reason: 'SKY, mạnh về Kinh tế và Luật' }
    ],
    'engineering-seoul-high-topik6': [
      { name: 'Đại học Hanyang', score: 95, reason: 'Nổi tiếng về Kỹ thuật, nhiều chương trình thực tập' },
      { name: 'Đại học Sungkyunkwan', score: 92, reason: 'Mạnh về Kỹ thuật, có hợp tác với Samsung' },
      { name: 'Đại học Quốc gia Seoul (SNU)', score: 90, reason: 'Trường top, chất lượng Kỹ thuật xuất sắc' }
    ],
    'medicine-seoul-high-topik6': [
      { name: 'Đại học Yonsei', score: 95, reason: 'Nổi tiếng về Y tế, bệnh viện liên kết tốt' },
      { name: 'Đại học Kyung Hee', score: 90, reason: 'Mạnh về Y tế, có bệnh viện riêng' },
      { name: 'Đại học Quốc gia Seoul (SNU)', score: 88, reason: 'Trường top, ngành Y chất lượng cao' }
    ],
    'default': [
      { name: 'Đại học Sungkyunkwan', score: 85, reason: 'Trường uy tín, nhiều học bổng, chi phí hợp lý' },
      { name: 'Đại học Hanyang', score: 82, reason: 'Chất lượng tốt, nhiều ngành học, học bổng đa dạng' },
      { name: 'Đại học Kyung Hee', score: 80, reason: 'Môi trường đẹp, học bổng tốt, chi phí vừa phải' }
    ]
  };

  const handleAnswer = (questionId, answerId) => {
    const question = questions.find(q => q.id === questionId);
    
    if (question.type === 'single') {
      setAnswers(prev => ({ ...prev, [questionId]: answerId }));
      if (currentStep < questions.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 300);
      } else {
        calculateResult({ ...answers, [questionId]: answerId });
      }
    } else {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter(id => id !== answerId)
        : [...currentAnswers, answerId];
      
      setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(answers);
    }
  };

  const calculateResult = (finalAnswers) => {
    const major = finalAnswers[1] || 'economics';
    const city = finalAnswers[2] || 'any';
    const budget = finalAnswers[3] || 'medium';
    const topik = finalAnswers[4] || 'topik4';
    
    const key = `${major}-${city}-${budget}-${topik}`;
    const recommendations = schoolRecommendations[key] || schoolRecommendations['default'];
    
    setResult(recommendations);
    setCurrentStep(questions.length);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <SEO
        title="Quiz tìm trường đại học phù hợp - Du học An Nhiên"
        description="Làm quiz để tìm trường đại học Hàn Quốc phù hợp nhất với bạn dựa trên sở thích, ngành học và khả năng tài chính"
        keywords="quiz tìm trường đại học Hàn Quốc, chọn trường du học Hàn Quốc, trường phù hợp với bạn, tư vấn chọn trường"
        url="https://duhocannhien.vercel.app/quiz"
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
            <span className="title-icon">🎯</span>
            Quiz tìm trường phù hợp
          </h1>
          <p className="page-subtitle">
            Trả lời các câu hỏi để tìm trường đại học Hàn Quốc phù hợp nhất với bạn
          </p>
        </motion.div>
      </div>

      <div className="quiz-content">
        {currentStep < questions.length ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="quiz-card"
          >
            <div className="quiz-progress">
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="progress-text">
                Câu {currentStep + 1} / {questions.length}
              </div>
            </div>

            <h2 className="question-title">{currentQuestion.question}</h2>

            <div className="options-grid">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === 'single'
                  ? answers[currentQuestion.id] === option.id
                  : (answers[currentQuestion.id] || []).includes(option.id);

                return (
                  <motion.button
                    key={option.id}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswer(currentQuestion.id, option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                    {isSelected && <span className="check-icon">✓</span>}
                  </motion.button>
                );
              })}
            </div>

            {currentQuestion.type === 'multiple' && (
              <div className="quiz-actions">
                <button
                  className="next-btn"
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0}
                >
                  {currentStep === questions.length - 1 ? 'Xem kết quả' : 'Tiếp theo →'}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="result-card"
          >
            <h2 className="result-title">
              <span>🎓</span>
              Kết quả đề xuất trường cho bạn
            </h2>
            <p className="result-subtitle">
              Dựa trên câu trả lời của bạn, đây là những trường phù hợp nhất:
            </p>

            <div className="recommendations-list">
              {result?.map((school, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="recommendation-card"
                >
                  <div className="recommendation-header">
                    <div className="recommendation-rank">#{index + 1}</div>
                    <div className="recommendation-score">
                      <span className="score-value">{school.score}</span>
                      <span className="score-label">/100</span>
                    </div>
                  </div>
                  <h3 className="recommendation-name">{school.name}</h3>
                  <p className="recommendation-reason">{school.reason}</p>
                </motion.div>
              ))}
            </div>

            <div className="result-actions">
              <button onClick={resetQuiz} className="retake-btn">
                🔄 Làm lại quiz
              </button>
              <a href="/school-comparison" className="compare-btn">
                📊 So sánh trường
              </a>
              <a href="/contact" className="consult-btn">
                💬 Tư vấn chi tiết
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

