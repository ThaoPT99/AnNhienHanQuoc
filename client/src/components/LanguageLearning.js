import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LanguageLearning.css';

const LanguageLearning = () => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const lessons = [
    {
      id: 1,
      title: 'Chào hỏi cơ bản',
      words: [
        { korean: '안녕하세요', romanized: 'Annyeonghaseyo', vietnamese: 'Xin chào', category: 'Chào hỏi' },
        { korean: '감사합니다', romanized: 'Gamsahamnida', vietnamese: 'Cảm ơn', category: 'Lịch sự' },
        { korean: '죄송합니다', romanized: 'Joesonghamnida', vietnamese: 'Xin lỗi', category: 'Lịch sự' },
        { korean: '안녕히 가세요', romanized: 'Annyeonghi gaseyo', vietnamese: 'Tạm biệt (khi người khác đi)', category: 'Chào hỏi' }
      ]
    },
    {
      id: 2,
      title: 'Số đếm',
      words: [
        { korean: '하나', romanized: 'Hana', vietnamese: 'Một', category: 'Số đếm' },
        { korean: '둘', romanized: 'Dul', vietnamese: 'Hai', category: 'Số đếm' },
        { korean: '셋', romanized: 'Set', vietnamese: 'Ba', category: 'Số đếm' },
        { korean: '넷', romanized: 'Net', vietnamese: 'Bốn', category: 'Số đếm' },
        { korean: '다섯', romanized: 'Daseot', vietnamese: 'Năm', category: 'Số đếm' }
      ]
    },
    {
      id: 3,
      title: 'Màu sắc',
      words: [
        { korean: '빨간색', romanized: 'Ppalgansaek', vietnamese: 'Màu đỏ', category: 'Màu sắc' },
        { korean: '파란색', romanized: 'Paransaek', vietnamese: 'Màu xanh dương', category: 'Màu sắc' },
        { korean: '노란색', romanized: 'Noransaek', vietnamese: 'Màu vàng', category: 'Màu sắc' },
        { korean: '초록색', romanized: 'Choroksaek', vietnamese: 'Màu xanh lá', category: 'Màu sắc' }
      ]
    },
    {
      id: 4,
      title: 'Gia đình',
      words: [
        { korean: '아버지', romanized: 'Abeoji', vietnamese: 'Bố', category: 'Gia đình' },
        { korean: '어머니', romanized: 'Eomeoni', vietnamese: 'Mẹ', category: 'Gia đình' },
        { korean: '형', romanized: 'Hyeong', vietnamese: 'Anh trai (nam nói)', category: 'Gia đình' },
        { korean: '누나', romanized: 'Nuna', vietnamese: 'Chị gái (nam nói)', category: 'Gia đình' }
      ]
    }
  ];

  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (currentLesson < lessons.length) {
      generateQuestion();
    }
  }, [currentLesson]);

  const generateQuestion = () => {
    const lesson = lessons[currentLesson];
    const randomWord = lesson.words[Math.floor(Math.random() * lesson.words.length)];
    setCurrentWord(randomWord);

    // Generate wrong options
    const wrongOptions = lesson.words
      .filter(w => w.korean !== randomWord.korean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.vietnamese);

    // Mix correct and wrong answers
    const allOptions = [randomWord.vietnamese, ...wrongOptions]
      .sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
  };

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentWord.vietnamese;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 10);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      // Lesson complete
      setCurrentLesson(0);
      setScore(0);
      setStreak(0);
    }
    generateQuestion();
  };

  const currentLessonData = lessons[currentLesson];

  return (
    <div className="language-learning">
      <div className="learning-header">
        <h2>📚 Học tiếng Hàn cơ bản</h2>
        <p>Học từ vựng tiếng Hàn qua mini-game tương tác</p>
      </div>

      <div className="learning-content">
        <div className="learning-stats">
          <div className="stat-item">
            <div className="stat-value">{score}</div>
            <div className="stat-label">Điểm</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">🔥 {streak}</div>
            <div className="stat-label">Chuỗi đúng</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Bài {currentLesson + 1}/{lessons.length}</div>
            <div className="stat-label">{currentLessonData.title}</div>
          </div>
        </div>

        <div className="lesson-card">
          <div className="lesson-header">
            <h3>{currentLessonData.title}</h3>
            <div className="lesson-progress">
              {lessons.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`progress-dot ${idx === currentLesson ? 'active' : idx < currentLesson ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>

          {currentWord && (
            <>
              <div className="word-display">
                <div className="korean-word">{currentWord.korean}</div>
                <div className="romanized">{currentWord.romanized}</div>
                <div className="category-badge">{currentWord.category}</div>
              </div>

              <div className="question">
                <p>Nghĩa của từ này là gì?</p>
                <div className="options-grid">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      className={`option-btn ${
                        showResult 
                          ? option === currentWord.vietnamese 
                            ? 'correct' 
                            : selectedAnswer === option 
                              ? 'wrong' 
                              : ''
                          : ''
                      }`}
                      onClick={() => handleAnswer(option)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={showResult}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="result-feedback"
            >
              {isCorrect ? (
                <div className="feedback correct-feedback">
                  <div className="feedback-icon">✓</div>
                  <div className="feedback-text">
                    <h4>Chính xác!</h4>
                    <p>Bạn đã trả lời đúng. Tiếp tục phát huy!</p>
                  </div>
                </div>
              ) : (
                <div className="feedback wrong-feedback">
                  <div className="feedback-icon">✗</div>
                  <div className="feedback-text">
                    <h4>Sai rồi!</h4>
                    <p>Đáp án đúng là: <strong>{currentWord.vietnamese}</strong></p>
                  </div>
                </div>
              )}
              <button className="next-btn" onClick={nextQuestion}>
                Câu tiếp theo →
              </button>
            </motion.div>
          )}
        </div>

        <div className="vocabulary-list">
          <h3>Từ vựng trong bài</h3>
          <div className="words-grid">
            {currentLessonData.words.map((word, index) => (
              <div key={index} className="vocab-item">
                <div className="vocab-korean">{word.korean}</div>
                <div className="vocab-romanized">{word.romanized}</div>
                <div className="vocab-vietnamese">{word.vietnamese}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageLearning;
