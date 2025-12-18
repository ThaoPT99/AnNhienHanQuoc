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

  // Danh sách 50 trường đại học Hàn Quốc
  const allSchools = [
    { name: 'Đại học Quốc gia Seoul (SNU)', major: ['economics', 'engineering', 'medicine', 'law'], city: 'seoul', budget: 'high', topik: 'topik6', score: 95 },
    { name: 'Đại học Yonsei', major: ['economics', 'medicine', 'humanities'], city: 'seoul', budget: 'high', topik: 'topik6', score: 92 },
    { name: 'Đại học Korea', major: ['economics', 'law', 'humanities'], city: 'seoul', budget: 'high', topik: 'topik6', score: 90 },
    { name: 'Đại học Sungkyunkwan', major: ['engineering', 'economics', 'medicine'], city: 'seoul', budget: 'high', topik: 'topik6', score: 88 },
    { name: 'Đại học Hanyang', major: ['engineering', 'economics'], city: 'seoul', budget: 'high', topik: 'topik6', score: 87 },
    { name: 'Đại học Kyung Hee', major: ['medicine', 'arts'], city: 'seoul', budget: 'high', topik: 'topik6', score: 85 },
    { name: 'Đại học Sogang', major: ['economics', 'humanities'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 84 },
    { name: 'Đại học Ewha', major: ['humanities', 'arts'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 83 },
    { name: 'Đại học Hàn Quốc (HUFS)', major: ['humanities'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 82 },
    { name: 'Đại học Chung-Ang', major: ['arts'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 81 },
    { name: 'Đại học Pusan', major: ['economics', 'engineering'], city: 'busan', budget: 'medium', topik: 'topik4', score: 80 },
    { name: 'Đại học Inha', major: ['engineering'], city: 'other', budget: 'medium', topik: 'topik4', score: 79 },
    { name: 'Đại học Ajou', major: ['engineering', 'medicine'], city: 'other', budget: 'medium', topik: 'topik4', score: 78 },
    { name: 'Đại học Konkuk', major: ['economics', 'engineering'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 77 },
    { name: 'Đại học Dongguk', major: ['arts', 'humanities'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 76 },
    { name: 'Đại học Kyungpook', major: ['medicine', 'engineering'], city: 'other', budget: 'medium', topik: 'topik4', score: 75 },
    { name: 'Đại học Chonnam', major: ['medicine', 'engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 74 },
    { name: 'Đại học Chonbuk', major: ['engineering', 'medicine'], city: 'other', budget: 'low', topik: 'topik2', score: 73 },
    { name: 'Đại học Gyeongsang', major: ['medicine', 'engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 72 },
    { name: 'Đại học Jeonbuk', major: ['engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 71 },
    { name: 'Đại học Yeungnam', major: ['engineering', 'economics'], city: 'other', budget: 'low', topik: 'topik2', score: 70 },
    { name: 'Đại học Keimyung', major: ['medicine', 'humanities'], city: 'other', budget: 'low', topik: 'topik2', score: 69 },
    { name: 'Đại học Catholic', major: ['medicine', 'humanities'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 68 },
    { name: 'Đại học Kookmin', major: ['economics', 'arts'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 67 },
    { name: 'Đại học Sejong', major: ['arts', 'humanities'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 66 },
    { name: 'Đại học Soongsil', major: ['engineering', 'economics'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 65 },
    { name: 'Đại học Hankuk', major: ['humanities', 'economics'], city: 'seoul', budget: 'medium', topik: 'topik4', score: 64 },
    { name: 'Đại học Myongji', major: ['humanities', 'arts'], city: 'seoul', budget: 'low', topik: 'topik2', score: 63 },
    { name: 'Đại học Sangmyung', major: ['arts', 'humanities'], city: 'seoul', budget: 'low', topik: 'topik2', score: 62 },
    { name: 'Đại học Seokyeong', major: ['humanities'], city: 'seoul', budget: 'low', topik: 'topik2', score: 61 },
    { name: 'Đại học Dong-A', major: ['medicine', 'engineering'], city: 'busan', budget: 'medium', topik: 'topik4', score: 60 },
    { name: 'Đại học Pukyong', major: ['engineering'], city: 'busan', budget: 'low', topik: 'topik2', score: 59 },
    { name: 'Đại học Kyungsung', major: ['engineering', 'economics'], city: 'busan', budget: 'low', topik: 'topik2', score: 58 },
    { name: 'Đại học Kosin', major: ['medicine'], city: 'busan', budget: 'low', topik: 'topik2', score: 57 },
    { name: 'Đại học Tongmyong', major: ['engineering'], city: 'busan', budget: 'low', topik: 'topik2', score: 56 },
    { name: 'Đại học Chungnam', major: ['engineering', 'medicine'], city: 'other', budget: 'low', topik: 'topik2', score: 55 },
    { name: 'Đại học Kangwon', major: ['engineering', 'medicine'], city: 'other', budget: 'low', topik: 'topik2', score: 54 },
    { name: 'Đại học Jeju', major: ['humanities', 'arts'], city: 'other', budget: 'low', topik: 'topik2', score: 53 },
    { name: 'Đại học Soonchunhyang', major: ['medicine'], city: 'other', budget: 'low', topik: 'topik2', score: 52 },
    { name: 'Đại học Wonkwang', major: ['medicine', 'engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 51 },
    { name: 'Đại học Hannam', major: ['engineering', 'economics'], city: 'other', budget: 'low', topik: 'topik2', score: 50 },
    { name: 'Đại học Inje', major: ['medicine'], city: 'other', budget: 'low', topik: 'topik2', score: 49 },
    { name: 'Đại học Gachon', major: ['medicine', 'engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 48 },
    { name: 'Đại học Dankook', major: ['arts', 'humanities'], city: 'other', budget: 'low', topik: 'topik2', score: 47 },
    { name: 'Đại học Duksung', major: ['humanities', 'arts'], city: 'seoul', budget: 'low', topik: 'topik2', score: 46 },
    { name: 'Đại học Sehan', major: ['engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 45 },
    { name: 'Đại học Sunmoon', major: ['humanities'], city: 'other', budget: 'low', topik: 'topik2', score: 44 },
    { name: 'Đại học Woosuk', major: ['humanities', 'arts'], city: 'other', budget: 'low', topik: 'topik2', score: 43 },
    { name: 'Đại học Howon', major: ['engineering'], city: 'other', budget: 'low', topik: 'topik2', score: 42 },
    { name: 'Đại học Silla', major: ['humanities', 'arts'], city: 'busan', budget: 'low', topik: 'topik2', score: 41 },
    { name: 'Đại học Pai Chai', major: ['humanities'], city: 'other', budget: 'low', topik: 'topik2', score: 40 }
  ];

  // Hàm tìm trường phù hợp dựa trên câu trả lời
  const findMatchingSchools = (major, city, budget, topik) => {
    let matchingSchools = allSchools.filter(school => {
      const majorMatch = school.major.includes(major);
      const cityMatch = school.city === city || city === 'any';
      const budgetMatch = 
        (budget === 'high' && (school.budget === 'high' || school.budget === 'medium' || school.budget === 'low')) ||
        (budget === 'medium' && (school.budget === 'medium' || school.budget === 'low')) ||
        (budget === 'low' && school.budget === 'low');
      const topikMatch = 
        (topik === 'topik6' && (school.topik === 'topik6' || school.topik === 'topik4' || school.topik === 'topik2')) ||
        (topik === 'topik4' && (school.topik === 'topik4' || school.topik === 'topik2')) ||
        (topik === 'topik2' && school.topik === 'topik2') ||
        (topik === 'none' && true);
      
      return majorMatch && cityMatch && budgetMatch && topikMatch;
    });

    // Nếu không tìm thấy trường nào khớp hoàn toàn, tìm trường gần nhất
    if (matchingSchools.length === 0) {
      matchingSchools = allSchools.filter(school => {
        const majorMatch = school.major.includes(major);
        return majorMatch;
      });
    }

    // Sắp xếp theo score giảm dần
    matchingSchools.sort((a, b) => b.score - a.score);

    // Lấy top 3-5 trường phù hợp nhất
    const topSchools = matchingSchools.slice(0, 5);

    // Tạo lý do đề xuất
    const majorNames = {
      'economics': 'Kinh tế',
      'engineering': 'Kỹ thuật',
      'medicine': 'Y tế',
      'arts': 'Nghệ thuật',
      'humanities': 'Nhân văn',
      'law': 'Luật'
    };

    return topSchools.map(school => {
      let reason = '';
      
      // Lý do về ngành học
      if (school.major.includes(major)) {
        reason += `Mạnh về ${majorNames[major]}. `;
      }
      
      // Lý do về thành phố
      if (city === 'any') {
        reason += school.city === 'seoul' ? 'Tại Seoul, nhiều cơ hội. ' : school.city === 'busan' ? 'Tại Busan, chi phí hợp lý. ' : 'Tại thành phố khác, chi phí thấp. ';
      } else if (school.city === city) {
        reason += city === 'seoul' ? 'Tại Seoul, nhiều cơ hội việc làm. ' : city === 'busan' ? 'Tại Busan, thành phố biển đẹp. ' : 'Tại thành phố khác, chi phí sinh hoạt thấp. ';
      }
      
      // Lý do về tài chính
      if (budget === 'high') {
        reason += school.budget === 'high' ? 'Học phí cao, chất lượng xuất sắc. ' : 'Học phí vừa phải, nhiều học bổng. ';
      } else if (budget === 'medium') {
        reason += school.budget === 'medium' ? 'Chi phí vừa phải, nhiều học bổng. ' : 'Chi phí thấp, học bổng tốt. ';
      } else {
        reason += 'Chi phí thấp, nhiều học bổng hỗ trợ. ';
      }
      
      // Lý do về TOPIK
      if (topik === 'topik6') {
        reason += 'Phù hợp với trình độ TOPIK cao. ';
      } else if (topik === 'topik4') {
        reason += 'Phù hợp với trình độ TOPIK trung bình. ';
      } else if (topik === 'topik2') {
        reason += 'Phù hợp với trình độ TOPIK sơ cấp. ';
      } else {
        reason += 'Có thể đăng ký khi chưa có TOPIK. ';
      }
      
      reason += `Điểm đánh giá: ${school.score}/100.`;

      return {
        name: school.name,
        score: school.score,
        reason: reason.trim()
      };
    });
  };

  const schoolRecommendations = {
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
    
    // Tìm trường phù hợp dựa trên câu trả lời
    const recommendations = findMatchingSchools(major, city, budget, topik);
    
    // Nếu không tìm thấy trường nào, dùng default
    if (recommendations.length === 0) {
      setResult(schoolRecommendations['default']);
    } else {
      setResult(recommendations);
    }
    
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

