import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addPoints, POINTS_REWARDS, showPointsNotification } from '../utils/pointsSystem';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const [progress, setProgress] = useState({
    profileCreated: false,
    documentsSubmitted: false,
    schoolSelected: false,
    visaApplied: false,
    visaApproved: false,
    flightBooked: false
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'profileCreated',
      title: 'Tạo hồ sơ',
      description: 'Đăng ký và điền thông tin cơ bản',
      icon: '📝',
      completed: progress.profileCreated
    },
    {
      id: 'documentsSubmitted',
      title: 'Nộp tài liệu',
      description: 'Chuẩn bị và nộp các giấy tờ cần thiết',
      icon: '📄',
      completed: progress.documentsSubmitted
    },
    {
      id: 'schoolSelected',
      title: 'Chọn trường',
      description: 'Xác nhận trường đại học muốn theo học',
      icon: '🏫',
      completed: progress.schoolSelected
    },
    {
      id: 'visaApplied',
      title: 'Nộp hồ sơ visa',
      description: 'Hoàn tất thủ tục xin visa',
      icon: '✈️',
      completed: progress.visaApplied
    },
    {
      id: 'visaApproved',
      title: 'Visa được chấp thuận',
      description: 'Nhận kết quả visa từ đại sứ quán',
      icon: '✅',
      completed: progress.visaApproved
    },
    {
      id: 'flightBooked',
      title: 'Đặt vé máy bay',
      description: 'Hoàn tất đặt vé và chuẩn bị lên đường',
      icon: '🎫',
      completed: progress.flightBooked
    }
  ];

  // Calculate progress percentage
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('duhocProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress(parsed);
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('duhocProgress', JSON.stringify(progress));
    
    // Update current step
    const completedCount = steps.filter(step => progress[step.id]).length;
    setCurrentStep(completedCount);
  }, [progress]);

  const toggleStep = (stepId) => {
    setProgress(prev => {
      const wasCompleted = prev[stepId];
      const newProgress = {
        ...prev,
        [stepId]: !prev[stepId]
      };
      
      // Add points when completing a step (only when marking as complete, not uncomplete)
      if (!wasCompleted && newProgress[stepId]) {
        const result = addPoints(POINTS_REWARDS.PROGRESS_STEP_COMPLETE, 'progress_step');
        showPointsNotification(POINTS_REWARDS.PROGRESS_STEP_COMPLETE, result.badgeAwarded);
        
        // Check if all steps are completed
        const allCompleted = steps.every(step => {
          if (step.id === stepId) return true;
          return newProgress[step.id];
        });
        
        if (allCompleted) {
          const progressCompleted = localStorage.getItem('progressAllCompleted');
          if (!progressCompleted) {
            localStorage.setItem('progressAllCompleted', 'true');
            const badgeResult = addPoints(0, 'progress_complete');
            if (badgeResult.badgeAwarded) {
              showPointsNotification(0, badgeResult.badgeAwarded);
            }
          }
        }
      }
      
      return newProgress;
    });
  };

  const getDeadline = (stepIndex) => {
    const today = new Date();
    const deadlines = [
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
      new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days
      new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
      new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days
      new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000), // 60 days
    ];
    return deadlines[stepIndex] || today;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h2>📊 Theo dõi tiến độ hồ sơ du học</h2>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <div className="steps-container">
        {steps.map((step, index) => {
          const isCompleted = progress[step.id];
          const isActive = index === currentStep && !isCompleted;
          const deadline = getDeadline(index);
          const isOverdue = new Date() > deadline && !isCompleted;

          return (
            <motion.div
              key={step.id}
              className={`step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''} ${isOverdue ? 'overdue' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <div className="step-icon">{step.icon}</div>
                  {isCompleted && (
                    <div className="checkmark">✓</div>
                  )}
                </div>
                <div className="step-info">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                  {!isCompleted && (
                    <div className="step-deadline">
                      <span className="deadline-label">Hạn chót:</span>
                      <span className={`deadline-date ${isOverdue ? 'overdue' : ''}`}>
                        {formatDate(deadline)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  className="step-toggle"
                  onClick={() => toggleStep(step.id)}
                  aria-label={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                >
                  {isCompleted ? '✓' : '○'}
                </button>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${isCompleted ? 'completed' : ''}`} />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="progress-summary">
        <div className="summary-item">
          <span className="summary-label">Đã hoàn thành:</span>
          <span className="summary-value">{completedSteps}/{steps.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Còn lại:</span>
          <span className="summary-value">{steps.length - completedSteps} bước</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

