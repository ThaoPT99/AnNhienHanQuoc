import React from 'react';
import ProgressTrackerComponent from '../components/ProgressTracker';
import SEO from '../components/SEO';
import './ProgressTracker.css';

const ProgressTracker = () => {
  return (
    <div className="progress-tracker-page">
      <SEO
        title="Theo dõi tiến độ hồ sơ - Du học An Nhiên"
        description="Theo dõi tiến độ làm hồ sơ du học Hàn Quốc của bạn. Checklist từng bước và deadline quan trọng."
        keywords="theo dõi hồ sơ du học, checklist du học, tiến độ visa"
      />
      <div className="progress-tracker-container">
        <ProgressTrackerComponent />
      </div>
    </div>
  );
};

export default ProgressTracker;

