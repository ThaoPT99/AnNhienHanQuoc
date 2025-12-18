import React from 'react';
import GamificationComponent from '../components/Gamification';
import SEO from '../components/SEO';
import './Gamification.css';

const Gamification = () => {
  return (
    <div className="gamification-page">
      <SEO
        title="Hệ thống điểm thưởng - Du học An Nhiên"
        description="Kiếm điểm, nhận badge và lên cấp khi sử dụng website Du học An Nhiên. Tham gia bảng xếp hạng và nhận phần thưởng!"
        keywords="điểm thưởng, badge, leaderboard, gamification, phần thưởng du học"
      />
      <GamificationComponent />
    </div>
  );
};

export default Gamification;

